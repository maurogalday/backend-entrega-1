import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/database.js';
import swaggerSpecs from './config/swagger.js';
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

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Backend Entrega N°1 - API Docs'
}));

// Rutas
/**
 * @swagger
 * /:
 *   get:
 *     summary: Endpoint raíz de la API
 *     description: Retorna información general sobre la API y sus endpoints disponibles
 *     responses:
 *       200:
 *         description: Información de la API
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 endpoints:
 *                   type: object
 */
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Backend Entrega N°1 - Mocking API',
    documentation: '📚 http://localhost:8080/api-docs',
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

