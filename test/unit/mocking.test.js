import { expect } from 'chai';
import { generateUser, generatePet } from '../../src/utils/mocking.js';

describe('Mocking Utils - Tests Unitarios', () => {
  describe('generateUser()', () => {
    it('debería generar un usuario con todas las propiedades requeridas', async () => {
      const user = await generateUser();

      expect(user).to.have.property('first_name');
      expect(user).to.have.property('last_name');
      expect(user).to.have.property('email');
      expect(user).to.have.property('password');
      expect(user).to.have.property('role');
      expect(user).to.have.property('pets');
    });

    it('debería generar un email válido', async () => {
      const user = await generateUser();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      expect(user.email).to.match(emailRegex);
    });

    it('debería generar first_name como string no vacío', async () => {
      const user = await generateUser();

      expect(user.first_name).to.be.a('string');
      expect(user.first_name).to.not.be.empty;
    });

    it('debería generar last_name como string no vacío', async () => {
      const user = await generateUser();

      expect(user.last_name).to.be.a('string');
      expect(user.last_name).to.not.be.empty;
    });

    it('debería generar password como string no vacío', async () => {
      const user = await generateUser();

      expect(user.password).to.be.a('string');
      expect(user.password).to.not.be.empty;
    });

    it('debería generar role como user o admin', async () => {
      const user = await generateUser();

      expect(user.role).to.be.oneOf(['user', 'admin']);
    });

    it('debería inicializar pets como array vacío', async () => {
      const user = await generateUser();

      expect(user.pets).to.be.an('array');
      expect(user.pets).to.be.empty;
    });

    it('debería generar múltiples usuarios diferentes', async () => {
      const user1 = await generateUser();
      const user2 = await generateUser();

      // Al menos el email debería ser diferente (muy probable con faker)
      expect(user1.email).to.not.equal(user2.email);
    });
  });

  describe('generatePet()', () => {
    it('debería generar una mascota con todas las propiedades requeridas', () => {
      const pet = generatePet();

      expect(pet).to.have.property('name');
      expect(pet).to.have.property('species');
      expect(pet).to.have.property('breed');
      expect(pet).to.have.property('age');
      expect(pet).to.have.property('adopted');
    });

    it('debería generar name como string no vacío', () => {
      const pet = generatePet();

      expect(pet.name).to.be.a('string');
      expect(pet.name).to.not.be.empty;
    });

    it('debería generar species de las opciones válidas', () => {
      const pet = generatePet();
      const validSpecies = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish'];

      expect(pet.species).to.be.oneOf(validSpecies);
    });

    it('debería generar breed como string no vacío', () => {
      const pet = generatePet();

      expect(pet.breed).to.be.a('string');
      expect(pet.breed).to.not.be.empty;
    });

    it('debería generar age como número entre 0 y 15', () => {
      const pet = generatePet();

      expect(pet.age).to.be.a('number');
      expect(pet.age).to.be.at.least(0);
      expect(pet.age).to.be.at.most(15);
    });

    it('debería generar adopted como booleano', () => {
      const pet = generatePet();

      expect(pet.adopted).to.be.a('boolean');
    });

    it('debería generar múltiples mascotas diferentes', () => {
      const pet1 = generatePet();
      const pet2 = generatePet();

      // Al menos el nombre debería ser diferente (muy probable con faker)
      expect(pet1.name).to.not.equal(pet2.name);
    });

    it('debería generar age como número entero', () => {
      const pet = generatePet();

      expect(pet.age % 1).to.equal(0);
    });

    it('debería generar aproximadamente 50% adopted true y 50% false', () => {
      const pets = [];
      for (let i = 0; i < 100; i++) {
        pets.push(generatePet());
      }

      const adoptedCount = pets.filter(p => p.adopted).length;
      
      // Permitir un margen razonable (entre 30% y 70%)
      expect(adoptedCount).to.be.at.least(30);
      expect(adoptedCount).to.be.at.most(70);
    });
  });
});

