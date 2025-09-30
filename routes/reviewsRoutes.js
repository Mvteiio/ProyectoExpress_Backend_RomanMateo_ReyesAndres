const express = require("express");
const ReviewsController = require("../controllers/reviewsController");
const passport = require("passport")


const router = express.Router();
const reviewsController = new ReviewsController();

router.post(
        "/", 
        passport.authenticate('jwt', { session: false }),
        (req, res)=> reviewsController.createReview(req, res))

router.put(
    '/:id',
    passport.authenticate('jwt', { session: false }), // Solo verificamos que esté logueado
    (req, res) => reviewsController.updateReview(req, res)
);

router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }), // Se asegura de que el usuario esté logueado
    (req, res) => reviewsController.deleteReview(req, res)
);

router.post(
    '/:id/like', // La ruta es una acción sobre una reseña específica
    passport.authenticate('jwt', { session: false }),
    (req, res) => reviewsController.likeReview(req, res)
);

router.post(
    '/:id/dislike',
    passport.authenticate('jwt', { session: false }),
    (req, res) => reviewsController.dislikeReview(req, res)
);

router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => controller.deleteReview(req, res)
);

module.exports = router;