const { ObjectId } = require('mongodb');
const Database = require('../db');

class InteractionsRepository {
    constructor() {
        this.collectionName = 'interactions';
        this.collection = null;
    }

    async getCollection() {
        if (!this.collection) {
            const dbInstance = await Database.getInstance();
            this.collection = dbInstance.db.collection(this.collectionName);
        }
        return this.collection;
    }
    
    async findOne(userId, reviewId) {
        const collection = await this.getCollection();
        return await collection.findOne({ 
            userId: new ObjectId(userId), 
            reviewId: new ObjectId(reviewId) 
        });
    }

    async create(data) {
        const collection = await this.getCollection();
        const interactionData = {
            userId: new ObjectId(data.userId),
            reviewId: new ObjectId(data.reviewId),
            type: data.type,
            createdAt: new Date()
        };
        return await collection.insertOne(interactionData);
    }
    
    async update(id, data) {
        const collection = await this.getCollection();
        return await collection.updateOne({ _id: new ObjectId(id) }, { $set: data });
    }

    async delete(id) {
        const collection = await this.getCollection();
        return await collection.deleteOne({ _id: new ObjectId(id) });
    }
}

module.exports = new InteractionsRepository();