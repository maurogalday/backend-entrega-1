# Entrega N°1 - Backend con Mocking

## Descripción

Proyecto backend con funcionalidad de mocking para generar usuarios y mascotas ficticios.

## Instalación

## Configuración

### Paso 1: Instalar dependencias

```bash
npm install
```

### Paso 2: Levantar MongoDB con Docker

```bash
docker-compose up -d
```

Verifica que MongoDB esté corriendo:

```bash
docker ps
```

### Variables de entorno

El archivo `.env` ya está configurado con:

```
PORT=8080
MONGODB_URI=mongodb://localhost:27017/mockingdb
```

## Ejecución

```bash
# Levantar MongoDB
docker-compose up -d

# Modo desarrollo
npm run dev

# Modo producción
npm start
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

## Estructura del Proyecto

```
entrega1/
├── src/
│   ├── app.js              # Servidor Express principal
│   ├── config/
│   │   └── database.js     # Configuración de MongoDB
|   |   └── swagger.js      # Configuración de Swagger   
│   ├── models/
│   │   ├── User.model.js   # Modelo de Usuario
│   │   └── Pet.model.js    # Modelo de Mascota
│   ├── routes/
│   │   ├── mocks.router.js # Router de mocking 
│   │   ├── users.router.js # Router de usuarios
│   │   └── pets.router.js  # Router de mascotas
│   └── utils/
│       └── mocking.js      # Funciones de generación de datos
├── docker-compose.yml      # Configuración de Docker
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
