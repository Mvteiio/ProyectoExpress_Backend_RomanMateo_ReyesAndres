const CategoriesRepository = require('../repositories/categoriesRepository');
const ContentRepository = require('../repositories/contentRepository')
const { ObjectId } = require('mongodb');

class categoriesController {
    constructor(){
        
    }

    async createMovie(req, res){
        try {
            const {title, description, year, imageUrl, categoryIds} = req.body;
            const categoryObjectIds = categoryIds.map(id => new ObjectId(id));
            const existingMovie = await ContentRepository.findByTitle(title);

            if(existingMovie){
                res.status(400).json({
                    msg: "Esta pelicula ya existe"
                });
            }

            const movie = await ContentRepository.create({
                title,
                description,
                year,
                imageUrl,
                categoryIds: categoryObjectIds,
                createdAt: new Date()
            });
            res.status(201).json({
                msg: "La pelicula fue creada con exito",
                data: movie
            })
        }   
        catch (err){
            res.status(500).json({error: err.message})
        }
    }

    async getAllMovies(req, res) {

    try {
        const { category, sortBy, search } = req.query;
        let categoryId = null;

        if (category) {
            const categoryDoc = await CategoriesRepository.findByName(category);
            console.log('Documento de categoría encontrado:', categoryDoc);
            if (categoryDoc) {
                categoryId = categoryDoc._id;
            } else {
                return res.status(200).json({ data: [] });
            }
        }

        
        const movies = await ContentRepository.findAll({ categoryId, sortBy, search });

        res.status(200).json({
            msg: "Películas obtenidas con éxito",
            data: movies
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

    async getMovieById(req, res) {
        try {
            const { id } = req.params; 

            const movie = await ContentRepository.findByIdWithReviews(id);

            if (!movie) {
                return res.status(404).json({ msg: "Película no encontrada" });
            }

            res.status(200).json({
                msg: "Película obtenida con éxito",
                data: movie
            });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async getRankedMovies(req, res) {
    try {
        const movies = await ContentRepository.getRankedMovies();
        res.status(200).json({ data: movies });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


    async updateMovie(req, res) {
        try {
            const { id } = req.params; 
            const updateData = req.body; 

            const result = await ContentRepository.update(id, updateData);

            if (result.matchedCount === 0) {
                return res.status(404).json({ msg: "Película no encontrada" });
            }

            res.status(200).json({ msg: "Película actualizada con éxito" });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async deleteMovie(req, res){
        try {
            const { id } = req.params;

            await contentRepository.delete(id); 
            res.status(200).json({
                msg: "Pelicula eliminada con éxito."
            })
        } catch(err) {
            res.status(500).json({error: err.message});
        }
    }

}

module.exports = categoriesController;