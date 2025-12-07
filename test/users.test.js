import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.model.js';
import Pet from '../src/models/Pet.model.js';
import mongoose from 'mongoose';

describe('Users Router - Tests Funcionales', () => {
  let testUserId;
  let testUser;
  let testPetId;

  // Crear datos de prueba antes de cada suite de tests
  beforeEach(async () => {
    // Crear un usuario de prueba
    testUser = await User.create({
      first_name: 'Juan',
      last_name: 'Pérez',
      email: 'juan.perez@test.com',
      password: 'hashedpassword123',
      role: 'user',
      pets: []
    });
    testUserId = testUser._id.toString();

    // Crear una mascota de prueba asociada al usuario
    const testPet = await Pet.create({
      name: 'Max',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: 3,
      adopted: false,
      owner: testUserId
    });
    testPetId = testPet._id.toString();

    // Asociar la mascota al usuario
    testUser.pets.push(testPetId);
    await testUser.save();
  });

  // Limpiar datos después de cada test
  afterEach(async () => {
    await User.deleteMany({});
    await Pet.deleteMany({});
  });

  describe('GET /api/users', () => {
    it('debería obtener todos los usuarios exitosamente', async () => {
      // Crear usuarios adicionales para la prueba
      await User.create({
        first_name: 'María',
        last_name: 'González',
        email: 'maria.gonzalez@test.com',
        password: 'hashedpassword456',
        role: 'user',
        pets: []
      });

      const res = await request(app)
        .get('/api/users')
        .expect(200);

      expect(res.body).to.have.property('status', 'success');
      expect(res.body).to.have.property('count');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.be.an('array');
      expect(res.body.count).to.be.at.least(2);
    });

    it('debería retornar un array vacío cuando no hay usuarios', async () => {
      // Limpiar todos los usuarios
      await User.deleteMany({});

      const res = await request(app)
        .get('/api/users')
        .expect(200);

      expect(res.body).to.have.property('status', 'success');
      expect(res.body).to.have.property('count', 0);
      expect(res.body.data).to.be.an('array').that.is.empty;
    });

    it('debería incluir las mascotas pobladas en cada usuario', async () => {
      const res = await request(app)
        .get('/api/users')
        .expect(200);

      expect(res.body.data).to.be.an('array');
      if (res.body.data.length > 0) {
        const user = res.body.data.find(u => u._id === testUserId);
        if (user && user.pets && user.pets.length > 0) {
          expect(user.pets[0]).to.have.property('_id');
          expect(user.pets[0]).to.have.property('name');
        }
      }
    });
  });

  describe('GET /api/users/:id', () => {
    it('debería obtener un usuario por ID exitosamente', async () => {
      const res = await request(app)
        .get(`/api/users/${testUserId}`)
        .expect(200);

      expect(res.body).to.have.property('status', 'success');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.have.property('_id', testUserId);
      expect(res.body.data).to.have.property('first_name', 'Juan');
      expect(res.body.data).to.have.property('last_name', 'Pérez');
      expect(res.body.data).to.have.property('email', 'juan.perez@test.com');
    });

    it('debería retornar 404 cuando el usuario no existe', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      
      const res = await request(app)
        .get(`/api/users/${fakeId}`)
        .expect(404);

      expect(res.body).to.have.property('status', 'error');
      expect(res.body).to.have.property('message', 'Usuario no encontrado');
    });

    it('debería retornar 500 cuando el ID es inválido', async () => {
      const invalidId = 'invalid-id-123';
      
      const res = await request(app)
        .get(`/api/users/${invalidId}`)
        .expect(500);

      expect(res.body).to.have.property('status', 'error');
      expect(res.body).to.have.property('message');
    });

    it('debería incluir las mascotas pobladas del usuario', async () => {
      const res = await request(app)
        .get(`/api/users/${testUserId}`)
        .expect(200);

      expect(res.body.data).to.have.property('pets');
      expect(res.body.data.pets).to.be.an('array');
      if (res.body.data.pets.length > 0) {
        expect(res.body.data.pets[0]).to.have.property('_id');
        expect(res.body.data.pets[0]).to.have.property('name', 'Max');
        expect(res.body.data.pets[0]).to.have.property('species', 'Dog');
      }
    });
  });
});


