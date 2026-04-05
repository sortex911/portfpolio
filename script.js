document.addEventListener('DOMContentLoaded', () => {
    // Mobile height fix for VH units
    const setHeight = () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setHeight();
    window.addEventListener('resize', setHeight);

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Sticky Header Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            header.classList.toggle('nav-open');
            document.body.classList.toggle('no-scroll');
        });
    }

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            header.classList.remove('nav-open');
            document.body.classList.remove('no-scroll');
        });
    });

    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.section-reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // Parallax background glow
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const glow1 = document.querySelector('.glow-1');
        const glow2 = document.querySelector('.glow-2');
        if (glow1) glow1.style.transform = `translateY(${scrolled * 0.1}px)`;
        if (glow2) glow2.style.transform = `translateY(${scrolled * -0.05}px)`;
        
        // Show/Hide back to top
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            if (scrolled > 500) backToTop.classList.add('visible');
            else backToTop.classList.remove('visible');
        }
    });

    // Animate terminal typing
    const terminalLines = document.querySelectorAll('.terminal-body p');
    terminalLines.forEach((line, index) => {
        line.style.opacity = '0';
        setTimeout(() => {
            line.style.transition = 'opacity 0.3s ease-in';
            line.style.opacity = '1';
        }, 800 + (index * 300));
    });
});
