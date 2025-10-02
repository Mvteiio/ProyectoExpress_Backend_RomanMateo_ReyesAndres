const express = require('express');
const passport = require('passport');
const HistoryController = require('../controllers/historyController');

const router = express.Router();
const controller = new HistoryController();

// Ruta protegida para que solo el usuario logueado vea su propio historial
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => controller.getUserHistory(req, res)
);

module.exports = router;