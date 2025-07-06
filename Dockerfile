# Usa una imagen oficial
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia solo package.json y package-lock.json primero
COPY package*.json ./

# Instala dependencias DENTRO del contenedor
RUN npm install

# Ahora copia el resto
COPY . .

# Expone el puerto
EXPOSE 4001

# Comando para iniciar
CMD ["npm", "start"]
