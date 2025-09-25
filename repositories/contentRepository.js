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
        const query = {};
    
        if (options.categoryId) {
            query.categoryIds = options.categoryId;
        }
    
        const result = await collection.find(query).toArray();
        return result;
    }

    async findByTitle(title){
        const collection = await this.getCollection();
        const result = await collection.findOne({ title: title});
        return result
    }

    async findByIdWithReviews(id) {
        const collection = await this.getCollection();

        const pipeline = [
                {
                    $match: { _id: new ObjectId(id) }
                },
                {
                    $lookup: {
                        from: 'reviews', 
                        let: { movieId: '$_id' },
                        pipeline: [
                            // --- Inicio del Pipeline Anidado ---
                            // 1. Encuentra solo las reseñas que pertenecen a esta película
                            { $match: { $expr: { $eq: ['$contentId', '$$movieId'] } } },
                            
                            // 2. Haz otro "JOIN", esta vez con las interacciones de cada reseña
                            {
                                $lookup: {
                                    from: 'interactions',
                                    localField: '_id',
                                    foreignField: 'reviewId',
                                    as: 'interactions'
                                }
                            },
                            
                            // 3. Añade los nuevos campos 'likeCount' y 'dislikeCount'
                            {
                                $addFields: {
                                    likeCount: {
                                        // Cuenta los elementos en el arreglo 'interactions' que son de tipo 'like'
                                        $size: {
                                            $filter: {
                                                input: '$interactions',
                                                as: 'interaction',
                                                cond: { $eq: ['$$interaction.type', 'like'] }
                                            }
                                        }
                                    },
                                    dislikeCount: {
                                        // Cuenta los elementos en el arreglo 'interactions' que son de tipo 'dislike'
                                        $size: {
                                            $filter: {
                                                input: '$interactions',
                                                as: 'interaction',
                                                cond: { $eq: ['$$interaction.type', 'dislike'] }
                                            }
                                        }
                                    }
                                }
                            },
                            // ETAPA FINAL: Proyecta para quedarte solo con los campos que necesitas.
                        {
                            $project: {
                                _id: 1, // 1 significa "incluir este campo"
                                contentId: 1,
                                userId: 1,
                                title: 1,
                                comment: 1,
                                rating: 1,
                                createdAt: 1,
                                likeCount: 1,
                                dislikeCount: 1
                                // Al no incluir 'movieId' o 'ratingNum', estos se descartan automáticamente.
                            }
                        }
                    ],
                    as: 'reviews'
                }
            }
        ];

        const result = await collection.aggregate(pipeline).toArray();
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