// ========== AUTH CHECK ==========
(function checkAuth() {
    const token = sessionStorage.getItem('auth_token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }
    // Verify token with server
    fetch('/api/verify', {
        headers: { 'Authorization': 'Bearer ' + token }
    }).then(res => {
        if (!res.ok) {
            sessionStorage.clear();
            window.location.href = '/login.html';
        } else {
            return res.json();
        }
    }).then(data => {
        if (data && data.username) {
            const navUser = document.getElementById('navUsername');
            if (navUser) navUser.textContent = data.username;
        }
    }).catch(() => {
        sessionStorage.clear();
        window.location.href = '/login.html';
    });
})();

function logout() {
    const token = sessionStorage.getItem('auth_token');
    fetch('/api/logout', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token }
    }).finally(() => {
        sessionStorage.clear();
        window.location.href = '/login.html';
    });
}

// ========== PARTICLE BACKGROUND ==========
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = ['99, 102, 241', '0, 212, 255', '180, 77, 255', '255, 45, 124'][Math.floor(Math.random() * 4)];
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        // Mouse repulsion
        if (mouse.x && mouse.y) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                this.x += dx / dist * 1.5;
                this.y += dy / dist * 1.5;
            }
        }
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
    }
}

for (let i = 0; i < 100; i++) particles.push(new Particle());

function drawLines() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 130) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(99, 102, 241, ${0.12 * (1 - dist / 130)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ========== INTERSECTION OBSERVER FOR ANIMATIONS ==========
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'riseUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.glass-section').forEach(section => {
    section.style.opacity = '0';
    observer.observe(section);
});

// ========== DOM ELEMENTS ==========
const studentForm = document.getElementById('studentForm');
const studentList = document.getElementById('studentList');
const loading = document.getElementById('loading');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const totalStudentsEl = document.getElementById('totalStudents');

// Events
studentForm.addEventListener('submit', handleAddStudent);
editForm.addEventListener('submit', handleUpdateStudent);
window.addEventListener('click', (event) => {
    if (event.target === editModal) closeModal();
});

// Load students on startup
document.addEventListener('DOMContentLoaded', loadStudents);

// ========== LOAD STUDENTS ==========
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
                    <div class="empty-icon">📭</div>
                    <h3>No students registered yet</h3>
                    <p>Fill the form above to add your first student</p>
                </div>
            `;
            totalStudentsEl.textContent = '0';
            return;
        }

        totalStudentsEl.textContent = students.length;

        students.forEach((student, index) => {
            setTimeout(() => {
                const card = createStudentCard(student);
                card.style.animationDelay = `${index * 0.08}s`;
                studentList.appendChild(card);
            }, index * 60);
        });
    } catch (error) {
        console.error('Error loading students:', error);
        loading.innerHTML = '<p style="color: #ff5252;">Error loading students</p>';
    }
}

// ========== CREATE STUDENT CARD ==========
function createStudentCard(student) {
    const card = document.createElement('div');
    card.className = 'student-card';

    const initials = student.nom.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    card.innerHTML = `
        <div class="card-avatar">${initials}</div>
        <div class="card-name">${student.nom}</div>
        <div class="card-detail">
            <i class="fas fa-envelope"></i>
            <span>${student.email}</span>
        </div>
        <div class="card-detail">
            <i class="fas fa-book"></i>
            <span>${student.classe}</span>
        </div>
        ${student.age ? `
        <div class="card-detail">
            <i class="fas fa-calendar"></i>
            <span>${student.age} years old</span>
        </div>` : ''}
        <div class="card-badge"><i class="fas fa-id-badge"></i> ID: ${student.id}</div>
        <div class="card-actions">
            <button class="card-btn card-btn-edit" onclick="openEditModal(${student.id})">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="card-btn card-btn-delete" onclick="deleteStudent(${student.id})">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;
    return card;
}

// ========== ADD STUDENT ==========
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            showToast('Student registered successfully!', 'success');
            studentForm.reset();
            loadStudents();
        } else {
            const error = await response.json();
            showToast('Error: ' + error.error, 'error');
        }
    } catch (error) {
        showToast('Error adding student', 'error');
    }
}

// ========== OPEN EDIT MODAL ==========
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
        showToast('Error loading student', 'error');
    }
}

// ========== CLOSE MODAL ==========
function closeModal() {
    editModal.style.display = 'none';
}

// ========== UPDATE STUDENT ==========
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            showToast('Student updated successfully!', 'success');
            closeModal();
            loadStudents();
        } else {
            const error = await response.json();
            showToast('Error: ' + error.error, 'error');
        }
    } catch (error) {
        showToast('Error updating student', 'error');
    }
}

// ========== DELETE STUDENT ==========
async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
        const response = await fetch(`/api/students/${id}`, { method: 'DELETE' });

        if (response.ok) {
            showToast('Student deleted successfully!', 'success');
            loadStudents();
        } else {
            const error = await response.json();
            showToast('Error: ' + error.error, 'error');
        }
    } catch (error) {
        showToast('Error deleting student', 'error');
    }
}

// ========== TOAST NOTIFICATIONS ==========
function showToast(message, type) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastOut 0.4s ease forwards';
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}
