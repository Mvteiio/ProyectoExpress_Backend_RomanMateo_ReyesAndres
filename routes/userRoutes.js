const express = require("express");
const UserController = require("../controllers/userController");
const passport = require("passport")

// import { checkRole } from "./authMiddleware.js";

const router = express.Router();
const userController = new UserController();


//Rutas públicas
router.post("/register", (req, res)=> userController.register(req, res))
router.post("/login", (req, res)=> userController.login(req, res))

// Rutas protegidas
//  1. Ruta accesible solo para el rol 'docente'
router.get("/dashboard-docente", 
    passport.authenticate('jwt', { session: false }), 
    checkRole(['docente']),                          
    (req, res) => {
        res.json({ msg: "Bienvenido al dashboard de Docente", user: req.user });
    }
);

//  2. Ruta accesible para 'docente' y 'camper'
// router.put("/update", 
//     passport.authenticate('jwt', { session: false }),
//     checkRole(['docente', 'camper']), // Ambos roles pueden actualizar su perfil
//     (req, res) => userController.updateUser(req, res)
// );

//  3. Ruta de administración solo para 'docente'
// router.delete("/user/:id",
//     passport.authenticate('jwt', { session: false }),
//     checkRole(['docente']),
//     (req, res) => {
//         // Lógica para borrar un usuario
//         res.json({ msg: `Usuario con id ${req.params.id} borrado por un docente.` });
//     }
// );

module.exports = router;