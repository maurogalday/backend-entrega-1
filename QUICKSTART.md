# 🚀 Guía de Inicio Rápido

## Paso 1: Instalar dependencias
```bash
npm install
```

## Paso 2: Levantar MongoDB con Docker
```bash
docker-compose up -d
```

Verifica que MongoDB esté corriendo:
```bash
docker ps
```

## Paso 3: Iniciar el servidor
```bash
npm run dev
```

## Paso 4: Probar los endpoints

### 1. Generar 50 usuarios ficticios (sin guardar en BD)
```bash
curl http://localhost:8080/api/mocks/mockingusers
```

### 2. Generar 100 mascotas ficticias (sin guardar en BD)
```bash
curl http://localhost:8080/api/mocks/mockingpets
```

### 3. Generar e insertar datos en la BD
```bash
curl -X POST http://localhost:8080/api/mocks/generateData \
  -H "Content-Type: application/json" \
  -d '{"users": 10, "pets": 20}'
```

### 4. Verificar usuarios insertados
```bash
curl http://localhost:8080/api/users
```

### 5. Verificar mascotas insertadas
```bash
curl http://localhost:8080/api/pets
```

## Comandos útiles de Docker

### Ver logs de MongoDB
```bash
docker-compose logs -f mongodb
```

### Detener MongoDB
```bash
docker-compose down
```

### Reiniciar MongoDB (eliminar datos)
```bash
docker-compose down -v
docker-compose up -d
```

### Acceder a la consola de MongoDB
```bash
docker exec -it mockingdb mongosh
```

Dentro de mongosh:
```javascript
show dbs
use mockingdb
show collections
db.users.find().pretty()
db.pets.find().pretty()
```

## Estructura del Proyecto

```
entrega1/
├── src/
│   ├── app.js              # Servidor Express principal
│   ├── config/
│   │   └── database.js     # Configuración de MongoDB
│   ├── models/
│   │   ├── User.model.js   # Modelo de Usuario
│   │   └── Pet.model.js    # Modelo de Mascota
│   ├── routes/
│   │   ├── mocks.router.js # Router de mocking (PRINCIPAL)
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

