import User from '../models/User.model.js';

/**
 * Servicio para la gestión de usuarios
 */
class UserService {
  /**
   * Obtiene todos los usuarios con sus mascotas pobladas
   * @returns {Promise<Array>} Array de usuarios
   */
  async getAllUsers() {
    return await User.find().populate('pets');
  }

  /**
   * Obtiene un usuario por su ID con sus mascotas pobladas
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  async getUserById(userId) {
    return await User.findById(userId).populate('pets');
  }

  /**
   * Crea un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Usuario creado
   */
  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  /**
   * Crea múltiples usuarios de forma masiva
   * @param {Array} usersData - Array de datos de usuarios
   * @returns {Promise<Array>} Usuarios creados
   */
  async createMultipleUsers(usersData) {
    return await User.insertMany(usersData);
  }

  /**
   * Actualiza un usuario por su ID
   * @param {string} userId - ID del usuario
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object|null>} Usuario actualizado o null
   */
  async updateUser(userId, updateData) {
    return await User.findByIdAndUpdate(userId, updateData, { 
      new: true,
      runValidators: true 
    }).populate('pets');
  }

  /**
   * Elimina un usuario por su ID
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object|null>} Usuario eliminado o null
   */
  async deleteUser(userId) {
    return await User.findByIdAndDelete(userId);
  }

  /**
   * Busca usuarios por criterios específicos
   * @param {Object} criteria - Criterios de búsqueda
   * @returns {Promise<Array>} Usuarios encontrados
   */
  async findUsersByCriteria(criteria) {
    return await User.find(criteria).populate('pets');
  }

  /**
   * Cuenta el total de usuarios
   * @returns {Promise<number>} Número de usuarios
   */
  async countUsers() {
    return await User.countDocuments();
  }
}

export default new UserService();

