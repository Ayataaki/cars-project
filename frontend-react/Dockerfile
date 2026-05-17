FROM node:18-alpine

WORKDIR /app

# Copier package.json en premier (cache Docker optimisé)
COPY package*.json ./

RUN npm install

# Copier le reste du code source
COPY . .

# ✅ Variable d'environnement pour forcer le port 3030
ENV PORT=3030

# ✅ Nécessaire sur Mac pour que le file-watcher fonctionne dans Docker
ENV CHOKIDAR_USEPOLLING=true

EXPOSE 3030

CMD ["npm", "start"]