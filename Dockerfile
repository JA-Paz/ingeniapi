# Imagen base de Node (versión estable)
FROM node:18

# Carpeta de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos los archivos de dependencias primero (para aprovechar la caché de Docker)
COPY package*.json ./

# Instalamos solo dependencias de producción
RUN npm install --production

# Copiamos el resto del código al contenedor
COPY . .

# Exponemos el puerto en el que corre tu API
EXPOSE 3000

# Comando para iniciar la app
CMD ["node", "index.js"]
