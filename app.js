/**
 * SERVEUR EXPRESS - Gestion des étudiants
 * 
 * Ce fichier initialise le serveur Express qui fournit une API REST
 * pour gérer les étudiants et sert l'interface web HTML
 */

// Dépendances
const express = require('express');         // Framework web
const bodyParser = require('body-parser');  // Parser pour les données POST/PUT
const path = require('path');               // Utilitaire pour les chemins de fichiers
const StudentManager = require('./students'); // Logique métier

// Initialiser l'application Express
const app = express();
const PORT = process.env.PORT || 3000;  // Port du serveur (par défaut 3000)

/**
 * MIDDLEWARE - Étapes intermédiaires du traitement des requêtes
 */
// Convertir les body JSON en objets JavaScript
app.use(bodyParser.json());
// Convertir les données de formulaires URL-encodées
app.use(bodyParser.urlencoded({ extended: true }));
// Servir les fichiers statiques (HTML, CSS, JS) depuis le dossier 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Créer une instance du gestionnaire d'étudiants
const studentManager = new StudentManager();

/**
 * ==================== ROUTES DE L'API =====================
 * Format REST: HTTP Verbs (GET, POST, PUT, DELETE)
 * Endpoints: /api/students
 */

/**
 * GET / - Retourner la page d'accueil (index.html)
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * GET /api/students - Récupérer TOUS les étudiants
 * Réponse: Array [{ id, name, email, phone, specialty, createdAt }, ...]
 */
app.get('/api/students', (req, res) => {
  try {
    const students = studentManager.getAllStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/students/:id - Récupérer UN étudiant par son ID
 * Réponse: { id, name, email, phone, specialty, createdAt }
 */
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

/**
 * POST /api/students - CRÉER un nouvel étudiant
 * Body: { name, email, phone?, specialty? }
 * Réponse: { id, name, email, phone, specialty, createdAt }
 */
app.post('/api/students', (req, res) => {
  try {
    const { name, email, phone, specialty } = req.body;
    const student = studentManager.addStudent(name, email, phone, specialty);
    res.status(201).json(student);  // 201 = Créé avec succès
  } catch (error) {
    res.status(400).json({ error: error.message });  // 400 = Mauvaise requête
  }
});

/**
 * PUT /api/students/:id - REMPLACER complètement un étudiant
 * Body: { name, email, phone, specialty }
 * Réponse: L'étudiant mis à jour
 */
app.put('/api/students/:id', (req, res) => {
  try {
    const student = studentManager.updateStudent(req.params.id, req.body);
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * PATCH /api/students/:id - MODIFIER partiellement un étudiant
 * Body: { name?, email?, phone?, specialty? } (tous optionnels)
 * Réponse: L'étudiant modifié
 */
app.patch('/api/students/:id', (req, res) => {
  try {
    const student = studentManager.modifyStudent(req.params.id, req.body);
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * DELETE /api/students/:id - SUPPRIMER un étudiant
 * Réponse: { message, student } avec les infos de l'étudiant supprimé
 */
app.delete('/api/students/:id', (req, res) => {
  try {
    const student = studentManager.deleteStudent(req.params.id);
    res.json({ message: 'Étudiant supprimé avec succès', student });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/students/search/:name - RECHERCHER des étudiants par nom
 * Réponse: Array des étudiants correspondants
 */
app.get('/api/students/search/:name', (req, res) => {
  try {
    const students = studentManager.searchByName(req.params.name);
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GESTION DES ERREURS 404
 * Route "attrape-tout" pour les chemins non trouvés
 */
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

/**
 * DÉMARRAGE DU SERVEUR
 * Écoute les requêtes sur le PORT spécifié
 */
const server = app.listen(PORT, () => {
  console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});

// Exporter l'app et le gestionnaire pour les tests
module.exports = { app, studentManager };
