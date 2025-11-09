import Pet from '../models/Pet.model.js';

/**
 * Servicio para la gestión de mascotas
 */
class PetService {
  /**
   * Obtiene todas las mascotas con sus dueños poblados
   * @returns {Promise<Array>} Array de mascotas
   */
  async getAllPets() {
    return await Pet.find().populate('owner');
  }

  /**
   * Obtiene una mascota por su ID con su dueño poblado
   * @param {string} petId - ID de la mascota
   * @returns {Promise<Object|null>} Mascota encontrada o null
   */
  async getPetById(petId) {
    return await Pet.findById(petId).populate('owner');
  }

  /**
   * Crea una nueva mascota
   * @param {Object} petData - Datos de la mascota
   * @returns {Promise<Object>} Mascota creada
   */
  async createPet(petData) {
    const pet = new Pet(petData);
    return await pet.save();
  }

  /**
   * Crea múltiples mascotas de forma masiva
   * @param {Array} petsData - Array de datos de mascotas
   * @returns {Promise<Array>} Mascotas creadas
   */
  async createMultiplePets(petsData) {
    return await Pet.insertMany(petsData);
  }

  /**
   * Actualiza una mascota por su ID
   * @param {string} petId - ID de la mascota
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object|null>} Mascota actualizada o null
   */
  async updatePet(petId, updateData) {
    return await Pet.findByIdAndUpdate(petId, updateData, { 
      new: true,
      runValidators: true 
    }).populate('owner');
  }

  /**
   * Elimina una mascota por su ID
   * @param {string} petId - ID de la mascota
   * @returns {Promise<Object|null>} Mascota eliminada o null
   */
  async deletePet(petId) {
    return await Pet.findByIdAndDelete(petId);
  }

  /**
   * Busca mascotas por criterios específicos
   * @param {Object} criteria - Criterios de búsqueda
   * @returns {Promise<Array>} Mascotas encontradas
   */
  async findPetsByCriteria(criteria) {
    return await Pet.find(criteria).populate('owner');
  }

  /**
   * Cuenta el total de mascotas
   * @returns {Promise<number>} Número de mascotas
   */
  async countPets() {
    return await Pet.countDocuments();
  }

  /**
   * Obtiene mascotas disponibles para adopción
   * @returns {Promise<Array>} Mascotas no adoptadas
   */
  async getAvailablePets() {
    return await Pet.find({ adopted: false }).populate('owner');
  }

  /**
   * Obtiene mascotas adoptadas
   * @returns {Promise<Array>} Mascotas adoptadas
   */
  async getAdoptedPets() {
    return await Pet.find({ adopted: true }).populate('owner');
  }
}

export default new PetService();

