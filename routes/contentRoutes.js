const express = require("express");
const ContentController = require("../controllers/contentController");
const passport = require("passport")

const { checkRole } = require("../authMiddleware.js");

const router = express.Router();
const contentController = new ContentController();


router.get('/ranked',
         (req, res) => contentController.getRankedMovies(req, res));

router.post(
        "/", 
        passport.authenticate('jwt', { session: false }),
        checkRole(['administrador']),
        (req, res)=> contentController.createMovie(req, res))

router.get(
        "/", 
        (req, res)=> contentController.getAllMovies(req, res))

router.get('/:id', (req, res) => contentController.getMovieById(req, res));

router.put(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    checkRole(['administrador']),
    (req, res) => contentController.updateMovie(req, res)
);

router.delete(
        "/:id", 
        passport.authenticate('jwt', { session: false }),
        checkRole(['administrador']),
        (req, res)=> contentController.deleteMovie(req, res))

module.exports = router;