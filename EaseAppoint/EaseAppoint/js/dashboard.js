// Initialize EmailJS
(function() {
    emailjs.init("V9G2uJwD3DM0lMRVQ");
})();

// Email notification function for booking confirmation
async function sendBookingConfirmation(appointment) {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    const templateParams = {
        to_name: user.name,
        to_email: user.email,
        service: appointment.service,
        provider: appointment.provider,
        date: formatDate(appointment.date),
        time: appointment.time
    };

    try {
        const response = await emailjs.send(
            'service_xoc0o6b',    // Your service ID
            'template_ynf6vyf',   // Your template ID for booking confirmation
            templateParams
        );
        console.log('Booking confirmation email sent:', response);
        return true;
    } catch (error) {
        console.error('Failed to send booking confirmation:', error);
        return false;
    }
}

// Utility function to format date
function formatDate(dateString) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Update cancelAppointment function (without email)
async function cancelAppointment(index) {
    const confirmed = await confirmAction('Are you sure you want to cancel this appointment?');
    if (confirmed) {
        try {
            const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            appointments.splice(index, 1);
            localStorage.setItem('appointments', JSON.stringify(appointments));
            
            loadAppointments();
            showNotification('Appointment cancelled successfully');
        } catch (error) {
            console.error('Error:', error);
            showNotification('Failed to cancel appointment', 'error');
        }
    }
}

// Utility functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}

function confirmAction(message) {
    return new Promise((resolve) => {
        const result = window.confirm(message);
        resolve(result);
    });
}

function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Load appointments and initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initializeDashboard();
    setupNavigationHandlers();
    loadUserProfile();
    loadAppointments();
    loadHistory();
    loadSettings();
});

function initializeDashboard() {
    // Check authentication
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'Loginpage.html';
        return;
    }

    // Load user info
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    document.getElementById('userName').textContent = user.name || 'User';

    // Show dashboard section by default
    showSection('dashboard');
}

function setupNavigationHandlers() {
    // Add click handlers to navigation links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get section name from text content
            let sectionName = this.textContent.toLowerCase().trim();
            if (sectionName === 'book appointment') {
                window.location.href = 'Appointment.html';
                return;
            }
            
            // Remove active class from all links
            document.querySelectorAll('.nav-links a').forEach(l => {
                l.classList.remove('active');
            });
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            showSection(sectionName);
        });
    });

    // Add event listener for profile form submission
    document.getElementById('profileForm')?.addEventListener('submit', handleProfileUpdate);

    // Add event listeners for settings changes
    document.querySelectorAll('.settings-section input[type="checkbox"]')?.forEach(checkbox => {
        checkbox.addEventListener('change', saveSettings);
    });
}

function showSection(sectionName) {
    // Hide all sections first
    const sections = [
        '.welcome-section',
        '.stats-container',
        '.appointments-section',
        '.history-section',
        '.profile-section',
        '.settings-section'
    ];
    
    sections.forEach(section => {
        const element = document.querySelector(section);
        if (element) {
            element.style.display = 'none';
        }
    });

    // Show selected section
    switch(sectionName) {
        case 'dashboard':
            document.querySelector('.welcome-section').style.display = 'flex';
            document.querySelector('.stats-container').style.display = 'grid';
            document.querySelector('.appointments-section').style.display = 'block';
            loadAppointments();
            break;
        case 'history':
            document.querySelector('.history-section').style.display = 'block';
            loadHistory();
            break;
        case 'profile':
            document.querySelector('.profile-section').style.display = 'block';
            loadUserProfile();
            break;
        case 'settings':
            document.querySelector('.settings-section').style.display = 'block';
            loadSettings();
            break;
    }
}

function loadUserProfile() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Update profile display
    document.getElementById('profileName').textContent = user.name || 'User';
    document.getElementById('profileEmail').textContent = user.email || '';
    
    // Update form fields
    document.getElementById('fullName').value = user.name || '';
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('location').value = user.location || '';
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    
    try {
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const updatedUser = {
            ...user,
            name: document.getElementById('fullName').value,
            phone: document.getElementById('phone').value,
            location: document.getElementById('location').value,
            emailNotifications: document.getElementById('emailNotifications').checked
        };

        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // Update display
        document.getElementById('userName').textContent = updatedUser.name;
        document.getElementById('profileName').textContent = updatedUser.name;
        
        showNotification('Profile updated successfully');
    } catch (error) {
        showNotification('Failed to update profile', 'error');
    }
}

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    
    // Update settings toggles
    document.getElementById('emailNotifications').checked = settings.emailNotifications !== false;
    document.getElementById('reminderAlerts').checked = settings.reminderAlerts !== false;
    document.getElementById('profileVisibility').checked = settings.profileVisibility === true;
}

function saveSettings() {
    try {
        const settings = {
            emailNotifications: document.getElementById('emailNotifications').checked,
            reminderAlerts: document.getElementById('reminderAlerts').checked,
            profileVisibility: document.getElementById('profileVisibility').checked
        };

        localStorage.setItem('userSettings', JSON.stringify(settings));
        showNotification('Settings saved successfully');
    } catch (error) {
        showNotification('Failed to save settings', 'error');
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}

// Make functions available globally
window.handleLogout = handleLogout;
window.cancelAppointment = cancelAppointment;
window.rateAppointment = rateAppointment;

// Update loadAppointments function to send email for new bookings
function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const tableBody = document.getElementById('appointmentsTableBody');
    const upcomingCount = document.getElementById('upcomingCount');
    const completedCount = document.getElementById('completedCount');
    const totalCount = document.getElementById('totalCount');

    let upcoming = 0;
    let completed = 0;

    // Check for new appointments and send confirmation emails
    const newAppointments = appointments.filter(app => !app.emailSent);
    newAppointments.forEach(async (appointment) => {
        await sendBookingConfirmation(appointment);
        appointment.emailSent = true;
    });
    
    // Save the updated appointments with emailSent flag
    if (newAppointments.length > 0) {
        localStorage.setItem('appointments', JSON.stringify(appointments));
    }

    // Clear existing rows
    tableBody.innerHTML = '';

    appointments.forEach((appointment, index) => {
        const row = document.createElement('tr');
        const appointmentDate = new Date(appointment.date);
        const today = new Date();
        const status = appointmentDate < today ? 'completed' : 'upcoming';

        if (status === 'upcoming') upcoming++;
        else completed++;

        row.innerHTML = `
            <td>${appointment.service}</td>
            <td>${appointment.provider}</td>
            <td>${appointment.date}</td>
            <td>${appointment.time}</td>
            <td><span class="status-badge status-${status}">
                ${status.charAt(0).toUpperCase() + status.slice(1)}
            </span></td>
            <td>
                ${status === 'upcoming' ? `
                    <button class="cancel-btn" onclick="cancelAppointment(${index})">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                ` : `
                    <button class="rate-btn" onclick="rateAppointment(${index})">
                        <i class="fas fa-star"></i> Rate
                    </button>
                `}
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Update stats
    upcomingCount.textContent = upcoming;
    completedCount.textContent = completed;
    totalCount.textContent = appointments.length;
}
