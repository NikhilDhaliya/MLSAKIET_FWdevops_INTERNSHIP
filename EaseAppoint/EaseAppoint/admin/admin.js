// Add this at the beginning of your admin.js
if (!isAdmin()) {
    alert('Unauthorized access. Redirecting to login page.');
    window.location.href = '../Loginpage.html';
}

document.addEventListener('DOMContentLoaded', function() {
    // Check admin authentication
    if (!isAdmin()) {
        window.location.href = '../Loginpage.html';
        return;
    }

    // Initialize tabs
    initializeTabs();
    // Load initial data
    loadDashboardData();
    loadServices();
    loadProviders();
    loadAppointments();
    loadUsers();
});

// Admin Authentication
function isAdmin() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdminUser = localStorage.getItem('isAdmin') === 'true';
    return user.isAdmin === true && isAdminUser;
}

// Tab Navigation
function initializeTabs() {
    const tabLinks = document.querySelectorAll('.nav-links li');
    tabLinks.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
}

function switchTab(tabId) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.nav-links li').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

// Dashboard Data
function loadDashboardData() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const providers = JSON.parse(localStorage.getItem('providers') || '[]');

    // Update stats
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalProviders').textContent = providers.length;
    document.getElementById('totalAppointments').textContent = appointments.length;
    document.getElementById('todayAppointments').textContent = getTodayAppointments(appointments);

    // Load recent activity
    loadRecentActivity();
}

function getTodayAppointments(appointments) {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(app => app.date === today).length;
}

// Services Management
function loadServices() {
    const servicesList = document.getElementById('servicesList');
    const services = JSON.parse(localStorage.getItem('services') || '[]');

    servicesList.innerHTML = services.map(service => `
        <div class="service-item">
            <h3>${service.name}</h3>
            <p>${service.description}</p>
            <div class="service-actions">
                <button onclick="editService('${service.id}')">Edit</button>
                <button onclick="deleteService('${service.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function showAddServiceModal() {
    document.getElementById('addServiceModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Providers Management
function loadProviders() {
    const providersList = document.getElementById('providersList');
    const providers = JSON.parse(localStorage.getItem('providers') || '[]');

    providersList.innerHTML = providers.map(provider => `
        <div class="provider-item">
            <h3>${provider.name}</h3>
            <p>Service: ${provider.service}</p>
            <p>Location: ${provider.location}</p>
            <div class="provider-actions">
                <button onclick="editProvider('${provider.id}')">Edit</button>
                <button onclick="deleteProvider('${provider.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Appointments Management
function loadAppointments() {
    const appointmentsList = document.getElementById('appointmentsList');
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');

    appointmentsList.innerHTML = appointments.map(appointment => `
        <div class="appointment-item">
            <h3>Appointment #${appointment.id}</h3>
            <p>Service: ${appointment.service}</p>
            <p>Provider: ${appointment.provider}</p>
            <p>Date: ${appointment.date}</p>
            <p>Time: ${appointment.time}</p>
            <p>Status: ${appointment.status}</p>
            <div class="appointment-actions">
                <button onclick="updateAppointmentStatus('${appointment.id}')">Update Status</button>
                <button onclick="deleteAppointment('${appointment.id}')">Cancel</button>
            </div>
        </div>
    `).join('');
}

// Users Management
function loadUsers() {
    const usersList = document.getElementById('usersList');
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    usersList.innerHTML = users.map(user => `
        <div class="user-item">
            <h3>${user.name}</h3>
            <p>Email: ${user.email}</p>
            <p>Total Appointments: ${getUserAppointments(user.email).length}</p>
            <div class="user-actions">
                <button onclick="viewUserDetails('${user.email}')">View Details</button>
                ${user.isBlocked ? 
                    `<button onclick="unblockUser('${user.email}')">Unblock</button>` :
                    `<button onclick="blockUser('${user.email}')">Block</button>`
                }
            </div>
        </div>
    `).join('');
}

// Settings Management
document.getElementById('settingsForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const settings = {
        siteName: document.getElementById('siteName').value,
        contactEmail: document.getElementById('contactEmail').value,
        appointmentDuration: document.getElementById('appointmentDuration').value
    };
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
});

// Utility Functions
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}

function handleLogout() {
    localStorage.removeItem('isAdmin');
    window.location.href = '../index.html';
}

// Recent Activity
function loadRecentActivity() {
    const activityList = document.getElementById('activityList');
    const activities = JSON.parse(localStorage.getItem('adminActivity') || '[]');

    activityList.innerHTML = activities.slice(0, 5).map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas ${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-details">
                <p>${activity.description}</p>
                <small>${new Date(activity.timestamp).toLocaleString()}</small>
            </div>
        </div>
    `).join('');
}

function getActivityIcon(type) {
    const icons = {
        'appointment': 'fa-calendar',
        'user': 'fa-user',
        'service': 'fa-cog',
        'provider': 'fa-user-md'
    };
    return icons[type] || 'fa-info-circle';
}
