import { generateUsers, generatePets } from '../utils/mocking.js';
import userService from './user.service.js';
import petService from './pet.service.js';

/**
 * Servicio para la gestión de datos de prueba (mocking)
 */
class MockService {
  /**
   * Genera usuarios ficticios sin insertarlos en la BD
   * @param {number} count - Cantidad de usuarios a generar
   * @returns {Promise<Array>} Usuarios generados
   */
  async generateMockUsers(count) {
    return await generateUsers(count);
  }

  /**
   * Genera mascotas ficticias sin insertarlas en la BD
   * @param {number} count - Cantidad de mascotas a generar
   * @returns {Array} Mascotas generadas
   */
  generateMockPets(count) {
    return generatePets(count);
  }

  /**
   * Genera e inserta datos de prueba en la base de datos
   * @param {Object} options - Opciones de generación
   * @param {number} options.users - Cantidad de usuarios a generar e insertar
   * @param {number} options.pets - Cantidad de mascotas a generar e insertar
   * @returns {Promise<Object>} Resultado de la operación con contadores
   */
  async generateAndInsertData({ users = 0, pets = 0 }) {
    const result = {
      users: {
        requested: users,
        inserted: 0
      },
      pets: {
        requested: pets,
        inserted: 0
      }
    };

    // Generar e insertar usuarios
    if (users > 0) {
      const generatedUsers = await generateUsers(users);
      const insertedUsers = await userService.createMultipleUsers(generatedUsers);
      result.users.inserted = insertedUsers.length;
    }

    // Generar e insertar mascotas
    if (pets > 0) {
      const generatedPets = generatePets(pets);
      const insertedPets = await petService.createMultiplePets(generatedPets);
      result.pets.inserted = insertedPets.length;
    }

    return result;
  }

  /**
   * Valida los parámetros de generación de datos
   * @param {Object} params - Parámetros a validar
   * @param {number} params.users - Cantidad de usuarios
   * @param {number} params.pets - Cantidad de mascotas
   * @returns {Object} Objeto con isValid y mensaje de error si aplica
   */
  validateGenerateDataParams({ users, pets }) {
    // Verificar que al menos uno de los parámetros esté presente
    if (!users && !pets) {
      return {
        isValid: false,
        message: 'Debe proporcionar al menos uno de los parámetros: users o pets'
      };
    }

    // Verificar que los parámetros sean números
    if ((users && typeof users !== 'number') || (pets && typeof pets !== 'number')) {
      return {
        isValid: false,
        message: 'Los parámetros users y pets deben ser números'
      };
    }

    // Verificar que los parámetros sean positivos
    if ((users && users < 0) || (pets && pets < 0)) {
      return {
        isValid: false,
        message: 'Los parámetros users y pets deben ser números positivos'
      };
    }

    return { isValid: true };
  }
}

export default new MockService();

