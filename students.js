/**
 * StudentManager - Classe pour gérer les opérations sur les étudiants
 * Cette classe contient toute la logique métier de l'application
 */
class StudentManager {
  /**
   * Constructeur - Initialise un gestionnaire d'étudiants vide
   * students: tableau qui stocke les étudiants en mémoire
   * nextId: compteur pour générer des IDs uniques
   */
  constructor() {
    this.students = [];
    this.nextId = 1;
  }

  /**
   * addStudent - Ajoute un nouvel étudiant à la liste
   * @param {string} name - Nom de l'étudiant (obligatoire)
   * @param {string} email - Email de l'étudiant (obligatoire)
   * @param {string} phone - Téléphone de l'étudiant (optionnel)
   * @param {string} specialty - Spécialité de l'étudiant (optionnel)
   * @returns {object} L'étudiant créé avec son ID unique
   * @throws {Error} Si le nom ou l'email est manquant
   */
  addStudent(name, email, phone, specialty) {
    // Vérifier que les champs obligatoires sont remplis
    if (!name || !email) {
      throw new Error('Le nom et l\'email sont obligatoires');
    }

    // Créer un nouvel objet étudiant
    const student = {
      id: this.nextId++,           // ID unique auto-incrémenté
      name,
      email,
      phone: phone || '',           // Par défaut: chaîne vide si vide
      specialty: specialty || '',   // Par défaut: chaîne vide si vide
      createdAt: new Date()         // Date d'inscription
    };

    // Ajouter l'étudiant au tableau
    this.students.push(student);
    return student;
  }

  /**
   * getAllStudents - Récupère une copie de tous les étudiants
   * @returns {array} Copie du tableau d'étudiants (évite les modifications externes)
   */
  getAllStudents() {
    return this.students.map(s => ({ ...s }));
  }

  /**
   * getStudentById - Récupère un étudiant spécifique par son ID
   * @param {number|string} id - L'ID de l'étudiant à rechercher
   * @returns {object|null} L'étudiant trouvé ou null s'il n'existe pas
   */
  getStudentById(id) {
    const student = this.students.find(s => s.id === parseInt(id));
    return student ? { ...student } : null;
  }

  /**
   * deleteStudent - Supprime un étudiant de la liste
   * @param {number|string} id - L'ID de l'étudiant à supprimer
   * @returns {object} L'étudiant supprimé
   * @throws {Error} Si l'étudiant n'existe pas
   */
  deleteStudent(id) {
    const index = this.students.findIndex(s => s.id === parseInt(id));
    if (index === -1) {
      throw new Error('Étudiant non trouvé');
    }
    const deleted = this.students.splice(index, 1);
    return deleted[0];
  }

  /**
   * updateStudent - Met à jour les données d'un étudiant
   * @param {number|string} id - L'ID de l'étudiant à mettre à jour
   * @param {object} updatedData - Les nouvelles données (partielles ou complètes)
   * @returns {object} L'étudiant mis à jour
   * @throws {Error} Si l'étudiant n'existe pas
   */
  updateStudent(id, updatedData) {
    const student = this.students.find(s => s.id === parseInt(id));
    if (!student) {
      throw new Error('Étudiant non trouvé');
    }

    // Fusionner les nouvelles données avec l'existant
    Object.assign(student, updatedData);
    return { ...student };
  }

  /**
   * modifyStudent - Modifie un étudiant (similaire à update mais PATCH)
   * @param {number|string} id - L'ID de l'étudiant
   * @param {object} modifiedData - Les champs à modifier
   * @returns {object} L'étudiant modifié
   * @throws {Error} Si l'étudiant n'existe pas
   */
  modifyStudent(id, modifiedData) {
    const student = this.students.find(s => s.id === parseInt(id));
    if (!student) {
      throw new Error('Étudiant non trouvé');
    }

    // Mettre à jour correctement tous les champs
    if (modifiedData.email) student.email = modifiedData.email;
    if (modifiedData.specialty) student.specialty = modifiedData.specialty;
    if (modifiedData.name) student.name = modifiedData.name;
    if (modifiedData.phone) student.phone = modifiedData.phone;

    return { ...student };
  }

  /**
   * getStudentCount - Retourne le nombre total d'étudiants
   * @returns {number} Le nombre d'étudiants
   */
  getStudentCount() {
    return this.students.length;
  }

  /**
   * searchByName - Recherche les étudiants par nom (insensible à la casse)
   * @param {string} name - Le nom ou partie du nom à chercher
   * @returns {array} Liste des étudiants correspondants
   */
  searchByName(name) {
    return this.students.filter(s =>
      s.name.toLowerCase().includes(name.toLowerCase())
    );
  }
}

// Exporter la classe pour utilisation dans d'autres fichiers
module.exports = StudentManager;
