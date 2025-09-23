const { ObjectId } = require('mongodb');
const Database = require('../db'); 

class UserRepository {
    constructor() {
        this.collectionName = 'categories'; 
        this.collection = null; 
    }

    async getCollection() {
        if (!this.collection) {
            const dbInstance = await Database.getInstance();
            this.collection = dbInstance.db.collection(this.collectionName);
        }
        return this.collection;
    }

    async create(categories) {
        const collection = await this.getCollection();
        const result = await collection.insertOne(categories);
        return collection.findOne({ _id: result.insertedId });
    }

    async findById(name) {
        const collection = await this.getCollection();
        const result = await collection.findOne({name: name});
        return result;
    }

    async findAll() {
        const collection = await this.getCollection();
        const result = await collection.find({}).toArray();
        return result;
    }   

    async findByName(name) {
        const collection = await this.getCollection();
        // Búsqueda insensible a mayúsculas/minúsculas para mejor UX
        const result = await collection.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
        return result;
    }

    async update(id, updatedCategory) {
        const collection = await this.getCollection();
        const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updatedCategory });                         
        return result; 
    }

    async delete(id) {
        const collection = await this.getCollection();
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        return result; 
    }
}

module.exports = new UserRepository(); 