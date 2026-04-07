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

    // Parallax background glow and hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const glow1 = document.querySelector('.glow-1');
        const glow2 = document.querySelector('.glow-2');
        if (glow1) glow1.style.transform = `translateY(${scrolled * 0.1}px)`;
        if (glow2) glow2.style.transform = `translateY(${scrolled * -0.05}px)`;
        
        // Hero Section Parallax Effect
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.35}px)`;
            heroContent.style.opacity = Math.max(0, 1 - (scrolled * 0.0025));
        }
        
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

    // Skills 3D ScrollTrigerr Animation
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        const skillsSlides = gsap.utils.toArray(".skill-slide");
        if (skillsSlides.length > 0) {
            const delay = 0.5;
            const ttl = gsap.timeline({
                defaults: {
                    ease: "power1.inOut",
                    transformOrigin: "center center -150px"
                },
                scrollTrigger: {
                    trigger: ".skills-wrapper",
                    start: "center center",
                    end: "+=" + (skillsSlides.length - 1) * 80 + "%",
                    pin: ".skills-section",
                    scrub: true,
                }
            });

            gsap.set(skillsSlides, {
                rotationX: (i) => (i ? -90 : 0),
                transformOrigin: "center center -150px"
            });

            skillsSlides.forEach((slide, i) => {
                const nextSlide = skillsSlides[i + 1];
                if (!nextSlide) return;
                ttl.to(
                    slide,
                    {
                        rotationX: 90,
                        onComplete: () => gsap.set(slide, { rotationX: -90 })
                    },
                    "+=" + delay
                ).to(
                    nextSlide,
                    {
                        rotationX: 0
                    },
                    "<"
                );
            });
            // Keep final slide on the screen
            ttl.to({}, { duration: delay });
        }
        
        // Projects GSAP Horizontal ScrollTrigger — desktop only
        const projectCards = gsap.utils.toArray(".project-card");
        const dots = document.querySelectorAll(".progress-dot");
        const scrollHint = document.querySelector(".scroll-hint");
        const totalCards = projectCards.length;

        const isDesktop = window.innerWidth > 900;

        if (totalCards > 0 && isDesktop) {
            // Set initial state: first card visible, rest hidden
            projectCards.forEach((card, i) => {
                const img = card.querySelector(".project-image");
                const content = card.querySelector(".project-content");
                const num = card.querySelector(".project-number");
                gsap.set(img,     { x: i === 0 ?  0 : -70, opacity: i === 0 ? 1 : 0 });
                gsap.set(content, { x: i === 0 ?  0 :  70, opacity: i === 0 ? 1 : 0 });
                if (num) gsap.set(num, { opacity: i === 0 ? 1 : 0, y: 0 });
            });

            // Main horizontal pin + scrub animation
            const horizontalScroll = gsap.to(projectCards, {
                xPercent: -100 * (totalCards - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: ".projects-section",
                    pin: true,
                    scrub: 1.2,
                    snap: {
                        snapTo: 1 / (totalCards - 1),
                        duration: { min: 0.3, max: 0.6 },
                        ease: "power2.inOut"
                    },
                    end: () => "+=" + window.innerWidth * (totalCards - 1),
                    onUpdate(self) {
                        // Sync progress dots
                        const current = Math.round(self.progress * (totalCards - 1));
                        dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
                        // Fade scroll hint out after leaving first panel
                        if (scrollHint) {
                            gsap.to(scrollHint, { opacity: self.progress > 0.05 ? 0 : 1, duration: 0.4, overwrite: "auto" });
                        }
                    }
                }
            });

            // Per-panel entrance animations using containerAnimation
            projectCards.forEach((card, i) => {
                if (i === 0) return; // first panel already visible
                const img     = card.querySelector(".project-image");
                const content = card.querySelector(".project-content");
                const num     = card.querySelector(".project-number");

                ScrollTrigger.create({
                    trigger: card,
                    containerAnimation: horizontalScroll,
                    start: "left 85%",
                    onEnter() {
                        gsap.to(img,     { x: 0, opacity: 1, duration: 0.75, ease: "power3.out" });
                        gsap.to(content, { x: 0, opacity: 1, duration: 0.75, delay: 0.12, ease: "power3.out" });
                        if (num) gsap.to(num, { opacity: 1, duration: 0.5, delay: 0.25 });
                    },
                    onLeaveBack() {
                        gsap.to(img,     { x: -70, opacity: 0, duration: 0.4 });
                        gsap.to(content, { x:  70, opacity: 0, duration: 0.4 });
                        if (num) gsap.to(num, { opacity: 0, duration: 0.3 });
                    }
                });
            });
        }
    }
});
