import { expect } from 'chai';
import sinon from 'sinon';
import userService from '../../src/services/user.service.js';
import User from '../../src/models/User.model.js';

describe('User Service - Tests Unitarios', () => {
  let findStub, findByIdStub, saveStub, findByIdAndUpdateStub, findByIdAndDeleteStub, countDocumentsStub;

  beforeEach(() => {
    // Crear stubs para los métodos de Mongoose
    findStub = sinon.stub(User, 'find');
    findByIdStub = sinon.stub(User, 'findById');
    findByIdAndUpdateStub = sinon.stub(User, 'findByIdAndUpdate');
    findByIdAndDeleteStub = sinon.stub(User, 'findByIdAndDelete');
    countDocumentsStub = sinon.stub(User, 'countDocuments');
  });

  afterEach(() => {
    // Restaurar todos los stubs
    sinon.restore();
  });

  describe('getAllUsers()', () => {
    it('debería retornar todos los usuarios con populate de pets', async () => {
      const mockUsers = [
        { _id: '1', first_name: 'Juan', last_name: 'Pérez', email: 'juan@test.com', pets: [] },
        { _id: '2', first_name: 'María', last_name: 'González', email: 'maria@test.com', pets: [] }
      ];

      const populateStub = sinon.stub().resolves(mockUsers);
      findStub.returns({ populate: populateStub });

      const result = await userService.getAllUsers();

      expect(findStub.calledOnce).to.be.true;
      expect(populateStub.calledWith('pets')).to.be.true;
      expect(result).to.deep.equal(mockUsers);
      expect(result).to.have.lengthOf(2);
    });

    it('debería retornar un array vacío cuando no hay usuarios', async () => {
      const populateStub = sinon.stub().resolves([]);
      findStub.returns({ populate: populateStub });

      const result = await userService.getAllUsers();

      expect(result).to.be.an('array').that.is.empty;
    });
  });

  describe('getUserById()', () => {
    it('debería retornar un usuario por su ID', async () => {
      const mockUser = {
        _id: '123',
        first_name: 'Juan',
        last_name: 'Pérez',
        email: 'juan@test.com',
        pets: []
      };

      const populateStub = sinon.stub().resolves(mockUser);
      findByIdStub.returns({ populate: populateStub });

      const result = await userService.getUserById('123');

      expect(findByIdStub.calledWith('123')).to.be.true;
      expect(populateStub.calledWith('pets')).to.be.true;
      expect(result).to.deep.equal(mockUser);
    });

    it('debería retornar null cuando el usuario no existe', async () => {
      const populateStub = sinon.stub().resolves(null);
      findByIdStub.returns({ populate: populateStub });

      const result = await userService.getUserById('999');

      expect(result).to.be.null;
    });
  });

  describe('createUser()', () => {
    it('debería crear un nuevo usuario correctamente', async () => {
      const userData = {
        first_name: 'Carlos',
        last_name: 'López',
        email: 'carlos@test.com',
        password: 'hashedpassword123',
        role: 'user'
      };

      const mockSavedUser = { _id: '456', ...userData };

      // Mock del constructor y el método save
      const saveStub = sinon.stub().resolves(mockSavedUser);
      sinon.stub(User.prototype, 'save').callsFake(saveStub);

      const result = await userService.createUser(userData);

      expect(saveStub.calledOnce).to.be.true;
      expect(result).to.deep.equal(mockSavedUser);
    });
  });

  describe('updateUser()', () => {
    it('debería actualizar un usuario existente', async () => {
      const userId = '123';
      const updateData = { first_name: 'Juan Carlos' };
      const mockUpdatedUser = {
        _id: userId,
        first_name: 'Juan Carlos',
        last_name: 'Pérez',
        email: 'juan@test.com'
      };

      const populateStub = sinon.stub().resolves(mockUpdatedUser);
      findByIdAndUpdateStub.returns({ populate: populateStub });

      const result = await userService.updateUser(userId, updateData);

      expect(findByIdAndUpdateStub.calledWith(userId, updateData)).to.be.true;
      expect(result).to.deep.equal(mockUpdatedUser);
    });

    it('debería retornar null cuando el usuario a actualizar no existe', async () => {
      const populateStub = sinon.stub().resolves(null);
      findByIdAndUpdateStub.returns({ populate: populateStub });

      const result = await userService.updateUser('999', { first_name: 'Test' });

      expect(result).to.be.null;
    });
  });

  describe('deleteUser()', () => {
    it('debería eliminar un usuario existente', async () => {
      const userId = '123';
      const mockDeletedUser = {
        _id: userId,
        first_name: 'Juan',
        last_name: 'Pérez',
        email: 'juan@test.com'
      };

      findByIdAndDeleteStub.resolves(mockDeletedUser);

      const result = await userService.deleteUser(userId);

      expect(findByIdAndDeleteStub.calledWith(userId)).to.be.true;
      expect(result).to.deep.equal(mockDeletedUser);
    });

    it('debería retornar null cuando el usuario a eliminar no existe', async () => {
      findByIdAndDeleteStub.resolves(null);

      const result = await userService.deleteUser('999');

      expect(result).to.be.null;
    });
  });

  describe('countUsers()', () => {
    it('debería retornar el número total de usuarios', async () => {
      countDocumentsStub.resolves(42);

      const result = await userService.countUsers();

      expect(countDocumentsStub.calledOnce).to.be.true;
      expect(result).to.equal(42);
    });

    it('debería retornar 0 cuando no hay usuarios', async () => {
      countDocumentsStub.resolves(0);

      const result = await userService.countUsers();

      expect(result).to.equal(0);
    });
  });

  describe('findUsersByCriteria()', () => {
    it('debería buscar usuarios por criterios específicos', async () => {
      const criteria = { role: 'admin' };
      const mockAdmins = [
        { _id: '1', first_name: 'Admin', role: 'admin', pets: [] },
        { _id: '2', first_name: 'Super', role: 'admin', pets: [] }
      ];

      const populateStub = sinon.stub().resolves(mockAdmins);
      findStub.returns({ populate: populateStub });

      const result = await userService.findUsersByCriteria(criteria);

      expect(findStub.calledWith(criteria)).to.be.true;
      expect(result).to.have.lengthOf(2);
      expect(result[0].role).to.equal('admin');
    });
  });
});

