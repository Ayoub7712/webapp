// Variables globales
const studentForm = document.getElementById('studentForm');
const studentList = document.getElementById('studentList');
const loading = document.getElementById('loading');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const totalStudentsEl = document.getElementById('totalStudents');

// Événements
studentForm.addEventListener('submit', handleAddStudent);
editForm.addEventListener('submit', handleUpdateStudent);
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
        loading.style.display = 'flex';
        studentList.innerHTML = '';

        const response = await fetch('/api/students');
        const students = await response.json();

        loading.style.display = 'none';

        if (students.length === 0) {
            studentList.innerHTML = `
                <div class="empty-state">
                    <p>📭</p>
                    <p>No students registered yet</p>
                    <p>Fill the form above to add a new student</p>
                </div>
            `;
            totalStudentsEl.textContent = '0 students';
            return;
        }

        totalStudentsEl.textContent = `${students.length} student${students.length !== 1 ? 's' : ''}`;
        
        students.forEach((student, index) => {
            setTimeout(() => {
                studentList.appendChild(createStudentCard(student));
            }, index * 50);
        });
    } catch (error) {
        console.error('Error loading students:', error);
        loading.innerHTML = '<p style="color: red;">❌ Error loading students</p>';
    }
}

// =============== CRÉER UNE CARTE D'ÉTUDIANT ===============
function createStudentCard(student) {
    const card = document.createElement('div');
    card.className = 'student-card';
    
    const initials = student.nom.split(' ').map(n => n[0]).join('').toUpperCase();
    
    card.innerHTML = `
        <div class="student-avatar">${initials}</div>
        <div class="student-info">
            <div class="student-name">${student.nom}</div>
            <div class="student-detail">
                <i class="fas fa-envelope"></i>
                <a href="mailto:${student.email}" style="color: inherit; text-decoration: none;">${student.email}</a>
            </div>
            <div class="student-detail">
                <i class="fas fa-book"></i>
                ${student.classe}
            </div>
            ${student.age ? `
            <div class="student-detail">
                <i class="fas fa-birthday-cake"></i>
                ${student.age} years old
            </div>
            ` : ''}
            <span class="student-badge">ID: ${student.id}</span>
        </div>
        <div class="student-actions">
            <button class="btn btn-edit btn-sm" onclick="openEditModal(${student.id})">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-delete btn-sm" onclick="deleteStudent(${student.id})">
                <i class="fas fa-trash"></i> Delete
            </button>
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
            // Show success notification
            showNotification('Student added successfully!', 'success');
            studentForm.reset();
            loadStudents();
        } else {
            const error = await response.json();
            showNotification('Error: ' + error.error, 'error');
        }
    } catch (error) {
        console.error('Error adding student:', error);
        showNotification('Error adding student', 'error');
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

        editModal.style.display = 'flex';
    } catch (error) {
        console.error('Error loading student:', error);
        showNotification('Error loading student', 'error');
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
            showNotification('Student updated successfully!', 'success');
            closeModal();
            loadStudents();
        } else {
            const error = await response.json();
            showNotification('Error: ' + error.error, 'error');
        }
    } catch (error) {
        console.error('Error updating student:', error);
        showNotification('Error updating student', 'error');
    }
}

// =============== SUPPRIMER UN ÉTUDIANT ===============
async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) {
        return;
    }

    try {
        const response = await fetch(`/api/students/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showNotification('Student deleted successfully!', 'success');
            loadStudents();
        } else {
            const error = await response.json();
            showNotification('Error: ' + error.error, 'error');
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        showNotification('Error deleting student', 'error');
    }
}

// =============== NOTIFICATION HELPER ===============
function showNotification(message, type) {
    // Create notification element
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease-out;
        z-index: 2000;
        font-weight: 600;
    `;
    notif.textContent = message;
    document.body.appendChild(notif);

    setTimeout(() => {
        notif.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
