// Initialize EmailJS with your public key
(function() {
    emailjs.init("V9G2uJwD3DM0lMRVQ");
})();

// Add these constants at the top
const OTP_VALIDITY_MINUTES = 10;
const OTP_LENGTH = 6;

// Add these variables in global scope
let currentEmail = '';
let generatedOTP = '';
let otpExpiration = null;

document.addEventListener('DOMContentLoaded', function() {
    const emailForm = document.getElementById('emailForm');
    const otpForm = document.getElementById('otpForm');
    const newPasswordForm = document.getElementById('newPasswordForm');

    // Handle Send OTP
    document.getElementById('forgotPasswordForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        console.log('Checking users:', users); // Debug log

        // Check if user exists
        const user = users.find(u => u.email === email);
        console.log('Found user:', user); // Debug log

        if (!user) {
            showError('emailError', 'Email not found. Please check your email address or sign up first.');
            return;
        }

        try {
            currentEmail = email;
            generatedOTP = generateOTP();
            otpExpiration = new Date(Date.now() + (OTP_VALIDITY_MINUTES * 60 * 1000));
            
            console.log('Generated OTP:', generatedOTP); // Debug log

            // Send OTP via email
            await sendOTPEmail(email, generatedOTP);
            
            // Show success message
            alert('OTP has been sent to your email address');
            
            // Show OTP form
            emailForm.style.display = 'none';
            otpForm.style.display = 'block';
        } catch (error) {
            console.error('Error sending OTP:', error);
            showError('emailError', 'Failed to send OTP. Please try again.');
        }
    });

    // Handle OTP Verification
    document.getElementById('verifyOtpForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const inputs = document.querySelectorAll('#verifyOtpForm input');
        const enteredOTP = Array.from(inputs).map(input => input.value).join('');

        // Check if OTP has expired
        if (Date.now() > otpExpiration.getTime()) {
            showError('otpError', 'OTP has expired. Please request a new one.');
            return;
        }

        if (enteredOTP === generatedOTP) {
            otpForm.style.display = 'none';
            newPasswordForm.style.display = 'block';
        } else {
            showError('otpError', 'Invalid OTP. Please try again.');
            inputs.forEach(input => input.value = '');
            inputs[0].focus();
        }
    });

    // Handle Password Reset
    document.getElementById('resetPasswordForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword.length < 8) {
            showError('passwordError', 'Password must be at least 8 characters long');
            return;
        }

        if (newPassword !== confirmPassword) {
            showError('confirmPasswordError', 'Passwords do not match');
            return;
        }

        try {
            // Update password in localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.email === currentEmail);
            
            if (userIndex !== -1) {
                users[userIndex].password = newPassword;
                localStorage.setItem('users', JSON.stringify(users));
                
                alert('Password reset successful! Please login with your new password.');
                window.location.href = 'Loginpage.html';
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            showError('passwordError', 'Failed to reset password. Please try again.');
        }
    });

    // Handle OTP input auto-focus
    const otpInputs = document.querySelectorAll('.otp-inputs input');
    otpInputs.forEach((input, index) => {
        // Move to next input after entering a digit
        input.addEventListener('input', function() {
            if (this.value && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        // Handle backspace
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !this.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });

        // Only allow numbers
        input.addEventListener('keypress', function(e) {
            if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
            }
        });
    });
});

// Utility Functions
function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Make sure the error is visible
    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Keep the error visible longer
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000); // Show for 5 seconds
}

function verifyOTP(enteredOTP) {
    if (Date.now() > otpExpiration.getTime()) {
        showError('otpError', 'OTP has expired. Please request a new one.');
        return false;
    }
    return enteredOTP === generatedOTP;
}

// Update the sendOTPEmail function
async function sendOTPEmail(email, otp) {
    try {
        const templateParams = {
            to_name: email.split('@')[0],
            to_email: email,
            otp: otp
        };

        console.log('Sending email with params:', templateParams); // Debug log

        const response = await emailjs.send(
            'service_xoc0o6b',
            'template_5t01bxn',
            templateParams
        );

        console.log('Email sent successfully:', response);
        return true;
    } catch (error) {
        console.error('EmailJS Error:', error);
        throw new Error('Failed to send email: ' + error.message);
    }
}
