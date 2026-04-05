document.addEventListener('DOMContentLoaded', () => {
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

    // Intersection Observer for scroll reveal animations
    const revealElements = document.querySelectorAll('.section-reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Optional: only animate once
            }
        });
    };

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Simple parallax effect for background glow elements
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const glow1 = document.querySelector('.glow-1');
        const glow2 = document.querySelector('.glow-2');
        
        if (glow1) {
            glow1.style.transform = `translateY(${scrolled * 0.15}px) scale(1)`;
        }
        if (glow2) {
            glow2.style.transform = `translateY(${scrolled * -0.1}px) scale(1.1)`;
        }
    });

    // Optional: Add a simple entry animation for the main text on load
    const title = document.querySelector('.neon-title');
    const heroDesc = document.querySelector('.hero-desc');
    
    // Animate the terminal typing effect
    const terminalLines = document.querySelectorAll('.terminal-body p');
    terminalLines.forEach((line, index) => {
        line.style.opacity = '0';
        setTimeout(() => {
            line.style.transition = 'opacity 0.2s';
            line.style.opacity = '1';
        }, 1000 + (index * 400));
    });
});
