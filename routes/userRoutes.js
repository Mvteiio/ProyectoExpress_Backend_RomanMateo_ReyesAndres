const express = require("express");
const UserController = require("../controllers/userController");

const router = express.Router();
const userController = new UserController();

//Rutas públicas
router.post("/register", (req, res)=> userController.register(req, res))
router.post("/login", (req, res)=> userController.login(req, res))


//  2. Ruta accesible para 'docente' y 'camper'
// router.put("/update", 
//     passport.authenticate('jwt', { session: false }),
//     checkRole(['docente', 'camper']), // Ambos roles pueden actualizar su perfil
//     (req, res) => userController.updateUser(req, res)
// );



module.exports = router;