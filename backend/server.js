const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// Initialize database
db.initializeDatabase();

// =============== ROUTES API ===============

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

// =============== ROUTES FRONTEND ===============

// Route pour servir le fichier HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
