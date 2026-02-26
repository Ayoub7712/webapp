# 📚 Application de Gestion des Étudiants

Une application web complète et moderne pour gérer une base de données d'étudiants, construite avec **Node.js**, **Express**, **SQLite** et **HTML/CSS/JavaScript**.

## 🎯 Fonctionnalités

✅ **CRUD Complet** - Créer, Lire, Mettre à jour, Supprimer des étudiants
✅ **Backend Express** - API REST robuste
✅ **Base de données SQLite** - Stockage persistant des données
✅ **Frontend moderne** - Interface responsive et intuitive
✅ **Design attrayant** - Gradient personnalisé et animations fluides
✅ **Validation** - Validation côté client et serveur

## 📋 Structure du Projet

```
webapp/
├── backend/
│   ├── server.js          # Serveur Express principal
│   └── database.js        # Configuration SQLite
├── frontend/
│   ├── index.html         # Interface utilisateur
│   ├── style.css          # Styles CSS
│   └── script.js          # Logique JavaScript frontend
├── database/
│   └── students.db        # Base de données SQLite (créée automatiquement)
├── package.json           # Dépendances du projet
└── README.md             # Ce fichier
```

## 🚀 Installation et Démarrage

### Étape 1: Installer les dépendances

```bash
npm install
```

Cette commande installe:
- **express** - Framework web
- **sqlite3** - Gestion de la base de données
- **cors** - Activer les requêtes cross-origin

### Étape 2: Démarrer le serveur

```bash
npm start
```

ou

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

### Étape 3: Accéder à l'application

Ouvrez votre navigateur et allez sur:
```
http://localhost:3000
```

## 📊 Schéma de la Base de Données

### Table: `students`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | INTEGER | Clé primaire (auto-incrémentée) |
| `nom` | TEXT | Nom de l'étudiant (obligatoire) |
| `email` | TEXT | Email unique (obligatoire) |
| `classe` | TEXT | Classe/niveau (obligatoire) |
| `age` | INTEGER | Âge (optionnel) |
| `dateCreation` | DATETIME | Date de création automatique |

## 🔌 Points de terminaison API

### GET `/api/students`
Récupère la liste de tous les étudiants
```json
[
  { "id": 1, "nom": "John Doe", "email": "john@example.com", "classe": "1A", "age": 20 }
]
```

### GET `/api/students/:id`
Récupère un étudiant spécifique
```json
{ "id": 1, "nom": "John Doe", "email": "john@example.com", "classe": "1A", "age": 20 }
```

### POST `/api/students`
Crée un nouvel étudiant
```json
{
  "nom": "Jane Smith",
  "email": "jane@example.com",
  "classe": "2A",
  "age": 21
}
```

### PUT `/api/students/:id`
Met à jour un étudiant existant
```json
{
  "nom": "Jane Smith Updated",
  "email": "jane.updated@example.com",
  "classe": "3A",
  "age": 22
}
```

### DELETE `/api/students/:id`
Supprime un étudiant

## 🎨 Fonctionnalités Frontend

### Formulaire d'ajout
- Champs: Nom, Email, Classe, Âge
- Validation des champs requis
- Feedback utilisateur avec alertes

### Liste des étudiants
- Affichage dynamique de tous les étudiants
- Boutons Modifier et Supprimer pour chaque étudiant
- Design en cartes attrayantes avec hover effects

### Modal d'édition
- Modification des informations existantes
- Fermeture intelligente du modal
- Confirmation et feedback utilisateur

## 💾 Fichiers Importants

- **[server.js](backend/server.js)** - Routes API et configuration du serveur
- **[database.js](backend/database.js)** - Requêtes SQLite et gestion des données
- **[index.html](frontend/index.html)** - Structure HTML de l'interface
- **[style.css](frontend/style.css)** - Styles et responsive design
- **[script.js](frontend/script.js)** - Interactions frontend et appels API

## 🛠️ Dépannage

### Le serveur ne démarre pas
- Vérifiez que le port 3000 est libre
- Supprimez `node_modules` et réinstallez: `npm install`

### Erreur: Email déjà existant
- Chaque email doit être unique
- Utilisez un email différent pour chaque nouveau étudiant

### Base de données corrompue
- Supprimez le fichier `database/students.db`
- Redémarrez le serveur pour recréer la base

## 📱 Responsive Design

L'application fonctionne parfaitement sur:
- ✅ Ordinateurs de bureau
- ✅ Tablettes
- ✅ Téléphones mobiles

## 🔒 Sécurité

- Utilisation de requêtes paramétrées pour éviter les injections SQL
- Validation des données côté serveur
- CORS configuré pour les requêtes cross-origin

## 📝 Exemple d'Utilisation

1. **Ajouter un étudiant**
   - Remplissez le formulaire avec les informations de l'étudiant
   - Cliquez sur "Ajouter l'étudiant"
   - L'étudiant apparaît immédiatement dans la liste

2. **Modifier un étudiant**
   - Cliquez sur "Modifier" dans la carte de l'étudiant
   - Mettez à jour les informations dans le modal
   - Cliquez sur "Enregistrer"

3. **Supprimer un étudiant**
   - Cliquez sur "Supprimer" dans la carte de l'étudiant
   - Confirmez la suppression

## 🎓 Apprentissage

Ce projet couvre:
- ✅ Création d'une API REST avec Express
- ✅ Gestion de base de données avec SQLite
- ✅ Communication frontend-backend avec fetch API
- ✅ Design responsive avec CSS Grid et Flexbox
- ✅ Manipulation du DOM avec JavaScript
- ✅ Gestion des formulaires HTML

## 📄 Licence

Ce projet est libre d'utilisation à des fins éducatives.

## 👨‍💻 Auteur

Créé avec Copilot et Node.js

---

**Bonne gestion des étudiants! 🎉**
