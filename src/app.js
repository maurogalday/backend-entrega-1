import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import mocksRouter from './routes/mocks.router.js';

// Configuración de variables de entorno
dotenv.config();

// Inicialización de la aplicación
const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a la base de datos
connectDB();

// Rutas
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Backend Entrega N°1 - Mocking API',
    endpoints: {
      mocks: {
        mockingusers: 'GET /api/mocks/mockingusers',
        mockingpets: 'GET /api/mocks/mockingpets',
        generateData: 'POST /api/mocks/generateData'
      },
      users: {
        getAll: 'GET /api/users',
        getById: 'GET /api/users/:id'
      },
      pets: {
        getAll: 'GET /api/pets',
        getById: 'GET /api/pets/:id'
      }
    }
  });
});

app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/mocks', mocksRouter);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint no encontrado'
  });
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`🚀 Entrega N°1 - Servidor corriendo en http://localhost:${PORT}`);
});

export default app;

