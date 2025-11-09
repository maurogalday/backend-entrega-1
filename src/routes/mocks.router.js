import { Router } from 'express';
import { generateUsers, generatePets } from '../utils/mocking.js';
import User from '../models/User.model.js';
import Pet from '../models/Pet.model.js';

const router = Router();

/**
 * @swagger
 * /api/mocks/mockingusers:
 *   get:
 *     summary: Genera 50 usuarios ficticios
 *     description: Genera y devuelve 50 usuarios ficticios sin insertarlos en la base de datos. Los usuarios tienen la contraseña "coder123" encriptada, roles aleatorios (user/admin) y un array de pets vacío.
 *     tags: [Mocks]
 *     responses:
 *       200:
 *         description: Usuarios ficticios generados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 count:
 *                   type: number
 *                   example: 50
 *                 message:
 *                   type: string
 *                   example: 50 usuarios ficticios generados (no insertados en BD)
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/mockingusers', async (req, res) => {
  try {
    const users = await generateUsers(50);
    res.status(200).json({
      status: 'success',
      count: users.length,
      message: '50 usuarios ficticios generados (no insertados en BD)',
      data: users
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/mocks/mockingpets:
 *   get:
 *     summary: Genera 50 mascotas ficticias
 *     description: Genera y devuelve 50 mascotas ficticias sin insertarlas en la base de datos. Las mascotas tienen nombres, especies, razas y edades aleatorias.
 *     tags: [Mocks]
 *     responses:
 *       200:
 *         description: Mascotas ficticias generadas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 count:
 *                   type: number
 *                   example: 50
 *                 message:
 *                   type: string
 *                   example: 50 mascotas ficticias generadas (no insertadas en BD)
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pet'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/mockingpets', async (req, res) => {
  try {
    const pets = generatePets(50);
    res.status(200).json({
      status: 'success',
      count: pets.length,
      message: '50 mascotas ficticias generadas (no insertadas en BD)',
      data: pets
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/mocks/generateData:
 *   post:
 *     summary: Genera e inserta datos en la base de datos
 *     description: Genera e inserta la cantidad especificada de usuarios y mascotas en la base de datos. Los usuarios tendrán la contraseña "coder123" encriptada y roles aleatorios.
 *     tags: [Mocks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenerateDataRequest'
 *           examples:
 *             example1:
 *               summary: Generar usuarios y mascotas
 *               value:
 *                 users: 10
 *                 pets: 20
 *             example2:
 *               summary: Solo usuarios
 *               value:
 *                 users: 50
 *                 pets: 0
 *             example3:
 *               summary: Solo mascotas
 *               value:
 *                 users: 0
 *                 pets: 100
 *     responses:
 *       201:
 *         description: Datos generados e insertados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Datos generados e insertados correctamente en la base de datos
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: object
 *                       properties:
 *                         requested:
 *                           type: number
 *                           example: 10
 *                         inserted:
 *                           type: number
 *                           example: 10
 *                     pets:
 *                       type: object
 *                       properties:
 *                         requested:
 *                           type: number
 *                           example: 20
 *                         inserted:
 *                           type: number
 *                           example: 20
 *       400:
 *         description: Parámetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/generateData', async (req, res) => {
  try {
    const { users, pets } = req.body;

    // Validación de parámetros
    if (!users && !pets) {
      return res.status(400).json({
        status: 'error',
        message: 'Debe proporcionar al menos uno de los parámetros: users o pets'
      });
    }

    if ((users && typeof users !== 'number') || (pets && typeof pets !== 'number')) {
      return res.status(400).json({
        status: 'error',
        message: 'Los parámetros users y pets deben ser números'
      });
    }

    if ((users && users < 0) || (pets && pets < 0)) {
      return res.status(400).json({
        status: 'error',
        message: 'Los parámetros users y pets deben ser números positivos'
      });
    }

    const result = {
      users: {
        requested: users || 0,
        inserted: 0
      },
      pets: {
        requested: pets || 0,
        inserted: 0
      }
    };

    // Generar e insertar usuarios
    if (users && users > 0) {
      const generatedUsers = await generateUsers(users);
      const insertedUsers = await User.insertMany(generatedUsers);
      result.users.inserted = insertedUsers.length;
    }

    // Generar e insertar mascotas
    if (pets && pets > 0) {
      const generatedPets = generatePets(pets);
      const insertedPets = await Pet.insertMany(generatedPets);
      result.pets.inserted = insertedPets.length;
    }

    res.status(201).json({
      status: 'success',
      message: 'Datos generados e insertados correctamente en la base de datos',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;

