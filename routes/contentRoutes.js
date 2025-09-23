const express = require("express");
const ContentController = require("../controllers/contentController");
const passport = require("passport")

const { checkRole } = require("../authMiddleware.js");

const router = express.Router();
const contentController = new ContentController();

router.post(
        "/", 
        passport.authenticate('jwt', { session: false }),
        checkRole(['administrador']),
        (req, res)=> contentController.createMovie(req, res))

router.get(
        "/", 
        (req, res)=> contentController.getAllMovies(req, res))

// router.put(
//         "/:id", 
//         passport.authenticate('jwt', { session: false }),
//         checkRole(['administrador']),
//         (req, res)=> categoriesController.updateCategory(req, res))

// router.delete(
//         "/:id", 
//         passport.authenticate('jwt', { session: false }),
//         checkRole(['administrador']),
//         (req, res)=> categoriesController.deleteCategory(req, res))

module.exports = router;