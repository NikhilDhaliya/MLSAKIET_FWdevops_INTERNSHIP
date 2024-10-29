// Add this at the top of your login.js file
const ADMIN_CREDENTIALS = {
    email: 'admin@easeappoint.com',
    password: 'admin123'
};

document.addEventListener('DOMContentLoaded', function() {
    // First check if we're on the login page
    if (document.getElementById("authForm")) {
        const signupBtn = document.getElementById("signupBtn");
        const signinBtn = document.getElementById("signinBtn");
        const nameField = document.getElementById("nameField");
        const title = document.getElementById("title");
        const authForm = document.getElementById("authForm");
        
        // Form elements
        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        
        // Error messages
        const nameError = document.getElementById("nameError");
        const emailError = document.getElementById("emailError");
        const passwordError = document.getElementById("passwordError");
        const successMessage = document.getElementById("successMessage");

        // Toggle between signup and signin
        signinBtn.onclick = function() {
            if (signinBtn.classList.contains("disable")) {
                nameField.style.maxHeight = "0";
                title.innerHTML = "Sign In";
                signupBtn.classList.add("disable");
                signinBtn.classList.remove("disable");
                clearErrors();
            } else {
                handleSubmit('signin'); // Add this to handle sign in
            }
        }

        signupBtn.onclick = function() {
            if (signupBtn.classList.contains("disable")) {
                nameField.style.maxHeight = "60px";
                title.innerHTML = "Sign Up";
                signupBtn.classList.remove("disable");
                signinBtn.classList.add("disable");
                clearErrors();
            } else {
                handleSubmit('signup');
            }
        }

        // Form validation
        function validateForm(isSignup) {
            let isValid = true;
            clearErrors();

            // Email validation
            if (!emailInput.value.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
                emailError.textContent = "Please enter a valid email address";
                emailError.style.display = "block";
                isValid = false;
            }

            // Password validation
            if (passwordInput.value.length < 8) {
                passwordError.textContent = "Password must be at least 8 characters long";
                passwordError.style.display = "block";
                isValid = false;
            }

            // Name validation (only for signup)
            if (isSignup && nameInput.value.length < 2) {
                nameError.textContent = "Name must be at least 2 characters long";
                nameError.style.display = "block";
                isValid = false;
            }

            return isValid;
        }

        function clearErrors() {
            nameError.style.display = "none";
            emailError.style.display = "none";
            passwordError.style.display = "none";
            successMessage.style.display = "none";
        }

        function showLoading(button) {
            const span = button.querySelector('span');
            const loading = button.querySelector('.loading');
            span.style.display = 'none';
            loading.style.display = 'block';
            button.disabled = true;
        }

        function hideLoading(button) {
            const span = button.querySelector('span');
            const loading = button.querySelector('.loading');
            span.style.display = 'inline';
            loading.style.display = 'none';
            button.disabled = false;
        }

        async function handleSubmit(type) {
            const button = type === 'signup' ? signupBtn : signinBtn;
            
            if (!validateForm(type === 'signup')) {
                return;
            }

            showLoading(button);

            try {
                const email = emailInput.value;
                const password = passwordInput.value;

                // Check for admin login
                if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
                    // Store admin info
                    localStorage.setItem('user', JSON.stringify({
                        name: 'Admin',
                        email: ADMIN_CREDENTIALS.email,
                        isAdmin: true
                    }));
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('isAdmin', 'true');

                    successMessage.textContent = 'Admin login successful!';
                    successMessage.style.display = "block";

                    // Redirect to admin panel
                    setTimeout(() => {
                        window.location.href = 'admin/admin.html';
                    }, 1000);
                    return;
                }

                if (type === 'signup') {
                    // Check if email already exists
                    const emailExists = await checkEmailExists(email);
                    if (emailExists) {
                        showError('emailError', 'An account with this email already exists. Please sign in.');
                        emailInput.focus();
                        hideLoading(button);
                        return;
                    }

                    // Create new user
                    const newUser = {
                        name: nameInput.value,
                        email: email,
                        password: password,
                        createdAt: new Date().toISOString()
                    };

                    const users = JSON.parse(localStorage.getItem('users') || '[]');
                    users.push(newUser);
                    localStorage.setItem('users', JSON.stringify(users));
                    localStorage.setItem('currentUser', JSON.stringify(newUser));
                    localStorage.setItem('isLoggedIn', 'true');

                    showSuccess('Account created successfully!');
                    setTimeout(() => window.location.href = 'dashboard.html', 1000);
                } else {
                    // Handle Sign In
                    const users = JSON.parse(localStorage.getItem('users') || '[]');
                    const user = users.find(u => u.email === email);

                    if (!user) {
                        showError('emailError', 'Email not found. Please sign up first.');
                        emailInput.focus();
                        hideLoading(button);
                        return;
                    }

                    if (user.password !== password) {
                        showError('passwordError', 'Incorrect password');
                        passwordInput.value = '';
                        passwordInput.focus();
                        hideLoading(button);
                        return;
                    }

                    localStorage.setItem('currentUser', JSON.stringify(user));
                    localStorage.setItem('isLoggedIn', 'true');

                    showSuccess('Signed in successfully!');
                    setTimeout(() => window.location.href = 'dashboard.html', 1000);
                }
            } catch (error) {
                console.error('Error:', error);
                showError('Login failed. Please try again.');
            } finally {
                hideLoading(button);
            }
        }

        // Helper functions
        async function userExists(email) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            return users.some(user => user.email === email);
        }

        async function checkEmailExists(email) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            return users.some(user => user.email === email);
        }

        function handleAdminLogin() {
            const adminUser = {
                name: 'Admin',
                email: ADMIN_CREDENTIALS.email,
                isAdmin: true
            };
            localStorage.setItem('currentUser', JSON.stringify(adminUser));
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('isAdmin', 'true');

            showSuccess('Admin login successful!');
            setTimeout(() => window.location.href = 'admin/admin.html', 1000);
        }

        function showSuccess(message) {
            successMessage.textContent = message;
            successMessage.style.display = "block";
        }

        function showError(elementId, message) {
            const errorElement = document.getElementById(elementId);
            errorElement.textContent = message;
            errorElement.style.display = "block";
            setTimeout(() => {
                errorElement.style.display = "none";
            }, 3000);
        }

        // Handle form submission
        authForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const isSignup = !signupBtn.classList.contains("disable");
            const isSignin = !signinBtn.classList.contains("disable");
            
            if (isSignup) {
                handleSubmit('signup');
            } else if (isSignin) {
                handleSubmit('signin');
            }
        });

        // Check if user is already logged in
        if (localStorage.getItem('isLoggedIn') === 'true') {
            if (localStorage.getItem('isAdmin') === 'true') {
                window.location.href = 'admin/admin.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        }
    }
});

// Google Sign-In handler (keep outside DOMContentLoaded)
function handleGoogleSignIn(response) {
    try {
        const userInfo = jwt_decode(response.credential);
        
        localStorage.setItem('user', JSON.stringify({
            name: userInfo.name,
            email: userInfo.email,
            picture: userInfo.picture
        }));
        localStorage.setItem('isLoggedIn', 'true');
        
        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.textContent = 'Successfully signed in with Google!';
            successMessage.style.display = 'block';
        }

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);

    } catch (error) {
        console.error('Error during Google Sign-In:', error);
        alert('Failed to sign in with Google. Please try again.');
    }
}

function jwt_decode(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// Add to your existing login.js
document.getElementById('forgotPassword').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'forgotPassword.html';
});
