const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const app = express();
const fs = require('fs');
const path = require('path');

const port = 55555; // Change this port if necessary

// Basic authentication credentials
var clientId = 'test12345';
var clientSecret = 'test12345';
var encodedData = Buffer.from(clientId + ':' + clientSecret).toString('base64');
var authorizationHeaderString = 'Authorization: Basic ' + encodedData;

// Multer setup for file uploads (CSV)
const upload = multer({ dest: 'uploads/' });

// Authentication middleware
function authentication(req, res, next) {
    var authheader = req.headers.authorization;
    console.log(req.headers);
    
    if (!authheader) {
        res.setHeader('WWW-Authenticate', 'Basic');
        return res.status(401).json({
            "message": "missing credentials"
        });
    }

    var auth = new Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];

    if (user === clientId && pass === clientSecret) {
        next(); // Authentication success
    } else {
        res.setHeader('WWW-Authenticate', 'Basic');
        return res.status(401).json({
            "status": "error", "message": "wrong credentials"
        });
    }
}

// Use middleware
app.use(authentication); // Enforce authentication
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// POST route to receive CSV files from PLC
app.post('/api/resource', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    
    // Rename the file to keep original extension (for easier access)
    const newFileName = path.join(__dirname, 'uploads', req.file.originalname);
    fs.rename(req.file.path, newFileName, err => {
        if (err) {
            return res.status(500).send('Error saving file.');
        }

        console.log(`File uploaded: ${newFileName}`);
        res.send(`File ${req.file.originalname} received and saved successfully.`);
    });
});

// GET route to fetch specific resources (optional)
app.get('/api/resource/:id', (req, res) => {
    const id = req.params.id;
    const resource = resources.find(r => r.id === id);
    
    if (!resource) {
        return res.status(404).send('Resource not found');
    }

    res.send(resource);
});

// Start the server
app.listen(port, () => console.log(`Server listening on port ${port}!`));
    