const express = require("express");
const UserController = require("../controllers/userController");
const { validateRegister, validateLogin } = require('../validators/userValidator');

const router = express.Router();
const userController = new UserController();

//Rutas públicas
router.post(
    "/register",
    validateRegister, 
    (req, res) => userController.register(req, res)
);

router.post(
    "/login",
    validateLogin, // <-- Y aquí también
    (req, res) => userController.login(req, res)
);

module.exports = router;