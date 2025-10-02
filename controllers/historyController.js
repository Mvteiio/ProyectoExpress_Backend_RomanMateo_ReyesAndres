// En un nuevo archivo: controllers/historyController.js
const HistoryRepository = require('../repositories/historyRepository');

class HistoryController {
    async getUserHistory(req, res) {
        try {
            const userId = req.user._id;
            const filters = req.query; 

            const history = await HistoryRepository.findByUserId(userId, filters);

            res.status(200).json({ data: history });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = HistoryController;