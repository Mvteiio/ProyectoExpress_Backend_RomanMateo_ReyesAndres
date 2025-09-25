const ReviewsRepository = require('../repositories/reviewsRepository');
const InteractionsRepository = require('../repositories/interactionsRepository');
const { ObjectId } = require('mongodb');

class reviewsController {
    constructor(){
        
    }

    async createReview(req, res) {
        try {

            const { movieId, title, comment, rating } = req.body;

            const ratingNum = Number(rating)
            const movieIdObject = new ObjectId(movieId);

           
            const userId = req.user._id; 

            const reviewData = {
                contentId: movieIdObject,
                userId: userId, 
                title,
                comment,
                ratingNum,
                createdAt: new Date()
            };

            const newReview = await ReviewsRepository.create(reviewData);

            res.status(201).json({ msg: "Reseña creada con éxito", data: newReview });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async updateReview(req, res) {
    try {
        const { id: reviewId } = req.params;
        const userId = req.user._id; 
        const updateData = req.body; 

        const existingReview = await ReviewsRepository.findById(reviewId);

        if (!existingReview) {
            return res.status(404).json({ msg: "Reseña no encontrada" });
        }

        if (existingReview.userId.toString() !== userId.toString()) {
            return res.status(403).json({ msg: "No tienes permiso para actualizar esta reseña" });
        }

        await ReviewsRepository.update(reviewId, updateData);

        res.status(200).json({ msg: "Reseña actualizada con éxito" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

    async deleteReview(req, res) {
        try {
            const { id: reviewId } = req.params; 
            const userId = req.user._id;       

           
            const existingReview = await ReviewsRepository.findById(reviewId);

            if (!existingReview) {
                return res.status(404).json({ msg: "Reseña no encontrada" });
            }

            if (existingReview.userId.toString() !== userId.toString()) {
                return res.status(403).json({ msg: "No tienes permiso para eliminar esta reseña" });
            }

            await ReviewsRepository.deleteById(reviewId);

            res.status(200).json({ msg: "Reseña eliminada con éxito" });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async likeReview(req, res) {
        try {
            const { id: reviewId } = req.params; 
            const userId = req.user._id;        

            // 1. Buscamos la reseña para asegurarnos de que existe y no es del propio usuario
            const review = await ReviewsRepository.findById(reviewId);
            if (!review) {
                return res.status(404).json({ msg: "Reseña no encontrada" });
            }

            // REGLA: Un usuario no puede dar like a su propia reseña
            if (review.userId.toString() === userId.toString()) {
                return res.status(403).json({ msg: "No puedes dar like a tu propia reseña" });
            }


            const existingInteraction = await InteractionsRepository.findOne(userId, reviewId);

            let message = "";

            if (existingInteraction) {
                // Si la interacción previa era un 'like', lo quitamos (toggle)
                if (existingInteraction.type === 'like') {
                    await InteractionsRepository.delete(existingInteraction._id);
                    message = "Like eliminado con éxito";
                } else {
                    // Si era 'dislike', la cambiamos a 'like'
                    await InteractionsRepository.update(existingInteraction._id, { type: 'like' });
                    message = "Interacción cambiada a like";
                }
            } else {
                // Si no hay interacción previa, creamos el 'like'
                await InteractionsRepository.create({ userId, reviewId, type: 'like' });
                message = "Like añadido con éxito";
            }

            res.status(200).json({ msg: message });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }      
    
    async dislikeReview(req, res) {
    try {
        const { id: reviewId } = req.params;
        const userId = req.user._id;

        const review = await ReviewsRepository.findById(reviewId);
        if (!review) {
            return res.status(404).json({ msg: "Reseña no encontrada" });
        }

        if (review.userId.toString() === userId.toString()) {
            return res.status(403).json({ msg: "No puedes dar dislike a tu propia reseña" });
        }

        const existingInteraction = await InteractionsRepository.findOne(userId, reviewId);

        let message = "";

        if (existingInteraction) {
            // Si la interacción previa era un 'dislike', lo quitamos (toggle)
            if (existingInteraction.type === 'dislike') {
                await InteractionsRepository.delete(existingInteraction._id);
                message = "Dislike eliminado con éxito";
            } else {
                // Si era 'like', la cambiamos a 'dislike'
                await InteractionsRepository.update(existingInteraction._id, { type: 'dislike' });
                message = "Interacción cambiada a dislike";
            }
        } else {
            // Si no hay interacción previa, creamos el 'dislike'
            await InteractionsRepository.create({ userId, reviewId, type: 'dislike' });
            message = "Dislike añadido con éxito";
        }

        res.status(200).json({ msg: message });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
    
}

module.exports = reviewsController;
