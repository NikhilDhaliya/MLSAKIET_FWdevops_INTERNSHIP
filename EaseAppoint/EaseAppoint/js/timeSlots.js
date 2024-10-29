// Time slot management
const timeSlotData = {
    salon: {
        Mumbai: {
            'Style Studio': {},
            'Glamour Salon': {}
        },
        Bangalore: {
            'Trends Salon': {},
            'Cut & Style': {}
        }
    },
    clinic: {
        Mumbai: {
            'City Clinic': {},
            'Care Clinic': {}
        }
    },
    hospital: {
        Mumbai: {
            'City Hospital': {},
            'General Hospital': {}
        }
    }
};

// Generate time slots for next 7 days
function generateTimeSlots() {
    const today = new Date();
    
    for (let service in timeSlotData) {
        for (let city in timeSlotData[service]) {
            for (let provider in timeSlotData[service][city]) {
                timeSlotData[service][city][provider] = {};
                
                // Generate slots for next 7 days
                for (let i = 0; i < 7; i++) {
                    const date = new Date(today);
                    date.setDate(today.getDate() + i);
                    const dateString = date.toISOString().split('T')[0];
                    
                    // Generate slots from 9 AM to 5 PM
                    timeSlotData[service][city][provider][dateString] = {};
                    for (let hour = 9; hour <= 17; hour++) {
                        const timeString = `${hour.toString().padStart(2, '0')}:00`;
                        timeSlotData[service][city][provider][dateString][timeString] = {
                            isBooked: false,
                            bookedBy: null
                        };
                    }
                }
            }
        }
    }
    
    // Save to localStorage
    localStorage.setItem('timeSlots', JSON.stringify(timeSlotData));
}

// Get available slots for a specific provider on a specific date
function getAvailableSlots(service, city, provider, date) {
    const slots = JSON.parse(localStorage.getItem('timeSlots') || '{}');
    if (!slots[service]?.[city]?.[provider]?.[date]) return [];
    
    return Object.entries(slots[service][city][provider][date])
        .filter(([_, slot]) => !slot.isBooked)
        .map(([time]) => time);
}

// Book a slot
function bookSlot(service, city, provider, date, time, userId) {
    const slots = JSON.parse(localStorage.getItem('timeSlots') || '{}');
    
    if (!slots[service]?.[city]?.[provider]?.[date]?.[time]) {
        throw new Error('Invalid slot');
    }
    
    if (slots[service][city][provider][date][time].isBooked) {
        throw new Error('Slot already booked');
    }
    
    slots[service][city][provider][date][time] = {
        isBooked: true,
        bookedBy: userId
    };
    
    localStorage.setItem('timeSlots', JSON.stringify(slots));
    return true;
}

// Initialize time slots if not exists
if (!localStorage.getItem('timeSlots')) {
    generateTimeSlots();
}
