const express = require('express');
const contactController = require('./src/controllers/ContactController');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/contacts', (req, res) => contactController.getContacts(req, res));

// ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`  MVC App running at: http://localhost:${PORT}`);
    console.log(`========================================\n`);
});
