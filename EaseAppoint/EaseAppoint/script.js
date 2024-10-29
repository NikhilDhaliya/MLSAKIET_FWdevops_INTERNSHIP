document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    const hasSubmenuItems = document.querySelectorAll('.has-submenu');


    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    const currentLocation = window.location.href;
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        if (link.href === currentLocation) {
            link.classList.add('active');
        }
    });


    hasSubmenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.classList.toggle('active');
            }
        });
    });

   
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                
                nav.classList.remove('active');
                mobileMenuBtn?.classList.remove('active');
            }
        });
    });


    document.addEventListener('click', function(e) {
        if (!nav?.contains(e.target) && !mobileMenuBtn?.contains(e.target)) {
            nav?.classList.remove('active');
            mobileMenuBtn?.classList.remove('active');
        }
    });


    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    function handleNavigation(e, targetPage) {
        e.preventDefault();
        if (!isLoggedIn) {
            window.location.href = 'Loginpage.html';
        } else {
            window.location.href = targetPage;
        }
    }


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

    if (window.location.pathname.includes('Appointment.html')) {
        if (!isLoggedIn) {
            window.location.href = 'Loginpage.html';
        }
    }

   
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

    revealOnScroll();

    window.addEventListener('scroll', revealOnScroll);
});
