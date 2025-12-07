# Entrega N°2 - Backend con Mocking

## Descripción

Proyecto backend con funcionalidad de mocking para generar usuarios y mascotas ficticios. Incluye:
- API REST completa con Express
- Documentación interactiva con Swagger
- Tests unitarios y funcionales (Mocha, Chai, SuperTest, Sinon)
- Dockerización completa
- Base de datos MongoDB

## 🚀 Inicio Rápido

### Opción 1: Ejecutar con Docker

```bash
# 1. Clonar el repositorio
git clone https://github.com/maurogalday/backend-entrega-1
cd entrega1

# 2. Levantar MongoDB
docker-compose up -d

# 3. Instalar dependencias
npm install

# 4. Ejecutar
# Modo desarrollo
npm run dev

# Modo producción
npm start

# 5. Consumir aplicacion
 http://localhost:8080
 http://localhost:8080/api-docs (Swagger)
```

### Opción 2: Ejecutar desde Docker Hub

```bash
# 1. Descargar imagen desde Docker Hub
docker pull mauroalday/entrega2-backend-coderhouse:latest

# 2. Levantar MongoDB
docker-compose up -d

# 3. Ejecutar el contenedor
docker run -p 8080:8080 -e MONGODB_URI=mongodb://host.docker.internal:27017/mockingdb --name backend-test mauroalday/entrega2-backend-coderhouse:latest

# 4. Consumir aplicacion
http://localhost:8080
http://localhost:8080/api-docs (Swagger)
```
### Variables de entorno

Crear un archivo `.env` en la raíz del proyecto (opcional, ya tiene valores por defecto):

```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/mockingdb
NODE_ENV=development
```

## Endpoints

### Swagger

http://localhost:8080/api-docs

### Mocks

- **GET** `/api/mocks/mockingusers` - Genera 50 usuarios ficticios
- **GET** `/api/mocks/mockingpets` - Genera 50 mascotas ficticias
- **POST** `/api/mocks/generateData` - Genera e inserta usuarios y mascotas en la BD
  ```json
  {
    "users": 10,
    "pets": 20
  }
  ```

### Users

- **GET** `/api/users` - Obtiene todos los usuarios
- **GET** `/api/users/:id` - Obtiene un usuario por ID

### Pets

- **GET** `/api/pets` - Obtiene todas las mascotas
- **GET** `/api/pets/:id` - Obtiene una mascota por ID

## Arquitectura del Proyecto

Este proyecto sigue una arquitectura por capas con separación de responsabilidades:

```
Router → Service → Model → Database
```

### Capas

- **Routers**: Manejan las peticiones HTTP, validaciones básicas y respuestas
- **Services**: Contienen la lógica de negocio y operaciones con la base de datos
- **Models**: Definen los esquemas de Mongoose
- **Utils**: Funciones auxiliares reutilizables (generación de datos mock)
- **Tests**: Verifican el funcionamiento de la aplicación
  - **Tests Unitarios**: Prueban componentes aislados con mocks
  - **Tests E2E**: Prueban flujos completos de la aplicación

## Estructura del Proyecto

```
entrega2-backend-coderhouse/
├── src/
│   ├── app.js              # Servidor Express principal
│   ├── config/
│   │   ├── database.js     # Configuración de MongoDB
│   │   └── swagger.js      # Configuración de Swagger
│   ├── models/
│   │   ├── User.model.js   # Modelo de Usuario (Mongoose)
│   │   └── Pet.model.js    # Modelo de Mascota (Mongoose)
│   ├── services/           
│   │   ├── user.service.js # Servicio de usuarios (CRUD + lógica)
│   │   ├── pet.service.js  # Servicio de mascotas (CRUD + lógica)
│   │   └── mock.service.js # Servicio de generación de datos mock
│   ├── routes/
│   │   ├── mocks.router.js # Router de mocking (HTTP)
│   │   ├── users.router.js # Router de usuarios (HTTP)
│   │   └── pets.router.js  # Router de mascotas (HTTP)
│   └── utils/
│       └── mocking.js      # Funciones de generación de datos con Faker
├── test/
│   ├── unit/               # Tests unitarios (con mocks)
│   │   ├── user.service.test.js  # Tests del servicio de usuarios
│   │   ├── pet.service.test.js   # Tests del servicio de mascotas
│   │   └── mocking.test.js       # Tests de utilidades de mocking
│   ├── users.test.js       # Tests E2E de endpoints de usuarios
│   ├── pets.test.js        # Tests E2E de endpoints de mascotas
│   └── setup.js            # Configuración global de tests (hooks compartidos)
├── .mocharc.json           # Configuración de Mocha
├── Dockerfile              # Configuración de Docker
├── docker-compose.yml      # Orquestación de MongoDB
├── package.json
└── README.md
```

