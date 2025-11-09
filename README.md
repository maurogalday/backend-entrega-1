# Entrega N°1 - Backend con Mocking

## Descripción
Proyecto backend con funcionalidad de mocking para generar usuarios y mascotas ficticios.

## Instalación

```bash
npm install
```

## Configuración

### Base de datos con Docker Compose

Levanta MongoDB usando Docker Compose:

```bash
docker-compose up -d
```

Para detener MongoDB:

```bash
docker-compose down
```

Para detener y eliminar los datos:

```bash
docker-compose down -v
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

### Mocks
- **GET** `/api/mocks/mockingusers` - Genera 50 usuarios ficticios
- **GET** `/api/mocks/mockingpets` - Genera 100 mascotas ficticias
- **POST** `/api/mocks/generateData` - Genera e inserta usuarios y mascotas en la BD
  ```json
  {
    "users": 10,
    "pets": 20
  }
  ```

### Users
- **GET** `/api/users` - Obtiene todos los usuarios

### Pets
- **GET** `/api/pets` - Obtiene todas las mascotas

