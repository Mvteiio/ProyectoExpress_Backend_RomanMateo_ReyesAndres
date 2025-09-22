const Database = require('../db'); 

class UserRepository {
    constructor() {
        this.collectionName = 'users'; 
        this.collection = null; 
    }

    async getCollection() {
        if (!this.collection) {
            const dbInstance = await Database.getInstance();
            this.collection = dbInstance.db.collection(this.collectionName);
        }
        return this.collection;
    }

    async create(user) {
        const collection = await this.getCollection();
        const result = await collection.insertOne(user);
        return collection.findOne({ _id: result.insertedId });
    }

    async findByEmail(email) {
        const collection = await this.getCollection();
        const result = await collection.findOne({email: email});
        return result;
    }

    async findAll() {
        const collection = await this.getCollection();
        const result = await collection.find({}).toArray();
        return result;
    }

    async delete(id) {
        const collection = await this.getCollection();
        const result = await collection.deleteOne({ identificacion: Number(id) });
        return result; 
    }
}

module.exports = new UserRepository(); 