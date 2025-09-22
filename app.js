require('dotenv').config();

const express = require('express');
const Database = require('./db'); 
const userRoutes = require('./routes/userRoutes'); 

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Rutas de la API
app.use('/api/users', userRoutes);


async function startServer(){
    try {
        // Obtenemos la instancia de la DB. Esto la conecta si no lo está.
        await Database.getInstance();
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Falló el inicio del servidor', error);
        process.exit(1);
    }
}

startServer();