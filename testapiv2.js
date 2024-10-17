//***********************************************************************/
//************************Connect DB *******************/
//***********************************************************************/


const mysql = require('mysql2');

// Configurer la connexion à la base de données
const db = mysql.createConnection({
  host: 'localhost',     // Adresse du serveur de base de données
  user: 'root',          // Nom d'utilisateur MySQL
  password: '',  // Mot de passe MySQL
  database: 'test_db'    // Nom de la base de données
});

// Connecter à la base de données
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
    return;
  }
  console.log('Connecté à la base de données MySQL');
});
















//***********************************************************************/
//************************OhmMade Test HTTP API***2022*******************/
//***********************************************************************/

const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 55555; //55555  //80
const fs = require("fs");
var path = require('path');
 
var jsonParser = bodyParser.json()
var clientId = 'test12345';
var clientSecret = 'test12345';
var encodedData = Buffer.from(clientId + ':' + clientSecret).toString('base64');
var authorizationHeaderString = 'Authorization: Basic ' + encodedData;
// authorization: 'Basic dGVzdDEyMzQ1OnRlc3QxMjM0NQ=='

function authentication(req, res, next) {
    var authheader = req.headers.authorization;
    console.log(req.headers);
 
    if (!authheader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        res.json({
            "message": "missing credentials"
           });
        return next(err)
    }
 
    var auth = new Buffer.from(authheader.split(' ')[1],
    'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];
 
    if (user == 'test12345' && pass == 'test12345') {
 
        // If Authorized user
        next();
    } else {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        res.json({
            "status": "error","message": "wrong credentials"
           });
        return next(err);
    }
 
}


// First step is the authentication of the client
app.use(authentication)
app.use(express.static(path.join(__dirname, 'public')));







console.clear();
console.log('*************************************************');
console.log('**************OhmMade Test API**************');
console.log('*************************************************');
console.log(authorizationHeaderString);
//console.log('*************************************************');
app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
let resources = [];
//***************************************************************
app.post('/api/resource', (req, res) => {
  const resource = req.body;
  
  // Requête SQL pour insérer les données
  const sql = 'INSERT INTO resources (id, name) VALUES (?, ?)';
  
  // Exécuter la requête
  db.query(sql, [resource.id, JSON.stringify(resource)], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'insertion des données:', err);
      res.status(500).send('Erreur du serveur');
      return;
    }
    
    res.send(resource);
    console.log('Données insérées:', resource);
  });
});

  
app.get('/api/resource/:id', (req, res) => {
  const id = req.params.id;
  
  const sql = 'SELECT * FROM resources WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur du serveur');
      return;
    }
    
    if (result.length === 0) {
      res.status(404).send('Resource not found');
    } else {
      res.send(result[0]);
    }
  });
});




app.listen(port, () => console.log(`listening on port ${port}!`));