import { expect } from 'chai';
import sinon from 'sinon';
import petService from '../../src/services/pet.service.js';
import Pet from '../../src/models/Pet.model.js';

describe('Pet Service - Tests Unitarios', () => {
  let findStub, findByIdStub, findByIdAndUpdateStub, findByIdAndDeleteStub, countDocumentsStub;

  beforeEach(() => {
    // Crear stubs para los métodos de Mongoose
    findStub = sinon.stub(Pet, 'find');
    findByIdStub = sinon.stub(Pet, 'findById');
    findByIdAndUpdateStub = sinon.stub(Pet, 'findByIdAndUpdate');
    findByIdAndDeleteStub = sinon.stub(Pet, 'findByIdAndDelete');
    countDocumentsStub = sinon.stub(Pet, 'countDocuments');
  });

  afterEach(() => {
    // Restaurar todos los stubs
    sinon.restore();
  });

  describe('getAllPets()', () => {
    it('debería retornar todas las mascotas con populate de owner', async () => {
      const mockPets = [
        { _id: '1', name: 'Max', species: 'Dog', age: 3, adopted: false, owner: null },
        { _id: '2', name: 'Luna', species: 'Cat', age: 2, adopted: true, owner: null }
      ];

      const populateStub = sinon.stub().resolves(mockPets);
      findStub.returns({ populate: populateStub });

      const result = await petService.getAllPets();

      expect(findStub.calledOnce).to.be.true;
      expect(populateStub.calledWith('owner')).to.be.true;
      expect(result).to.deep.equal(mockPets);
      expect(result).to.have.lengthOf(2);
    });

    it('debería retornar un array vacío cuando no hay mascotas', async () => {
      const populateStub = sinon.stub().resolves([]);
      findStub.returns({ populate: populateStub });

      const result = await petService.getAllPets();

      expect(result).to.be.an('array').that.is.empty;
    });
  });

  describe('getPetById()', () => {
    it('debería retornar una mascota por su ID', async () => {
      const mockPet = {
        _id: '123',
        name: 'Max',
        species: 'Dog',
        breed: 'Golden Retriever',
        age: 3,
        adopted: false
      };

      const populateStub = sinon.stub().resolves(mockPet);
      findByIdStub.returns({ populate: populateStub });

      const result = await petService.getPetById('123');

      expect(findByIdStub.calledWith('123')).to.be.true;
      expect(populateStub.calledWith('owner')).to.be.true;
      expect(result).to.deep.equal(mockPet);
    });

    it('debería retornar null cuando la mascota no existe', async () => {
      const populateStub = sinon.stub().resolves(null);
      findByIdStub.returns({ populate: populateStub });

      const result = await petService.getPetById('999');

      expect(result).to.be.null;
    });
  });

  describe('createPet()', () => {
    it('debería crear una nueva mascota correctamente', async () => {
      const petData = {
        name: 'Bella',
        species: 'Dog',
        breed: 'Labrador',
        age: 1,
        adopted: false
      };

      const mockSavedPet = { _id: '456', ...petData };

      // Mock del constructor y el método save
      const saveStub = sinon.stub().resolves(mockSavedPet);
      sinon.stub(Pet.prototype, 'save').callsFake(saveStub);

      const result = await petService.createPet(petData);

      expect(saveStub.calledOnce).to.be.true;
      expect(result).to.deep.equal(mockSavedPet);
    });
  });

  describe('updatePet()', () => {
    it('debería actualizar una mascota existente', async () => {
      const petId = '123';
      const updateData = { adopted: true };
      const mockUpdatedPet = {
        _id: petId,
        name: 'Max',
        species: 'Dog',
        age: 3,
        adopted: true
      };

      const populateStub = sinon.stub().resolves(mockUpdatedPet);
      findByIdAndUpdateStub.returns({ populate: populateStub });

      const result = await petService.updatePet(petId, updateData);

      expect(findByIdAndUpdateStub.calledWith(petId, updateData)).to.be.true;
      expect(result.adopted).to.be.true;
    });

    it('debería retornar null cuando la mascota a actualizar no existe', async () => {
      const populateStub = sinon.stub().resolves(null);
      findByIdAndUpdateStub.returns({ populate: populateStub });

      const result = await petService.updatePet('999', { adopted: true });

      expect(result).to.be.null;
    });
  });

  describe('deletePet()', () => {
    it('debería eliminar una mascota existente', async () => {
      const petId = '123';
      const mockDeletedPet = {
        _id: petId,
        name: 'Max',
        species: 'Dog'
      };

      findByIdAndDeleteStub.resolves(mockDeletedPet);

      const result = await petService.deletePet(petId);

      expect(findByIdAndDeleteStub.calledWith(petId)).to.be.true;
      expect(result).to.deep.equal(mockDeletedPet);
    });

    it('debería retornar null cuando la mascota a eliminar no existe', async () => {
      findByIdAndDeleteStub.resolves(null);

      const result = await petService.deletePet('999');

      expect(result).to.be.null;
    });
  });

  describe('countPets()', () => {
    it('debería retornar el número total de mascotas', async () => {
      countDocumentsStub.resolves(15);

      const result = await petService.countPets();

      expect(countDocumentsStub.calledOnce).to.be.true;
      expect(result).to.equal(15);
    });

    it('debería retornar 0 cuando no hay mascotas', async () => {
      countDocumentsStub.resolves(0);

      const result = await petService.countPets();

      expect(result).to.equal(0);
    });
  });

  describe('getAvailablePets()', () => {
    it('debería retornar solo mascotas no adoptadas', async () => {
      const mockAvailablePets = [
        { _id: '1', name: 'Max', adopted: false },
        { _id: '2', name: 'Bella', adopted: false }
      ];

      const populateStub = sinon.stub().resolves(mockAvailablePets);
      findStub.returns({ populate: populateStub });

      const result = await petService.getAvailablePets();

      expect(findStub.calledWith({ adopted: false })).to.be.true;
      expect(result).to.have.lengthOf(2);
      expect(result.every(pet => pet.adopted === false)).to.be.true;
    });
  });

  describe('getAdoptedPets()', () => {
    it('debería retornar solo mascotas adoptadas', async () => {
      const mockAdoptedPets = [
        { _id: '1', name: 'Luna', adopted: true },
        { _id: '2', name: 'Rocky', adopted: true }
      ];

      const populateStub = sinon.stub().resolves(mockAdoptedPets);
      findStub.returns({ populate: populateStub });

      const result = await petService.getAdoptedPets();

      expect(findStub.calledWith({ adopted: true })).to.be.true;
      expect(result).to.have.lengthOf(2);
      expect(result.every(pet => pet.adopted === true)).to.be.true;
    });
  });

  describe('findPetsByCriteria()', () => {
    it('debería buscar mascotas por criterios específicos', async () => {
      const criteria = { species: 'Dog' };
      const mockDogs = [
        { _id: '1', name: 'Max', species: 'Dog' },
        { _id: '2', name: 'Bella', species: 'Dog' }
      ];

      const populateStub = sinon.stub().resolves(mockDogs);
      findStub.returns({ populate: populateStub });

      const result = await petService.findPetsByCriteria(criteria);

      expect(findStub.calledWith(criteria)).to.be.true;
      expect(result).to.have.lengthOf(2);
      expect(result[0].species).to.equal('Dog');
    });
  });
});

