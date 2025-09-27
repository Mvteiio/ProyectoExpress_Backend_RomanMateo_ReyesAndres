require('dotenv').config();
const cors = require('cors');
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

const allowedOrigins = [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'https://andres8073562.github.io' 
];

const corsOptions = {
    origin: (origin, callback) => {
        // Permite peticiones sin origen (como las de Postman en algunas versiones o apps móviles)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    }
};

app.use(cors(corsOptions));

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

