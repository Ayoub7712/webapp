// Variables globales
const studentForm = document.getElementById('studentForm');
const studentList = document.getElementById('studentList');
const loading = document.getElementById('loading');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const closeBtn = document.querySelector('.close');

// Événements
studentForm.addEventListener('submit', handleAddStudent);
editForm.addEventListener('submit', handleUpdateStudent);
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
    if (event.target === editModal) {
        closeModal();
    }
});

// Charger les étudiants au démarrage
document.addEventListener('DOMContentLoaded', loadStudents);

// =============== FONCTION POUR CHARGER LES ÉTUDIANTS ===============
async function loadStudents() {
    try {
        loading.style.display = 'block';
        studentList.innerHTML = '';

        const response = await fetch('/api/students');
        const students = await response.json();

        loading.style.display = 'none';

        if (students.length === 0) {
            studentList.innerHTML = `
                <div class="empty-state">
                    <p>📭 Aucun étudiant enregistré</p>
                    <p>Complétez le formulaire ci-dessus pour ajouter un nouveau étudiant</p>
                </div>
            `;
            return;
        }

        students.forEach(student => {
            studentList.appendChild(createStudentCard(student));
        });
    } catch (error) {
        console.error('Erreur lors du chargement des étudiants:', error);
        loading.innerHTML = '<p style="color: red;">❌ Erreur de chargement</p>';
    }
}

// =============== CRÉER UNE CARTE D'ÉTUDIANT ===============
function createStudentCard(student) {
    const card = document.createElement('div');
    card.className = 'student-card';
    card.innerHTML = `
        <div class="student-info">
            <h3>👤 ${student.nom}</h3>
            <p><strong>Email:</strong> <a href="mailto:${student.email}" class="email">${student.email}</a></p>
            <p><strong>Classe:</strong> ${student.classe}</p>
            ${student.age ? `<p><strong>Âge:</strong> ${student.age} ans</p>` : ''}
        </div>
        <div class="student-actions">
            <button class="btn btn-sm btn-info" onclick="openEditModal(${student.id})">✏️ Modifier</button>
            <button class="btn btn-sm btn-danger" onclick="deleteStudent(${student.id})">🗑️ Supprimer</button>
        </div>
    `;
    return card;
}

// =============== AJOUTER UN NOUVEL ÉTUDIANT ===============
async function handleAddStudent(e) {
    e.preventDefault();

    const formData = {
        nom: document.getElementById('nom').value,
        email: document.getElementById('email').value,
        classe: document.getElementById('classe').value,
        age: document.getElementById('age').value ? parseInt(document.getElementById('age').value) : null
    };

    try {
        const response = await fetch('/api/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('✅ Étudiant ajouté avec succès!');
            studentForm.reset();
            loadStudents();
        } else {
            const error = await response.json();
            alert('❌ Erreur: ' + error.error);
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout:', error);
        alert('❌ Erreur lors de l\'ajout de l\'étudiant');
    }
}

// =============== OUVRIR LE MODAL D'ÉDITION ===============
async function openEditModal(id) {
    try {
        const response = await fetch(`/api/students/${id}`);
        const student = await response.json();

        document.getElementById('editId').value = student.id;
        document.getElementById('editNom').value = student.nom;
        document.getElementById('editEmail').value = student.email;
        document.getElementById('editClasse').value = student.classe;
        document.getElementById('editAge').value = student.age || '';

        editModal.style.display = 'block';
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'étudiant:', error);
        alert('❌ Erreur lors de la récupération de l\'étudiant');
    }
}

// =============== FERMER LE MODAL ===============
function closeModal() {
    editModal.style.display = 'none';
}

// =============== METTRE À JOUR UN ÉTUDIANT ===============
async function handleUpdateStudent(e) {
    e.preventDefault();

    const id = document.getElementById('editId').value;
    const formData = {
        nom: document.getElementById('editNom').value,
        email: document.getElementById('editEmail').value,
        classe: document.getElementById('editClasse').value,
        age: document.getElementById('editAge').value ? parseInt(document.getElementById('editAge').value) : null
    };

    try {
        const response = await fetch(`/api/students/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('✅ Étudiant mis à jour avec succès!');
            closeModal();
            loadStudents();
        } else {
            const error = await response.json();
            alert('❌ Erreur: ' + error.error);
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        alert('❌ Erreur lors de la mise à jour de l\'étudiant');
    }
}

// =============== SUPPRIMER UN ÉTUDIANT ===============
async function deleteStudent(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet étudiant?')) {
        return;
    }

    try {
        const response = await fetch(`/api/students/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('✅ Étudiant supprimé avec succès!');
            loadStudents();
        } else {
            const error = await response.json();
            alert('❌ Erreur: ' + error.error);
        }
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('❌ Erreur lors de la suppression de l\'étudiant');
    }
}
