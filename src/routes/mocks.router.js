import { Router } from 'express';
import { generateUsers, generatePets } from '../utils/mocking.js';
import User from '../models/User.model.js';
import Pet from '../models/Pet.model.js';

const router = Router();

/**
 * GET /api/mocks/mockingusers
 * Genera y devuelve 50 usuarios ficticios sin insertarlos en la BD
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
 * GET /api/mocks/mockingpets
 * Genera y devuelve 100 mascotas ficticias sin insertarlas en la BD
 */
router.get('/mockingpets', async (req, res) => {
  try {
    const pets = generatePets(100);
    res.status(200).json({
      status: 'success',
      count: pets.length,
      message: '100 mascotas ficticias generadas (no insertadas en BD)',
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
 * POST /api/mocks/generateData
 * Genera e inserta en la BD la cantidad especificada de usuarios y mascotas
 * Body: { "users": number, "pets": number }
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

