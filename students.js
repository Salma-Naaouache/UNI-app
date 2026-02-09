// Logique métier pour la gestion des étudiants
class StudentManager {
  constructor() {
    this.students = [];
    this.nextId = 1;
  }

  // Ajouter un nouvel étudiant
  addStudent(name, email, phone, specialty) {
    if (!name || !email) {
      throw new Error('Le nom et l\'email sont obligatoires');
    }

    const student = {
      id: this.nextId++,
      name,
      email,
      phone: phone || '',
      specialty: specialty || '',
      createdAt: new Date()
    };

    this.students.push(student);
    return student;
  }

  // Obtenir la liste de tous les étudiants
  getAllStudents() {
    return this.students.map(s => ({ ...s }));
  }

  // Obtenir un étudiant par ID
  getStudentById(id) {
    const student = this.students.find(s => s.id === parseInt(id));
    return student ? { ...student } : null;
  }

  // Supprimer un étudiant par ID
  deleteStudent(id) {
    const index = this.students.findIndex(s => s.id === parseInt(id));
    if (index === -1) {
      throw new Error('Étudiant non trouvé');
    }
    const deleted = this.students.splice(index, 1);
    return deleted[0];
  }

  // Mettre à jour un étudiant
  updateStudent(id, updatedData) {
    const student = this.students.find(s => s.id === parseInt(id));
    if (!student) {
      throw new Error('Étudiant non trouvé');
    }

    Object.assign(student, updatedData);
    return { ...student };
  }

  // BUG: Modifier un étudiant (avec un bug intentionnel)
  // Ce bug: la fonction swaps email et specialty au lieu de les mettre à jour correctement
  modifyStudent(id, modifiedData) {
    const student = this.students.find(s => s.id === parseInt(id));
    if (!student) {
      throw new Error('Étudiant non trouvé');
    }

    // BUG INTENTIONNEL: Inverser l'email et la spécialité
    if (modifiedData.email) {
      student.specialty = modifiedData.email;  // ERREUR: mettre l'email dans specialty
    }
    if (modifiedData.specialty) {
      student.email = modifiedData.specialty;  // ERREUR: mettre la specialty dans email
    }
    
    // Les autres champs sont bien mis à jour
    if (modifiedData.name) student.name = modifiedData.name;
    if (modifiedData.phone) student.phone = modifiedData.phone;

    return { ...student };
  }

  // Obtenir le nombre d'étudiants
  getStudentCount() {
    return this.students.length;
  }

  // Rechercher les étudiants par nom
  searchByName(name) {
    return this.students.filter(s =>
      s.name.toLowerCase().includes(name.toLowerCase())
    );
  }
}

module.exports = StudentManager;
