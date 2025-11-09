import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

/**
 * Genera una contraseña encriptada
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<string>} Contraseña encriptada
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Genera un usuario ficticio con el formato de MongoDB
 * @returns {Promise<Object>} Usuario generado
 */
export const generateUser = async () => {
  const password = await hashPassword('coder123');
  const roles = ['user', 'admin'];
  
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: password,
    role: faker.helpers.arrayElement(roles),
    pets: []
  };
};

/**
 * Genera múltiples usuarios ficticios
 * @param {number} count - Cantidad de usuarios a generar
 * @returns {Promise<Array>} Array de usuarios generados
 */
export const generateUsers = async (count) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push(await generateUser());
  }
  return users;
};

/**
 * Genera una mascota ficticia con el formato de MongoDB
 * @returns {Object} Mascota generada
 */
export const generatePet = () => {
  const species = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish'];
  const selectedSpecies = faker.helpers.arrayElement(species);
  
  return {
    name: faker.person.firstName(),
    species: selectedSpecies,
    breed: faker.animal.type(),
    age: faker.number.int({ min: 0, max: 15 }),
    adopted: faker.datatype.boolean()
  };
};

/**
 * Genera múltiples mascotas ficticias
 * @param {number} count - Cantidad de mascotas a generar
 * @returns {Array} Array de mascotas generadas
 */
export const generatePets = (count) => {
  const pets = [];
  for (let i = 0; i < count; i++) {
    pets.push(generatePet());
  }
  return pets;
};

