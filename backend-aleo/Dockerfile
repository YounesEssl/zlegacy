FROM node:18-alpine

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances (incluant les dépendances de développement pour Prisma)
RUN npm ci

# Copie du reste du code source
COPY . .

# Génération du client Prisma
RUN npx prisma generate

# Nettoyage des dépendances de développement après génération de Prisma
RUN npm prune --production

# Exposition du port sur lequel l'app s'exécute
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"]
