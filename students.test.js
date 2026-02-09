const StudentManager = require('./students');

describe('StudentManager', () => {
  let manager;

  beforeEach(() => {
    manager = new StudentManager();
  });

  // Tests pour addStudent
  describe('addStudent', () => {
    test('devrait ajouter un étudiant avec tous les paramètres', () => {
      const student = manager.addStudent('Jean Dupont', 'jean@example.com', '0612345678', 'Informatique');

      expect(student).toEqual({
        id: 1,
        name: 'Jean Dupont',
        email: 'jean@example.com',
        phone: '0612345678',
        specialty: 'Informatique',
        createdAt: expect.any(Date)
      });
    });

    test('devrait ajouter un étudiant sans téléphone et spécialité', () => {
      const student = manager.addStudent('Marie Martin', 'marie@example.com');

      expect(student).toEqual({
        id: 1,
        name: 'Marie Martin',
        email: 'marie@example.com',
        phone: '',
        specialty: '',
        createdAt: expect.any(Date)
      });
    });

    test('devrait générer des IDs uniques', () => {
      const student1 = manager.addStudent('Jean', 'jean@example.com');
      const student2 = manager.addStudent('Marie', 'marie@example.com');

      expect(student1.id).toBe(1);
      expect(student2.id).toBe(2);
    });

    test('devrait lever une erreur si le nom est manquant', () => {
      expect(() => manager.addStudent('', 'jean@example.com')).toThrow('Le nom et l\'email sont obligatoires');
    });

    test('devrait lever une erreur si l\'email est manquant', () => {
      expect(() => manager.addStudent('Jean', '')).toThrow('Le nom et l\'email sont obligatoires');
    });
  });

  // Tests pour getAllStudents
  describe('getAllStudents', () => {
    test('devrait retourner un tableau vide au départ', () => {
      const students = manager.getAllStudents();
      expect(students).toEqual([]);
    });

    test('devrait retourner tous les étudiants', () => {
      manager.addStudent('Jean', 'jean@example.com');
      manager.addStudent('Marie', 'marie@example.com');

      const students = manager.getAllStudents();
      expect(students.length).toBe(2);
    });

    test('devrait retourner une copie des données', () => {
      manager.addStudent('Jean', 'jean@example.com');
      const students = manager.getAllStudents();
      students[0].name = 'Modified';

      const refreshedStudents = manager.getAllStudents();
      expect(refreshedStudents[0].name).toBe('Jean');
    });
  });

  // Tests pour getStudentById
  describe('getStudentById', () => {
    test('devrait retourner un étudiant par ID', () => {
      manager.addStudent('Jean', 'jean@example.com');
      const student = manager.getStudentById(1);

      expect(student.name).toBe('Jean');
      expect(student.email).toBe('jean@example.com');
    });

    test('devrait retourner null si l\'étudiant n\'existe pas', () => {
      const student = manager.getStudentById(999);
      expect(student).toBeNull();
    });
  });

  // Tests pour deleteStudent
  describe('deleteStudent', () => {
    test('devrait supprimer un étudiant par ID', () => {
      manager.addStudent('Jean', 'jean@example.com');
      manager.addStudent('Marie', 'marie@example.com');

      const deleted = manager.deleteStudent(1);
      expect(deleted.name).toBe('Jean');
      expect(manager.getAllStudents().length).toBe(1);
    });

    test('devrait lever une erreur si l\'étudiant n\'existe pas', () => {
      expect(() => manager.deleteStudent(999)).toThrow('Étudiant non trouvé');
    });
  });

  // Tests pour updateStudent
  describe('updateStudent', () => {
    test('devrait mettre à jour les données d\'un étudiant', () => {
      manager.addStudent('Jean', 'jean@example.com', '0612345678', 'Informatique');
      const updated = manager.updateStudent(1, { name: 'Jean Updated', specialty: 'Chimie' });

      expect(updated.name).toBe('Jean Updated');
      expect(updated.specialty).toBe('Chimie');
      expect(updated.email).toBe('jean@example.com');
    });

    test('devrait lever une erreur si l\'étudiant n\'existe pas', () => {
      expect(() => manager.updateStudent(999, { name: 'Test' })).toThrow('Étudiant non trouvé');
    });
  });

  // Tests pour getStudentCount
  describe('getStudentCount', () => {
    test('devrait retourner le nombre d\'étudiants', () => {
      expect(manager.getStudentCount()).toBe(0);

      manager.addStudent('Jean', 'jean@example.com');
      expect(manager.getStudentCount()).toBe(1);

      manager.addStudent('Marie', 'marie@example.com');
      expect(manager.getStudentCount()).toBe(2);
    });
  });

  // Tests pour searchByName
  describe('searchByName', () => {
    beforeEach(() => {
      manager.addStudent('Jean Dupont', 'jean@example.com');
      manager.addStudent('Marie Martin', 'marie@example.com');
      manager.addStudent('Jean Martin', 'jeanmartin@example.com');
    });

    test('devrait trouver les étudiants par nom', () => {
      const results = manager.searchByName('Jean');
      expect(results.length).toBe(2);
    });

    test('devrait être insensible à la casse', () => {
      const results1 = manager.searchByName('jean');
      const results2 = manager.searchByName('JEAN');
      expect(results1.length).toBe(results2.length);
    });

    test('devrait retourner un tableau vide si aucun match', () => {
      const results = manager.searchByName('Unknown');
      expect(results.length).toBe(0);
    });
  });

  // Tests pour modifyStudent (avec bug intentionnel)
  describe('modifyStudent (avec bug intentionnel)', () => {
    test('devrait modifier le nom d\'un étudiant', () => {
      manager.addStudent('Jean', 'jean@example.com', '0612345678', 'Informatique');
      const modified = manager.modifyStudent(1, { name: 'Jean Martin' });

      expect(modified.name).toBe('Jean Martin');
    });

    test('BUG: ne devrait pas swapper email et specialty', () => {
      manager.addStudent('Jean', 'jean@example.com', '0612345678', 'Informatique');
      const modified = manager.modifyStudent(1, { 
        email: 'newemail@example.com',
        specialty: 'Chimie'
      });

      // CES ASSERTIONS VONT ÉCHOUER À CAUSE DU BUG!
      expect(modified.email).toBe('newemail@example.com');  // FAIL: email sera 'Chimie'
      expect(modified.specialty).toBe('Chimie');  // FAIL: specialty sera 'newemail@example.com'
    });

    test('BUG: vérifier le bug - email et specialty sont swappés', () => {
      manager.addStudent('Marie', 'marie@example.com', '0698765432', 'Mathématiques');
      const modified = manager.modifyStudent(1, { 
        email: 'marie.new@example.com',
        specialty: 'Physique'
      });

      // Le bug: email va dans specialty et vice versa
      expect(modified.specialty).toBe('marie.new@example.com');  // Bug produit: email va dans specialty
      expect(modified.email).toBe('Physique');  // Bug produit: specialty va dans email
    });

    test('devrait modifier le téléphone correctement', () => {
      manager.addStudent('Sophie', 'sophie@example.com', '0612345678', 'Informatique');
      const modified = manager.modifyStudent(1, { phone: '0712345678' });

      expect(modified.phone).toBe('0712345678');
    });

    test('devrait lever une erreur si l\'étudiant n\'existe pas', () => {
      expect(() => manager.modifyStudent(999, { name: 'Test' })).toThrow('Étudiant non trouvé');
    });
  });
});
