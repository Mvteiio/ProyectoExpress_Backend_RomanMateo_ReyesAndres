const CategoriesRepository = require('../repositories/categoriesRepository');
const csvRepository = require('../repositories/csvRepository')
const { ObjectId } = require('mongodb');

class csvController {
    constructor(){
        
    }

    async createMovie(req, res){
        try {
            const {title, description, year, imageUrl, categoryIds} = req.body;
            const categoryObjectIds = categoryIds.map(id => new ObjectId(id));
            const csvExisting = await csvRepository.findByTitle(title);

            if(csvExisting){
                res.status(400).json({
                    msg: "Esta pelicula ya existe"
                });
            }

            const content = await csvRepository.create({
                title,
                description,
                year,
                imageUrl,
                categoryIds: categoryObjectIds,
                createdAt: new Date()
            });
            res.status(201).json({
                msg: "El csv fue creado con exito",
                data: content
            })
        }   
        catch (err){
            res.status(500).json({error: err.message})
        }
    }


    async getcontentById(req, res) {
        try {
            const { id } = req.params; 
            const userId = req.user ? req.user._id : null;

            const content = await csvRepository.findByIdWithReviews(id, userId);

            if (!content) {
                return res.status(404).json({ msg: "csv no creado" });
            }

            res.status(200).json({
                msg: "csv creado con exito",
                data: content
            });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

}


module.exports = csvController;