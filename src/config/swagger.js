import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend Entrega N°2 - Mocking API',
      version: '1.0.0',
      description: 'API para generar y gestionar usuarios y mascotas ficticias con funcionalidad de mocking',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Servidor de desarrollo'
      }
    ],
    tags: [
      {
        name: 'Mocks',
        description: 'Endpoints para generar datos ficticios'
      },
      {
        name: 'Users',
        description: 'Gestión de usuarios'
      },
      {
        name: 'Pets',
        description: 'Gestión de mascotas'
      }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['first_name', 'last_name', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID autogenerado por MongoDB',
              example: '673e5f9a8b2c1d3e4f5a6b7c'
            },
            first_name: {
              type: 'string',
              description: 'Nombre del usuario',
              example: 'Juan'
            },
            last_name: {
              type: 'string',
              description: 'Apellido del usuario',
              example: 'Pérez'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email único del usuario',
              example: 'juan.perez@example.com'
            },
            password: {
              type: 'string',
              description: 'Contraseña encriptada',
              example: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'Rol del usuario',
              example: 'user'
            },
            pets: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array de IDs de mascotas',
              example: []
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de actualización'
            }
          }
        },
        Pet: {
          type: 'object',
          required: ['name', 'species'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID autogenerado por MongoDB',
              example: '673e5f9a8b2c1d3e4f5a6b7d'
            },
            name: {
              type: 'string',
              description: 'Nombre de la mascota',
              example: 'Max'
            },
            species: {
              type: 'string',
              description: 'Especie de la mascota',
              example: 'Dog'
            },
            breed: {
              type: 'string',
              description: 'Raza de la mascota',
              example: 'Golden Retriever'
            },
            age: {
              type: 'number',
              minimum: 0,
              description: 'Edad de la mascota',
              example: 3
            },
            adopted: {
              type: 'boolean',
              description: 'Estado de adopción',
              example: false
            },
            owner: {
              type: 'string',
              description: 'ID del dueño',
              example: '673e5f9a8b2c1d3e4f5a6b7c'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de actualización'
            }
          }
        },
        GenerateDataRequest: {
          type: 'object',
          properties: {
            users: {
              type: 'number',
              description: 'Cantidad de usuarios a generar',
              example: 10,
              minimum: 0
            },
            pets: {
              type: 'number',
              description: 'Cantidad de mascotas a generar',
              example: 20,
              minimum: 0
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success'
            },
            message: {
              type: 'string'
            },
            count: {
              type: 'number'
            },
            data: {
              type: 'object'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error'
            },
            message: {
              type: 'string'
            }
          }
        }
      }
    }
  },
  apis: [
    join(__dirname, '../routes/*.js'),
    join(__dirname, '../app.js')
  ]
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

export default swaggerSpecs;

