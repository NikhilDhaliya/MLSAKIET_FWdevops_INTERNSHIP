// Error handling
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}

// Loading state
function showLoading(element) {
    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'loading-spinner';
    element.appendChild(loadingSpinner);
    return loadingSpinner;
}

// Confirmation dialog
function confirmAction(message) {
    return new Promise((resolve) => {
        const confirmed = window.confirm(message);
        resolve(confirmed);
    });
}

// Date formatting
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Appointment validation
function validateAppointment(data) {
    const errors = [];
    if (!data.service) errors.push('Please select a service');
    if (!data.provider) errors.push('Please select a provider');
    if (!data.date) errors.push('Please select a date');
    if (!data.time) errors.push('Please select a time slot');
    return errors;
}
