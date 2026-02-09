# Étape 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers package
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Étape 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Installer dumb-init pour gérer les signaux correctement
RUN apk add --no-cache dumb-init

# Copier les node_modules de l'étape builder
COPY --from=builder /app/node_modules ./node_modules

# Copier le code application
COPY app.js .
COPY students.js .
COPY package*.json ./
COPY public ./public

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

# Exposer le port
EXPOSE 3000

# Utiliser dumb-init pour démarrer l'application
ENTRYPOINT ["dumb-init", "--"]

# Commande de démarrage
CMD ["node", "app.js"]

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"
