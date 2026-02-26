const express = require('express');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// =============== CREDENTIALS ===============
const USERS = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'teacher', password: 'teacher123', role: 'teacher' }
];

const JWT_SECRET = process.env.JWT_SECRET || 'studenthub-secret-key-2026';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve login page at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// Serve login.html explicitly
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// Static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Initialize database
db.initializeDatabase();

// =============== AUTH ROUTES ===============

// POST - Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = USERS.find(u => u.username === username && u.password === password);
    if (user) {
        const token = jwt.sign(
            { username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.json({ success: true, token, role: user.role });
    } else {
        res.status(401).json({ success: false, error: 'Invalid username or password' });
    }
});

// POST - Logout
app.post('/api/logout', (req, res) => {
    // JWT is stateless; client just discards the token
    res.json({ success: true });
});

// GET - Verify token
app.get('/api/verify', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ success: true, username: decoded.username, role: decoded.role });
    } catch (err) {
        res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
});

// =============== STUDENT ROUTES API ===============

// GET - Récupérer tous les étudiants
app.get('/api/students', (req, res) => {
    db.getAllStudents((err, students) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération des étudiants' });
        }
        res.json(students);
    });
});

// GET - Récupérer un étudiant par ID
app.get('/api/students/:id', (req, res) => {
    db.getStudentById(req.params.id, (err, student) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération de l\'étudiant' });
        }
        if (!student) {
            return res.status(404).json({ error: 'Étudiant non trouvé' });
        }
        res.json(student);
    });
});

// POST - Créer un nouvel étudiant
app.post('/api/students', (req, res) => {
    const { nom, email, classe, age } = req.body;
    
    if (!nom || !email || !classe) {
        return res.status(400).json({ error: 'Veuillez fournir tous les champs requis' });
    }
    
    db.addStudent({ nom, email, classe, age }, (err, id) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'étudiant' });
        }
        res.status(201).json({ id, nom, email, classe, age });
    });
});

// PUT - Mettre à jour un étudiant
app.put('/api/students/:id', (req, res) => {
    const { nom, email, classe, age } = req.body;
    
    db.updateStudent(req.params.id, { nom, email, classe, age }, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'étudiant' });
        }
        res.json({ message: 'Étudiant mis à jour avec succès' });
    });
});

// DELETE - Supprimer un étudiant
app.delete('/api/students/:id', (req, res) => {
    db.deleteStudent(req.params.id, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la suppression de l\'étudiant' });
        }
        res.json({ message: 'Étudiant supprimé avec succès' });
    });
});

// Export for Vercel serverless
module.exports = app;

// Start server (local dev only)
app.listen(PORT, () => {
    console.log(`✅ Server started on http://localhost:${PORT}`);
});
