let currentStep = 1;
const totalSteps = 4;

// Sample data - In a real app, this would come from a backend
const states = ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi'];
const cities = {
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
    'Delhi': ['New Delhi', 'North Delhi', 'South Delhi']
};

const providers = {
    'salon': {
        'Mumbai': [
            { name: 'Style Studio', address: '123 Main St', rating: 4.5 },
            { name: 'Glamour Salon', address: '456 Park Ave', rating: 4.2 }
        ],
        'Bangalore': [
            { name: 'Trends Salon', address: '789 MG Road', rating: 4.7 },
            { name: 'Cut & Style', address: '321 Brigade Rd', rating: 4.3 }
        ]
    },
    'clinic': {
        'Mumbai': [
            { name: 'City Clinic', address: '789 Health St', rating: 4.8 },
            { name: 'Care Clinic', address: '012 Med Ave', rating: 4.6 }
        ]
    },
    'hospital': {
        'Mumbai': [
            { name: 'City Hospital', address: '123 Hospital Rd', rating: 4.9 },
            { name: 'General Hospital', address: '456 Health Ave', rating: 4.7 }
        ]
    }
};

// Initialize the form
document.addEventListener('DOMContentLoaded', function() {
    initializeStateSelect();
    updateProgress();
    setupFormSubmission();
});

function initializeStateSelect() {
    const stateSelect = document.getElementById('state');
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    });
}

function handleServiceChange() {
    const serviceType = document.getElementById('serviceType').value;
    if (serviceType) {
        nextStep();
    }
}

function loadCities() {
    const state = document.getElementById('state').value;
    const citySelect = document.getElementById('city');
    
    citySelect.innerHTML = '<option value="">Select City</option>';
    citySelect.disabled = true;

    if (state && cities[state]) {
        cities[state].forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
        citySelect.disabled = false;
    }
}

function loadProviders() {
    const serviceType = document.getElementById('serviceType').value;
    const city = document.getElementById('city').value;
    const providerSelect = document.getElementById('provider');
    
    providerSelect.innerHTML = '<option value="">Select Provider</option>';
    providerSelect.disabled = true;

    if (providers[serviceType] && providers[serviceType][city]) {
        providers[serviceType][city].forEach(provider => {
            const option = document.createElement('option');
            option.value = provider.name;
            option.textContent = provider.name;
            providerSelect.appendChild(option);
        });
        providerSelect.disabled = false;
    }
}

function showProviderDetails(providerName) {
    const serviceType = document.getElementById('serviceType').value;
    const city = document.getElementById('city').value;
    const provider = providers[serviceType][city].find(p => p.name === providerName);
    
    if (provider) {
        document.getElementById('providerDetails').style.display = 'block';
        document.getElementById('providerAddress').textContent = `Address: ${provider.address}`;
        document.getElementById('providerRating').textContent = `Rating: ${provider.rating}/5`;
    }
}

function loadTimeSlots() {
    const date = document.getElementById('appointmentDate').value;
    const serviceType = document.getElementById('serviceType').value;
    const city = document.getElementById('city').value;
    const provider = document.getElementById('provider').value;
    const slotsContainer = document.getElementById('slotsContainer');
    
    if (!date || !serviceType || !city || !provider) return;
    
    slotsContainer.innerHTML = '';
    
    const availableSlots = getAvailableSlots(serviceType, city, provider, date);
    
    if (availableSlots.length === 0) {
        slotsContainer.innerHTML = '<p>No slots available for this date</p>';
        return;
    }
    
    availableSlots.forEach(time => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'slot-button';
        button.textContent = time;
        button.onclick = () => selectSlot(button);
        slotsContainer.appendChild(button);
    });
}

function selectSlot(button) {
    document.querySelectorAll('.slot-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    button.classList.add('selected');
}

function updateProgress() {
    const progress = document.getElementById('progress');
    const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progress.style.width = `${percentage}%`;

    // Update step indicators
    for (let i = 1; i <= totalSteps; i++) {
        const step = document.getElementById(`step${i}`);
        if (i === currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    }
}

function showStep(step) {
    // Hide all steps
    document.getElementById('serviceStep').style.display = 'none';
    document.getElementById('locationStep').style.display = 'none';
    document.getElementById('providerStep').style.display = 'none';
    document.getElementById('timeStep').style.display = 'none';

    // Show current step
    switch(step) {
        case 1:
            document.getElementById('serviceStep').style.display = 'block';
            break;
        case 2:
            document.getElementById('locationStep').style.display = 'block';
            break;
        case 3:
            document.getElementById('providerStep').style.display = 'block';
            break;
        case 4:
            document.getElementById('timeStep').style.display = 'block';
            break;
    }

    // Update navigation buttons
    document.getElementById('prevBtn').style.display = step === 1 ? 'none' : 'block';
    document.getElementById('nextBtn').style.display = step === totalSteps ? 'none' : 'block';
    document.getElementById('submitBtn').style.display = step === totalSteps ? 'block' : 'none';
}

function nextStep() {
    if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
        updateProgress();
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateProgress();
    }
}

function setupFormSubmission() {
    document.getElementById('appointmentForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const appointment = {
            service: document.getElementById('serviceType').value,
            state: document.getElementById('state').value,
            city: document.getElementById('city').value,
            provider: document.getElementById('provider').value,
            date: document.getElementById('appointmentDate').value,
            time: document.querySelector('.slot-button.selected')?.textContent,
            userId: JSON.parse(localStorage.getItem('user'))?.email
        };

        try {
            // Book the time slot
            const booked = await bookSlot(
                appointment.service,
                appointment.city,
                appointment.provider,
                appointment.date,
                appointment.time,
                appointment.userId
            );

            if (booked) {
                // Save appointment
                const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
                appointments.push(appointment);
                localStorage.setItem('appointments', JSON.stringify(appointments));

                alert('Appointment booked successfully!');
                window.location.href = 'dashboard.html';
            }
        } catch (error) {
            alert(error.message || 'Failed to book appointment');
        }
    });
}
