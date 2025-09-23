const { ObjectId } = require('mongodb');
const Database = require('../db'); 

class UserRepository {
    constructor() {
        this.collectionName = 'content'; 
        this.collection = null; 
    }

    async getCollection() {
        if (!this.collection) {
            const dbInstance = await Database.getInstance();
            this.collection = dbInstance.db.collection(this.collectionName);
        }
        return this.collection;
    }

    async create(content) {
        const collection = await this.getCollection();
        const result = await collection.insertOne(content);
        return collection.findOne({ _id: result.insertedId });
    }

    async findAll(options = {}) {
        const collection = await this.getCollection();
        const query = {};
    
        if (options.categoryId) {
            query.categoryIds = options.categoryId;
        }
    
        const result = await collection.find(query).toArray();
        return result;
    }

    async findByTitle(title){
        const collection = await this.getCollection();
        const result = await collection.findOne({ title: title});
        return result
    }

    // async update(id, updatedCategory) {
    //     const collection = await this.getCollection();
    //     const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updatedCategory });                         
    //     return result; 
    // }

    // async delete(id) {
    //     const collection = await this.getCollection();
    //     const result = await collection.deleteOne({ _id: new ObjectId(id) });
    //     return result; 
    // }
}

module.exports = new UserRepository(); 