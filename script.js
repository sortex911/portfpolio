document.addEventListener('DOMContentLoaded', () => {
    /* ── Liquid Glass mouse-tracking refraction on header ── */
    const header = document.querySelector('header');

    document.addEventListener('mousemove', (e) => {
        if (!header) return;
        const rect = header.getBoundingClientRect();
        // normalise 0–1 across viewport width / header height zone
        const x = (e.clientX / window.innerWidth) * 100;
        const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)) * 100;

        // shift the specular highlight based on cursor X
        header.style.setProperty('--glass-x', `${x}%`);
        header.style.setProperty('--glass-y', `${y}%`);

        // dynamic colour tilt — cyan <-> purple as cursor moves left <-> right
        const cyanAlpha  = 0.04 + (1 - x / 100) * 0.06;
        const purpleAlpha = 0.04 + (x / 100) * 0.06;
        header.style.background = `linear-gradient(
            135deg,
            rgba(255,255,255,0.07) 0%,
            rgba(0,255,204,${cyanAlpha.toFixed(2)}) ${x * 0.4}%,
            rgba(176,0,255,${purpleAlpha.toFixed(2)}) ${40 + x * 0.4}%,
            rgba(255,255,255,0.03) 100%
        )`;
    });

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
