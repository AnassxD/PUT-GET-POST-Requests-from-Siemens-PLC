// Importer les modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const http = require('http'); // pour créer le serveur HTTP
const socketIo = require('socket.io'); // pour Socket.IO

const app = express();
const port = 55555; // Port pour ton serveur
const server = http.createServer(app); // Créer un serveur HTTP
const io = socketIo(server); // Ajouter Socket.IO

// Configurer le moteur de template EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Dossier contenant les fichiers EJS

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Stocker les ressources (ou données)
let resources = [];

// Route pour servir la page HTML qui va utiliser Socket.IO
app.get('/', (req, res) => {
    res.render('index', { resources }); // Envoyer les données collectées au fichier EJS
});

// Route API pour recevoir les données de la PLC
app.post('/api/resource', (req, res) => {
    const resource = req.body;
    resources.push(resource);
    
    // Envoyer les nouvelles données à tous les clients connectés en temps réel
    io.emit('newData', resource);
    
    res.send(resource);
    console.log(resource);
});

// Route pour obtenir une ressource spécifique
app.get('/api/resource/:id', (req, res) => {
    const id = req.params.id;
    const resource = resources.find(r => r.id === id);
    if (!resource) res.status(404).send('Resource not found');
    else res.send(resource);
});

// Initialisation du serveur Socket.IO
io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté');

    // Quand l'utilisateur se déconnecte
    socket.on('disconnect', () => {
        console.log('Un utilisateur est déconnecté');
    });
});

// Démarrer le serveur
server.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
});
