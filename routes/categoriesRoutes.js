const express = require("express");
const CategoriesController = require("../controllers/categoriesController");
const passport = require("passport")

const { checkRole } = require("../authMiddleware.js");

const router = express.Router();
const categoriesController = new CategoriesController();


//Rutas públicas
router.post(
        "/", 
        passport.authenticate('jwt', { session: false }),
        checkRole(['administrador']),
        (req, res)=> categoriesController.createCategory(req, res))

// router.put(
//     '/:id', 
//     passport.authenticate('jwt', { session: false }),
//     checkRole(['admin']),
//     (req, res) => controller.updateCategory(req, res)
// );
//  2. Ruta accesible para 'docente' y 'camper'
// router.put("/update", 
//     passport.authenticate('jwt', { session: false }),
//     checkRole(['docente', 'camper']), // Ambos roles pueden actualizar su perfil
//     (req, res) => userController.updateUser(req, res)
// );



module.exports = router;