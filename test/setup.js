import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuración de base de datos de prueba
const MONGODB_TEST_URI = process.env.MONGODB_TEST_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/mockingdb_test';

// Exportar configuración para que otros archivos la usen
export { MONGODB_TEST_URI };

// Estado de la conexión
let isConnected = false;

// Helper para conectar a la base de datos
export async function connectTestDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return; // Ya está conectado
  }

  try {
    // Cerrar cualquier conexión existente
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    
    // Conectar a la base de datos de prueba
    await mongoose.connect(MONGODB_TEST_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    // Esperar a que db esté disponible
    let retries = 0;
    while (!mongoose.connection.db && retries < 20) {
      await new Promise(resolve => setTimeout(resolve, 100));
      retries++;
    }
    
    // Verificar con un ping que realmente funcione
    if (mongoose.connection.db) {
      await mongoose.connection.db.admin().ping();
      isConnected = true;
      console.log('✅ Test database connected');
    } else {
      throw new Error('Database not available after connection');
    }
  } catch (error) {
    console.error('❌ Error connecting to test database:', error);
    console.error('URI:', MONGODB_TEST_URI);
    throw error;
  }
}

// Helper para cerrar la conexión
export async function closeTestDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    isConnected = false;
    console.log('✅ Test database connection closed');
  }
}

// Helper para limpiar las colecciones
export async function clearTestDB() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    if (collection) {
      await collection.deleteMany({});
    }
  }
}

// Hook loader para Mocha - se ejecuta globalmente para TODOS los tests
export const mochaHooks = {
  async beforeAll() {
    console.log('🔧 Ejecutando mochaHooks.beforeAll()...');
    await connectTestDB();
    // Pequeña pausa adicional para asegurar que todo esté listo
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  async afterEach() {
    try {
      await clearTestDB();
    } catch (error) {
      console.error('Error cleaning test database:', error);
    }
  },

  async afterAll() {
    console.log('🔧 Ejecutando mochaHooks.afterAll()...');
    await closeTestDB();
  }
};

