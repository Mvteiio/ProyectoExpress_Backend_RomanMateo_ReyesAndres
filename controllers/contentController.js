const CategoriesRepository = require('../repositories/categoriesRepository');
const ContentRepository = require('../repositories/contentRepository')

class categoriesController {
    constructor(){
        
    }

    async createMovie(req, res){
        try {
            const {title, description, year, imageUrl, categoryIds} = req.body;
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
                categoryIds,
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
            const {category} = req.query;
            let categoryId = null;
    
            if (category) {
                const categoryDoc = await CategoriesRepository.findByName(category);    
    
                if (categoryDoc) {
                    categoryId = categoryDoc._id; 
                } else {
                    return res.status(200).json({ data: [] });
                }
            }
    
            const movies = await ContentRepository.findAll({categoryId});
    
            res.status(200).json({
                msg: "Películas obtenidas con éxito",
                data: movies
            });
    
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // async getAllCategories(req, res){
    //     try{
    //         const categories = await CategoriesRepository.findAll();
    //         res.status(200).json({
    //             msg: "Todas las categorias",
    //             data: categories
    //         })
    //     }
    //     catch(err){
    //         res.status(500).json({error: err.message});
    //     }
    // }

    // async updateCategory(req, res){
    //     try {
    //         const { id } = req.params;
    //         const { name } = req.body;

    //         await CategoriesRepository.update(id, { name }); 

    //         res.status(200).json({
    //             msg: "Categoría actualizada con éxito."
    //         })
    //     } catch(err) {
    //         res.status(500).json({error: err.message});
    //     }
    // }

    // async deleteCategory(req, res){
    //     try {
    //         const { id } = req.params;

    //         await CategoriesRepository.delete(id); 
    //         res.status(200).json({
    //             msg: "Categoría eliminada con éxito."
    //         })
    //     } catch(err) {
    //         res.status(500).json({error: err.message});
    //     }
    // }

}

module.exports = categoriesController;