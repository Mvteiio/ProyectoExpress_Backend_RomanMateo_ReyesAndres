const { ObjectId } = require('mongodb');
const Database = require('../db'); 

class contentRepository {
    constructor() {
        this.collectionName = 'content'; 
        this.collection = null; 
    }

    async getCollection() {
        if (!this.collection) {
            const dbInstance = await Database.getInstance();
            this.collection = dbInstance.db.collection(this.collectionName);
        }
        return this.collection;
    }

    async create(content) {
        const collection = await this.getCollection();
        const result = await collection.insertOne(content);
        return collection.findOne({ _id: result.insertedId });
    }

    async findAll(options = {}) {
        const collection = await this.getCollection();

        const { categoryId, sortBy, search } = options;
        const pipeline = [];

        // --- ETAPA 1: $match (Filtro inicial) ---
        // Si se pasó un categoryId, lo aplicamos primero para reducir los documentos a procesar.
        const matchStage = {};
        if (categoryId) {
            matchStage.categoryIds = categoryId;
        }

        if (search) {
        // Usamos $regex para buscar texto que 'contenga' el término de búsqueda, esto es pa la barra de busqueda del front.
        // La opción 'i' lo hace insensible a mayúsculas/minúsculas.
        matchStage.title = { $regex: search, $options: 'i' };
        }

        // Añadimos la etapa de match al pipeline (aunque esté vacía, no afecta)
        pipeline.push({ $match: matchStage });

        // --- ETAPA 2: $lookup (Contar las reseñas) ---
        // Unimos con 'reviews' y contamos cuántas hay para cada película
        pipeline.push({
            $lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'contentId',
                as: 'reviews'
            }
        });

        // --- ETAPA 3: $addFields (Crear el campo de conteo) ---
        // Creamos un nuevo campo 'reviewCount' con el tamaño del arreglo 'reviews'
        pipeline.push({
            $addFields: {
                reviewCount: { $size: '$reviews' }
            }
        });

        // --- ETAPA 4: $sort (Ordenamiento dinámico) ---
        const sortStage = {};
        if (sortBy === 'popular') {
            sortStage.reviewCount = -1; // Ordenamos por el número de reseñas de mayor a menor
        }
        // Por defecto, podríamos ordenar por año o título si no se especifica 'popular'
        sortStage.year = -1; // Ordenar por año como fallback
        
        pipeline.push({ $sort: sortStage });

        // --- ETAPA 5: $project (Limpiar el resultado) ---
        // No queremos devolver el arreglo completo de reviews, solo el conteo
        pipeline.push({
            $project: {
                reviews: 0 // Excluimos el campo 'reviews' del resultado final
            }
        });

        const result = await collection.aggregate(pipeline).toArray();
        return result;
    }

    async findByTitle(title){
        const collection = await this.getCollection();
        const result = await collection.findOne({ title: title});
        return result
    }

    async findByIdWithReviews(id, userId = null) {
    const collection = await this.getCollection();
    
    // Convertimos userId a ObjectId si existe
    const userObjectId = userId ? new ObjectId(userId) : null;

    const pipeline = [
    { $match: { _id: new ObjectId(id) } },
    {
        $lookup: {
            from: 'reviews',
            let: { movieId: '$_id' },
            pipeline: [
                { $match: { $expr: { $eq: ['$contentId', '$$movieId'] } } },
                { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'authorDetails' } },
                { $lookup: { from: 'interactions', localField: '_id', foreignField: 'reviewId', as: 'interactions' } },
                {
                    $addFields: {
                        likeCount: { $size: { $filter: { input: '$interactions', cond: { $eq: ['$$this.type', 'like'] } } } },
                        dislikeCount: { $size: { $filter: { input: '$interactions', cond: { $eq: ['$$this.type', 'dislike'] } } } },
                        userInteraction: {
                            $filter: {
                                input: '$interactions',
                                cond: { $eq: ['$$this.userId', userObjectId] }
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        contentId: 1,
                        title: 1,
                        comment: 1,
                        rating: 1, // <-- Corregido para que no esté duplicado
                        createdAt: 1,
                        likeCount: 1,
                        dislikeCount: 1,
                        username: { $arrayElemAt: ['$authorDetails.username', 0] },
                        userInteractionType: { $arrayElemAt: ['$userInteraction.type', 0] }
                    }
                }
            ],
            as: 'reviews'
        }
    },
    { $addFields: { averageRating: { $avg: '$reviews.rating' } } }
];

        const result = await collection.aggregate(pipeline).toArray();
        console.log("Datos que el backend está a punto de enviar:", JSON.stringify(result, null, 2));
        return result[0];
    }

    async getRankedMovies() {
        const collection = await this.getCollection();
        const unaSemanaAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const pipeline = [
            // ETAPA 1: $lookup - Unir 'content' con sus 'reviews'.
            {
                $lookup: { from: 'reviews', localField: '_id', foreignField: 'contentId', as: 'reviews' }
            },
            // ETAPA 2: $unwind - "Desenrollar" el arreglo de reviews para procesar cada una.
            {
                $unwind: '$reviews'
            },
            // ETAPA 3: $lookup - Unir cada 'review' con sus 'interactions'.
            {
                $lookup: { from: 'interactions', localField: 'reviews._id', foreignField: 'reviewId', as: 'interactions' }
            },
            // ETAPA 4: $group - Agrupar por película para calcular todo.
            {
                $group: {
                    _id: '$_id', // Agrupamos por el ID de la película
                    title: { $first: '$title' }, // Mantenemos el título original
                    description: { $first: '$description' }, // Y la descripción
                    year: { $first: '$year' },
                    imageUrl: { $first: '$imageUrl' },
                    
                    // --- Aquí empiezan los cálculos ---
                    calificacionPromedio: { $avg: '$reviews.rating' },
                    totalLikes: {
                        $sum: { $size: { $filter: { input: '$interactions', cond: { $eq: ['$$this.type', 'like'] } } } }
                    },
                    totalDislikes: {
                        $sum: { $size: { $filter: { input: '$interactions', cond: { $eq: ['$$this.type', 'dislike'] } } } }
                    },
                    factorReciente: {
                        $sum: { $cond: [{ $gte: ['$reviews.createdAt', unaSemanaAtras] }, 1, 0] }
                    }
                }
            },
            // ETAPA 5: $addFields - Aplicar nuestra fórmula del 'scoreFinal'.
            {
                $addFields: {
                    impactoSocial: { $multiply: [{ $subtract: ['$totalLikes', '$totalDislikes'] }, 0.1] },
                    factorRecienteCalculado: { $multiply: ['$factorReciente', 0.25] }
                }
            },
            {
                $addFields: {
                    scoreFinal: { $add: ['$calificacionPromedio', '$impactoSocial', '$factorRecienteCalculado'] }
                }
            },
            // ETAPA 6: $sort - Ordenar los resultados por nuestro nuevo score.
            {
                $sort: { scoreFinal: -1 } // -1 para orden descendente
            },
            
        ];

        const result = await collection.aggregate(pipeline).toArray();
        return result;
    }

    async update(id, updateData) {
        const collection = await this.getCollection();
        
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        return result;
    }


    async delete(id) {
        const collection = await this.getCollection();
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        return result; 
    }
}

module.exports = new contentRepository(); 