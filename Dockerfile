# 1. Utiliser une image Node.js de base (version LTS recommandée)
FROM node:20

# 2. Définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /usr/src/app

# 3. Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# 4. Installer les dépendances du projet
RUN npm install

# 5. Copier tout le reste des fichiers du projet dans le conteneur
COPY . .

# 6. Exposer le port sur lequel l'application écoute
EXPOSE 55555

# 7. Définir la commande pour démarrer l'application
CMD ["npm", "start"]
