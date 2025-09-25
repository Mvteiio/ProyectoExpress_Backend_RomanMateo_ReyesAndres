require('dotenv').config();

const express = require('express');

const Database = require('./db'); 

const passport = require('passport'); 
const configureJwtStrategy = require('./config/passport-config');

const swaggerUi = require('swagger-ui-express'); 
const swaggerDocs = require('./swagger-docs');

const userRoutes = require('./routes/userRoutes'); 
const categoriesRoutes = require('./routes/categoriesRoutes');
const contentRoutes = require('./routes/contentRoutes');
const reviewsRoutes = require('./routes/reviewsRoutes');




const app = express();
app.use(express.json());

// --- CONFIGURACIÓN DE PASSPORT ---
app.use(passport.initialize());
configureJwtStrategy(passport);

const PORT = process.env.PORT || 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas de la API
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/categories', categoriesRoutes);
app.use('/api/v1/movies', contentRoutes);
app.use('/api/v1/reviews', reviewsRoutes);


async function startServer(){
    try {
        // Obtenemos la instancia de la DB. Esto la conecta si no lo está.
        await Database.getInstance();
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('Falló el inicio del servidor', error);
        process.exit(1);
    }
}

startServer();

