const CategoriesRepository = require('../repositories/categoriesRepository');


class categoriesController {
    constructor(){
        
    }

    async createCategory(req, res){
        try {
            const {name} = req.body;
            const existingCategory = await CategoriesRepository.findById(name);

            if(existingCategory){
                res.status(400).json({
                    msg: "La categoria ya existe"
                });
            }

            const category = await CategoriesRepository.create({
                name,
                createdAt: new Date()
            });
            res.status(201).json({
                msg: "La categoria fue creada con exito",
                data: category
            })
        }   
        catch (err){
            res.status(500).json({error: err.message})
        }
    }

    async getAllCategories(req, res){
        try{
            const categories = await CategoriesRepository.findAll();
            res.status(200).json({
                msg: "Todas las categorias",
                data: categories
            })
        }
        catch(err){
            res.status(500).json({error: err.message});
        }
    }

    async updateCategory(req, res){
        try {
            const { id } = req.params;
            const { name } = req.body;

            await CategoriesRepository.update(id, { name }); 

            res.status(200).json({
                msg: "Categoría actualizada con éxito."
            })
        } catch(err) {
            res.status(500).json({error: err.message});
        }
    }

    async deleteCategory(req, res){
        try {
            const { id } = req.params;

            await CategoriesRepository.delete(id); 
            res.status(200).json({
                msg: "Categoría eliminada con éxito."
            })
        } catch(err) {
            res.status(500).json({error: err.message});
        }
    }

}

module.exports = categoriesController;