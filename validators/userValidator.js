// validators/userValidator.js

const { body } = require('express-validator');

// Creamos un arreglo de reglas de validación para el registro
const validateRegister = [
    body('username')
        .trim() // Elimina espacios en blanco al principio y al final
        .notEmpty().withMessage('El nombre de usuario es obligatorio.'),

    body('email')
        .isEmail().withMessage('Por favor, introduce un correo electrónico válido.')
        .normalizeEmail(), // Convierte el email a un formato estándar

    body('password')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.')
];

// Creamos otro arreglo para el login
const validateLogin = [
    body('email')
        .isEmail().withMessage('Por favor, introduce un correo electrónico válido.'),
    
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria.')
];


module.exports = {
    validateRegister,
    validateLogin
};