## Características de los Usuarios Generados

- `first_name`: Nombre aleatorio
- `last_name`: Apellido aleatorio
- `email`: Email único aleatorio
- `password`: "coder123" encriptado con bcrypt
- `role`: "user" o "admin" (aleatorio)
- `pets`: Array vacío []

## Características de las Mascotas Generadas

- `name`: Nombre aleatorio
- `species`: Dog, Cat, Bird, Rabbit, Hamster, o Fish
- `breed`: Raza aleatoria
- `age`: Entre 0 y 15 años
- `adopted`: true o false (aleatorio)

## 🧪 Testing

El proyecto incluye **59 tests** (43 unitarios + 16 funcionales) utilizando Mocha, Chai, SuperTest y Sinon.

### Ejecutar Tests

```bash
# Asegúrate de que MongoDB esté corriendo
docker-compose up -d

# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch
```

### Estructura de Tests

**Tests Funcionales** (16 tests):
- `test/users.test.js` - Tests E2E para endpoints de usuarios
- `test/pets.test.js` - Tests E2E para endpoints de mascotas

**Tests Unitarios** (43 tests):
- `test/unit/user.service.test.js` - Tests del servicio de usuarios (con mocks)
- `test/unit/pet.service.test.js` - Tests del servicio de mascotas (con mocks)
- `test/unit/mocking.test.js` - Tests de utilidades de generación de datos

Los tests verifican:
- ✅ Respuestas exitosas (200)
- ✅ Manejo de errores (404, 500)
- ✅ Validación de esquemas de respuesta
- ✅ Población de relaciones (usuarios con mascotas, mascotas con dueños)
- ✅ Lógica de negocio aislada (con mocks)

## 🐳 Docker

### Imagen de Docker

La imagen de Docker del proyecto está disponible en Docker Hub:

**🔗 [mauroalday/entrega2-backend-coderhouse](https://hub.docker.com/r/mauroalday/entrega2-backend-coderhouse)**

### Ejecutar desde Docker Hub (Rápido)

```bash
# 1. Levantar MongoDB
docker-compose up -d

# 2. Ejecutar la imagen (PowerShell)
docker run -p 8080:8080 -e MONGODB_URI=mongodb://host.docker.internal:27017/mockingdb --name backend-test mauroalday/entrega2-backend-coderhouse:latest

# Para bash/Linux/Mac:
docker run -p 8080:8080 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/mockingdb \
  --name backend-test \
  mauroalday/entrega2-backend-coderhouse:latest

# 3. Acceder a http://localhost:8080
```

### Construir la Imagen Localmente

```bash
# Construir la imagen local
docker build -t entrega2-backend-coderhouse .

# Construir con tag específico
docker build -t mauroalday/entrega2-backend-coderhouse:1.0.0 .
```

### Ejecutar el Contenedor Local

```bash
# PowerShell (una línea)
docker run -p 8080:8080 -e MONGODB_URI=mongodb://host.docker.internal:27017/mockingdb entrega2-backend-coderhouse

# Bash/Linux/Mac
docker run -p 8080:8080 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/mockingdb \
  entrega2-backend-coderhouse
```

### Detener y Limpiar

```bash
docker stop backend-test
docker rm backend-test
```

### Subir la Imagen a Docker Hub

```bash
# Iniciar sesión en Docker Hub
docker login

# Etiquetar la imagen
docker tag entrega2-backend-coderhouse mauroalday/entrega2-backend-coderhouse:latest

# Subir la imagen
docker push mauroalday/entrega2-backend-coderhouse:latest
```

### Docker Compose

El proyecto incluye un `docker-compose.yml` que configura MongoDB:

```bash
# Levantar MongoDB
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Ver estado
docker ps
```

## 📚 Documentación API

La documentación completa de la API está disponible mediante Swagger UI:

**🔗 http://localhost:8080/api-docs**

La documentación incluye:
- ✅ Descripción de todos los endpoints
- ✅ Esquemas de datos (Users, Pets)
- ✅ Ejemplos de solicitudes y respuestas
- ✅ Códigos de estado HTTP
- ✅ Interfaz interactiva para probar endpoints


## 🧪 Ejemplo de Uso

```bash
# 1. Generar datos de prueba
curl -X POST http://localhost:8080/api/mocks/generateData \
  -H "Content-Type: application/json" \
  -d '{"users": 5, "pets": 10}'

# 2. Obtener usuarios
curl http://localhost:8080/api/users

# 3. Obtener mascotas
curl http://localhost:8080/api/pets

# 4. Ver usuarios mock (sin insertar en BD)
curl http://localhost:8080/api/mocks/mockingusers
```