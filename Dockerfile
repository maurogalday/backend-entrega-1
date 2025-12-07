# Usar imagen base de Node.js
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar el código fuente
COPY . .

# Exponer el puerto de la aplicación
EXPOSE 8080

# Variable de entorno para el puerto
ENV PORT=8080
ENV NODE_ENV=production

# Comando para iniciar la aplicación
CMD ["node", "src/app.js"]


