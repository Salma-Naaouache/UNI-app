################################################################################
# Dockerfile simple Node.js (avec Jest)
################################################################################

FROM node:18-alpine

# Répertoire de travail
WORKDIR /app

# Installer dumb-init (bonne pratique)
RUN apk add --no-cache dumb-init

# Copier package.json + package-lock.json
COPY package*.json ./

# Installer toutes les dépendances (prod + dev)
RUN npm install

# Copier tout le projet
COPY . .

# Lancer les tests


# Créer un utilisateur non-root (sécurité)

# Exposer le port
EXPOSE 3000

# Lancer l'application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "app.js"]
