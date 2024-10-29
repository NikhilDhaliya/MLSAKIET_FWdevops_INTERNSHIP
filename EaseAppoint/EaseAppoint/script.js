document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    const hasSubmenuItems = document.querySelectorAll('.has-submenu');

    // Toggle mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Add active class to current nav item
    const currentLocation = window.location.href;
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        if (link.href === currentLocation) {
            link.classList.add('active');
        }
    });

    // Handle submenu on mobile
    hasSubmenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.classList.toggle('active');
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu after clicking
                nav.classList.remove('active');
                mobileMenuBtn?.classList.remove('active');
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav?.contains(e.target) && !mobileMenuBtn?.contains(e.target)) {
            nav?.classList.remove('active');
            mobileMenuBtn?.classList.remove('active');
        }
    });

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // Handle navigation based on login state
    function handleNavigation(e, targetPage) {
        e.preventDefault();
        if (!isLoggedIn) {
            window.location.href = 'Loginpage.html';
        } else {
            window.location.href = targetPage;
        }
    }

    // Add event listeners to buttons and links
    const signupButton = document.querySelector('.signup');
    const bookButton = document.querySelector('.book-button');

    if (signupButton) {
        signupButton.addEventListener('click', function(e) {
            handleNavigation(e, 'dashboard.html');
        });
    }

    if (bookButton) {
        bookButton.addEventListener('click', function(e) {
            handleNavigation(e, 'Appointment.html');
        });
    }

    // Protect appointment page
    if (window.location.pathname.includes('Appointment.html')) {
        if (!isLoggedIn) {
            window.location.href = 'Loginpage.html';
        }
    }

    // Only show booking confirmation if coming directly from appointment booking
    if (window.location.pathname.includes('dashboard.html')) {
        const showBookingConfirmation = localStorage.getItem('showBookingConfirmation');
        const lastConfirmationTime = localStorage.getItem('lastConfirmationTime');
        const currentTime = new Date().getTime();

        if (showBookingConfirmation === 'true' && 
            (!lastConfirmationTime || currentTime - parseInt(lastConfirmationTime) < 2000)) {
            alert('Appointment booked successfully!');
            localStorage.removeItem('showBookingConfirmation');
            localStorage.setItem('lastConfirmationTime', currentTime.toString());
        }
    }

    // Scroll animation for cards
    function revealOnScroll() {
        const cards = document.querySelectorAll('.service-card, .testimonial-card');
        
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const triggerBottom = window.innerHeight * 0.8;
            
            if(cardTop < triggerBottom) {
                card.classList.add('visible');
            }
        });
    }

    // Initial check for visible elements
    revealOnScroll();

    // Add scroll event listener
    window.addEventListener('scroll', revealOnScroll);
});
