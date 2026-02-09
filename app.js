const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const StudentManager = require('./students');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialiser le gestionnaire d'étudiants
const studentManager = new StudentManager();

// Routes

// GET - Page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET - Obtenir tous les étudiants
app.get('/api/students', (req, res) => {
  try {
    const students = studentManager.getAllStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Obtenir un étudiant par ID
app.get('/api/students/:id', (req, res) => {
  try {
    const student = studentManager.getStudentById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Étudiant non trouvé' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Ajouter un nouvel étudiant
app.post('/api/students', (req, res) => {
  try {
    const { name, email, phone, specialty } = req.body;
    const student = studentManager.addStudent(name, email, phone, specialty);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT - Mettre à jour un étudiant
app.put('/api/students/:id', (req, res) => {
  try {
    const student = studentManager.updateStudent(req.params.id, req.body);
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH - Modifier un étudiant (avec bug intentionnel)
app.patch('/api/students/:id', (req, res) => {
  try {
    const student = studentManager.modifyStudent(req.params.id, req.body);
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Supprimer un étudiant
app.delete('/api/students/:id', (req, res) => {
  try {
    const student = studentManager.deleteStudent(req.params.id);
    res.json({ message: 'Étudiant supprimé avec succès', student });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET - Rechercher les étudiants par nom
app.get('/api/students/search/:name', (req, res) => {
  try {
    const students = studentManager.searchByName(req.params.name);
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrer le serveur
const server = app.listen(PORT, () => {
  console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});

module.exports = { app, studentManager };
