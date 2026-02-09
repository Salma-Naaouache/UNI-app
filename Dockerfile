################################################################################
# Dockerfile - Containerisation de l'application Node.js
# 
# Ce fichier utilise une approche multi-étape pour optimiser la taille finale
# de l'image Docker et améliorer la sécurité
################################################################################

# ================= ÉTAPE 1: BUILDER (Construction) =================
# Cette étape installe les dépendances et les teste
FROM node:18-alpine AS builder

# Définir le répertoire de travail dans le container
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
# package.json: Définition des dépendances
# package-lock.json: Versions exactes des dépendances (pour reproductibilité)
COPY package*.json ./

# Installer UNIQUEMENT les dépendances de production
# --only=production: N'installe pas les dépendances de développement (comme jest)
RUN npm ci --only=production

# ================= ÉTAPE 2: RUNTIME (Application) =================
# Cette étape contient uniquement ce qui est nécessaire pour exécuter l'app
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Installer dumb-init
# C'est un petit programme qui gère correctement les signaux Unix (SIGTERM, SIGKILL)
# Important pour arrêter proprement l'application dans Docker
RUN apk add --no-cache dumb-init

# Copier les node_modules pré-installés de l'étape builder
# Cela évite de réinstaller les dépendances dans cette étape
COPY --from=builder /app/node_modules ./node_modules

# Copier les fichiers de l'application
COPY app.js .              # Serveur Express principal
COPY students.js .         # Logique métier
COPY package*.json ./      # Fichiers de configuration npm
COPY public ./public       # Fichiers statiques (HTML, CSS)

# ================= SÉCURITÉ: Utilisateur non-root =================
# Créer un groupe et un utilisateur pour exécuter l'app
# C'est une bonne pratique de sécurité (sinon l'app s'exécute en root)
#RUN addgroup -g 1001 -S nodejs && \
 #   adduser -S nodejs -u 1001

# Passer au nouvel utilisateur non-privilégié
USER nodejs

# ================= RÉSEAU =================
# Exposer le port 3000 (en lecture seule, c'est juste documentation)
EXPOSE 3000

# ================= DÉMARRAGE DE L'APPLICATION =================
# Utiliser dumb-init comme point d'entrée pour gérer les signaux
ENTRYPOINT ["dumb-init", "--"]

# Commande pour lancer l'application
CMD ["node", "app.js"]

# ================= HEALTHCHECK =================
# Vérifier que l'application répond correctement à intervalles réguliers
# --interval=30s: Vérifier toutes les 30 secondes
# --timeout=10s: Attendre max 10 secondes une réponse
# --start-period=40s: Laisser 40 secondes au démarrage avant les vérifications
# --retries=3: Marquer comme unhealthy après 3 vérifications échouées
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

################################################################################
# RÉSUMÉ:
# 1. Builder: Installe les dépendances (170 MB approximativement)
# 2. Runtime: Copie uniquement ce qui est nécessaire (100 MB approximativement)
# 3. Résultat: Image finale plus petite et plus sécurisée
# 
# UTILISATION:
# docker build -t uni-app:latest .
# docker run -p 3000:3000 uni-app:latest
################################################################################
