const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connexion à la base de données SQLite
const dbPath = path.join(__dirname, '../database/students.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
    } else {
        console.log('✅ Connecté à la base de données SQLite');
    }
});

// Initialiser la base de données
const initializeDatabase = () => {
    db.run(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            classe TEXT NOT NULL,
            age INTEGER,
            dateCreation DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Erreur lors de la création de la table:', err);
        } else {
            console.log('✅ Table students créée ou déjà existante');
        }
    });
};

// Récupérer tous les étudiants
const getAllStudents = (callback) => {
    db.all('SELECT * FROM students ORDER BY dateCreation DESC', [], callback);
};

// Récupérer un étudiant par ID
const getStudentById = (id, callback) => {
    db.get('SELECT * FROM students WHERE id = ?', [id], callback);
};

// Ajouter un nouveau étudiant
const addStudent = (studentData, callback) => {
    const { nom, email, classe, age } = studentData;
    db.run(
        'INSERT INTO students (nom, email, classe, age) VALUES (?, ?, ?, ?)',
        [nom, email, classe, age],
        function(err) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, this.lastID);
            }
        }
    );
};

// Mettre à jour un étudiant
const updateStudent = (id, studentData, callback) => {
    const { nom, email, classe, age } = studentData;
    db.run(
        'UPDATE students SET nom = ?, email = ?, classe = ?, age = ? WHERE id = ?',
        [nom, email, classe, age, id],
        callback
    );
};

// Supprimer un étudiant
const deleteStudent = (id, callback) => {
    db.run('DELETE FROM students WHERE id = ?', [id], callback);
};

module.exports = {
    initializeDatabase,
    getAllStudents,
    getStudentById,
    addStudent,
    updateStudent,
    deleteStudent
};
