const { MongoClient } = require ('mongodb');

const uri = process.env.URI;
const dbName = process.env.DB_NAME;
let instance = null; 

class Database {
  constructor() {
    if (instance) {

      throw new Error("Ya existe una instancia de la base de datos. Usa getInstance().");
    }
    this.client = new MongoClient(uri);
    this.db = null;
  }

  static async getInstance() {
        if (!instance) {
            instance = new Database();
            await instance.connect();
        }
// Devolvemos la instancia completa para poder acceder a disconnect()
        return instance; 
    }

// Método para conectar la aplicación a MongoDB
  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(dbName);
      console.log('✅ Conectado a MongoDB');
    } catch (error) {
      console.error('❌ Error al conectar a MongoDB', error);
    }
  }

// Método para desconectar la aplicación a MongoDB
  async disconnect() {
        if (this.client) {
            await this.client.close();
            console.log('🔌 Desconectado de MongoDB');
        }
    }
}

module.exports=Database;