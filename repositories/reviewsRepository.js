const { ObjectId } = require('mongodb');
const Database = require('../db'); 

class ReviewsRepository {
    constructor() {
        this.collectionName = 'reviews'; 
        this.collection = null; 
    }

    async getCollection() {
        if (!this.collection) {
            const dbInstance = await Database.getInstance();
            this.collection = dbInstance.db.collection(this.collectionName);
        }
        return this.collection;
    }

    async create(review) {
        const collection = await this.getCollection();
        const result = await collection.insertOne(review);
        return collection.findOne({ _id: result.insertedId });
    }

    async findById(id) {
        const collection = await this.getCollection();
        const result = await collection.findOne({ _id: new ObjectId(id) });
        return result;
    }

    async update(id, updateData) {
        const collection = await this.getCollection();
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
        return result;
    }

    async deleteById(id) {
        const collection = await this.getCollection();

        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        return result;
    }
}

module.exports = new ReviewsRepository(); 