const { ObjectId } = require('mongodb');
const Database = require('../db');

class HistoryRepository {
    constructor() {
        this.collectionName = 'history';
        this.collection = null;
    }

    async getCollection() {
        if (!this.collection) {
            const dbInstance = await Database.getInstance();
            this.collection = dbInstance.db.collection(this.collectionName);
        }
        return this.collection;
    }
    
    async create(logData) {
        const collection = await this.getCollection();
        const entry = {
            userId: new ObjectId(logData.userId),
            actionType: logData.actionType, 
            targetId: new ObjectId(logData.targetId), 
            timestamp: new Date()
        };
        return await collection.insertOne(entry);
    }

    async findByUserId(userId, options = {}) {
        const collection = await this.getCollection();
        const { actionType, startDate, endDate } = options;
    
        const query = {
            userId: new ObjectId(userId)
        };
    
        if (actionType) {
            query.actionType = actionType;
        }
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }
    
        // Ordenamos por fecha
        return await collection.find(query).sort({ timestamp: -1 }).toArray();
    }
}

module.exports = new HistoryRepository();