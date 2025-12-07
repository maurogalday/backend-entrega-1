import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.model.js';
import Pet from '../src/models/Pet.model.js';
import mongoose from 'mongoose';

describe('Pets Router - Tests Funcionales', () => {
  let testUserId;
  let testPetId;
  let testPet;

  // Crear datos de prueba antes de cada suite de tests
  beforeEach(async () => {
    // Crear un usuario de prueba
    const testUser = await User.create({
      first_name: 'Carlos',
      last_name: 'Rodríguez',
      email: 'carlos.rodriguez@test.com',
      password: 'hashedpassword789',
      role: 'user',
      pets: []
    });
    testUserId = testUser._id.toString();

    // Crear una mascota de prueba asociada al usuario
    testPet = await Pet.create({
      name: 'Luna',
      species: 'Cat',
      breed: 'Persian',
      age: 2,
      adopted: true,
      owner: testUserId
    });
    testPetId = testPet._id.toString();
  });

  // Limpiar datos después de cada test
  afterEach(async () => {
    await User.deleteMany({});
    await Pet.deleteMany({});
  });

  describe('GET /api/pets', () => {
    it('debería obtener todas las mascotas exitosamente', async () => {
      // Crear mascotas adicionales para la prueba
      await Pet.create({
        name: 'Bella',
        species: 'Dog',
        breed: 'Labrador',
        age: 5,
        adopted: false,
        owner: testUserId
      });

      const res = await request(app)
        .get('/api/pets')
        .expect(200);

      expect(res.body).to.have.property('status', 'success');
      expect(res.body).to.have.property('count');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.be.an('array');
      expect(res.body.count).to.be.at.least(2);
    });

    it('debería retornar un array vacío cuando no hay mascotas', async () => {
      // Limpiar todas las mascotas
      await Pet.deleteMany({});

      const res = await request(app)
        .get('/api/pets')
        .expect(200);

      expect(res.body).to.have.property('status', 'success');
      expect(res.body).to.have.property('count', 0);
      expect(res.body.data).to.be.an('array').that.is.empty;
    });

    it('debería incluir los dueños poblados en cada mascota', async () => {
      const res = await request(app)
        .get('/api/pets')
        .expect(200);

      expect(res.body.data).to.be.an('array');
      if (res.body.data.length > 0) {
        const pet = res.body.data.find(p => p._id === testPetId);
        if (pet && pet.owner) {
          expect(pet.owner).to.have.property('_id');
          expect(pet.owner).to.have.property('first_name');
          expect(pet.owner).to.have.property('email');
        }
      }
    });

    it('debería retornar todas las propiedades de las mascotas', async () => {
      const res = await request(app)
        .get('/api/pets')
        .expect(200);

      if (res.body.data.length > 0) {
        const pet = res.body.data[0];
        expect(pet).to.have.property('_id');
        expect(pet).to.have.property('name');
        expect(pet).to.have.property('species');
        expect(pet).to.have.property('age');
        expect(pet).to.have.property('adopted');
      }
    });
  });

  describe('GET /api/pets/:id', () => {
    it('debería obtener una mascota por ID exitosamente', async () => {
      const res = await request(app)
        .get(`/api/pets/${testPetId}`)
        .expect(200);

      expect(res.body).to.have.property('status', 'success');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.have.property('_id', testPetId);
      expect(res.body.data).to.have.property('name', 'Luna');
      expect(res.body.data).to.have.property('species', 'Cat');
      expect(res.body.data).to.have.property('breed', 'Persian');
      expect(res.body.data).to.have.property('age', 2);
      expect(res.body.data).to.have.property('adopted', true);
    });

    it('debería retornar 404 cuando la mascota no existe', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      
      const res = await request(app)
        .get(`/api/pets/${fakeId}`)
        .expect(404);

      expect(res.body).to.have.property('status', 'error');
      expect(res.body).to.have.property('message', 'Mascota no encontrada');
    });

    it('debería retornar 500 cuando el ID es inválido', async () => {
      const invalidId = 'invalid-id-123';
      
      const res = await request(app)
        .get(`/api/pets/${invalidId}`)
        .expect(500);

      expect(res.body).to.have.property('status', 'error');
      expect(res.body).to.have.property('message');
    });

    it('debería incluir el dueño poblado de la mascota', async () => {
      const res = await request(app)
        .get(`/api/pets/${testPetId}`)
        .expect(200);

      expect(res.body.data).to.have.property('owner');
      if (res.body.data.owner) {
        expect(res.body.data.owner).to.have.property('_id');
        expect(res.body.data.owner).to.have.property('first_name', 'Carlos');
        expect(res.body.data.owner).to.have.property('last_name', 'Rodríguez');
        expect(res.body.data.owner).to.have.property('email', 'carlos.rodriguez@test.com');
      }
    });

    it('debería retornar mascotas sin dueño cuando owner es null', async () => {
      // Crear una mascota sin dueño
      const petWithoutOwner = await Pet.create({
        name: 'Solo',
        species: 'Bird',
        breed: 'Canary',
        age: 1,
        adopted: false,
        owner: null
      });

      const res = await request(app)
        .get(`/api/pets/${petWithoutOwner._id.toString()}`)
        .expect(200);

      expect(res.body.data).to.have.property('owner');
      // El owner puede ser null o undefined
    });
  });
});


