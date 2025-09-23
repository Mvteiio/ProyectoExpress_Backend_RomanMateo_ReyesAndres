const express = require("express");
const CategoriesController = require("../controllers/categoriesController");
const passport = require("passport")

const { checkRole } = require("../authMiddleware.js");

const router = express.Router();
const categoriesController = new CategoriesController();

router.post(
        "/", 
        passport.authenticate('jwt', { session: false }),
        checkRole(['administrador']),
        (req, res)=> categoriesController.createCategory(req, res))

router.get(
        "/", 
        (req, res)=> categoriesController.getAllCategories(req, res))

router.put(
        "/:id", 
        passport.authenticate('jwt', { session: false }),
        checkRole(['administrador']),
        (req, res)=> categoriesController.updateCategory(req, res))

router.delete(
        "/:id", 
        passport.authenticate('jwt', { session: false }),
        checkRole(['administrador']),
        (req, res)=> categoriesController.deleteCategory(req, res))

module.exports = router;