// Main JavaScript for VIT Bhopal Campus Tour
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNavigation();
    initAnimations();
    initCounters();
    initContactForm();
    initTourCards();
    initSmoothScrolling();
    initParallax();
    initHoverEffects();
    initKeyboardShortcuts();
    initLazyLoadSections();
    console.log('🎓 VIT Bhopal Campus Tour initialized successfully!');
});

/* -------------------- Loading Screen -------------------- */
function initLoader() {
    const loadingScreen = document.getElementById('loadingScreen');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => loadingScreen.style.display = 'none', 500);
        }, 1500);
    });
}

/* -------------------- Navigation -------------------- */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMobileMenu = () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    };

    navToggle.addEventListener('click', toggleMobileMenu);

    // Highlight active link
    const sections = document.querySelectorAll('section');
    const updateActiveLink = () => {
        let current = '';
        sections.forEach(section => {
            if (scrollY >= (section.offsetTop - 200)) current = section.id;
        });
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
    };
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        updateActiveLink();
    });

    navLinks.forEach(link => link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

/* -------------------- Scroll Animations -------------------- */
function initAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.feature-card, .tour-card, .contact-item, .stat-card')
        .forEach(el => { el.classList.add('fade-in'); observer.observe(el); });
}

/* -------------------- Counter Animation -------------------- */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));

    function animateCounter(el) {
        const target = +el.getAttribute('data-target');
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else el.textContent = Math.floor(current);
        }, 16);
    }
}

/* -------------------- Contact Form (Email.js) -------------------- */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    emailjs.init("QC0tm7J1LheIuk7J3"); // Replace with your key

    form.addEventListener('submit', e => {
        e.preventDefault();
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const message = formData.get('message');

        if (!name || !email || !message) return showNotification('Please fill all required fields', 'error');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showNotification('Invalid email', 'error');

        submitBtn.innerHTML = '⏳ Sending...';
        submitBtn.disabled = true;

        emailjs.send('service_m23icog', 'template_gbyvwwz', { name, email, phone: phone || 'Not provided', message, to_email: 'info@vitbhopal.ac.in' })
            .then(() => {
                submitBtn.innerHTML = '✅ Sent!';
                showNotification('Message sent successfully!', 'success');
                form.reset();
                setTimeout(() => {
                    submitBtn.innerHTML = '📤 Send Enquiry';
                    submitBtn.disabled = false;
                }, 2000);
            })
            .catch(() => {
                submitBtn.innerHTML = '❌ Failed';
                showNotification('Error sending message. Try again.', 'error');
                setTimeout(() => {
                    submitBtn.innerHTML = '📤 Send Enquiry';
                    submitBtn.disabled = false;
                }, 2000);
            });
    });
}

/* -------------------- Tour Cards -------------------- */
function initTourCards() {
    document.querySelectorAll('.tour-card').forEach(card => {
        card.addEventListener('click', () => {
            const loc = card.dataset.location;
            showNotification(`Opening ${loc} virtual tour...`, 'info');
            card.style.transform = 'scale(0.95)';
            setTimeout(() => card.style.transform = '', 150);
            setTimeout(() => showNotification(`${loc} tour loaded! Click and drag to explore.`, 'success'), 1500);
        });
    });

    document.getElementById('startTourBtn').addEventListener('click', () => {
        showNotification('Starting virtual campus tour...', 'info');
        window.location.href = 'tour-project/campus tour.html';
    });

    document.getElementById('learnMoreBtn').addEventListener('click', () => {
        document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
    });
}

/* -------------------- Smooth Scrolling -------------------- */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

/* -------------------- Notifications -------------------- */
function showNotification(msg, type = 'info') {
    const n = document.createElement('div');
    n.className = `notification notification-${type}`;
    n.innerHTML = `<div class="notification-content"><span class="notification-icon">${getIcon(type)}</span><span>${msg}</span></div>`;
    Object.assign(n.style, {
        position: 'fixed', top: '100px', right: '20px',
        background: 'var(--glass)', backdropFilter: 'blur(10px)',
        border: '1px solid var(--glass-border)', borderRadius: '12px',
        padding: '1rem 1.5rem', color: 'var(--text-primary)',
        zIndex: 10000, transform: 'translateX(100%)', transition: 'transform 0.3s ease',
        maxWidth: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    });
    switch(type){ case 'success': n.style.borderColor = '#10b981'; break; case 'error': n.style.borderColor = '#ef4444'; break; case 'warning': n.style.borderColor = '#f59e0b'; break; default: n.style.borderColor = '#6366f1'; }
    document.body.appendChild(n);
    setTimeout(() => n.style.transform = 'translateX(0)', 100);
    setTimeout(() => { n.style.transform = 'translateX(100%)'; setTimeout(() => n.remove(), 300); }, 4000);
}
function getIcon(type){ return { success:'✅', error:'❌', warning:'⚠️', info:'ℹ️' }[type] || 'ℹ️'; }

/* -------------------- Parallax -------------------- */
function initParallax() {
    const parallaxEls = document.querySelectorAll('.hero-background');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        parallaxEls.forEach(el => el.style.transform = `translateY(${scrollY * 0.5}px)`);
    });
}

/* -------------------- Interactive Hover -------------------- */
function initHoverEffects() {
    const cards = document.querySelectorAll('.feature-card, .stat-card');
    document.addEventListener('mousemove', e => {
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            if (x>=0 && x<=rect.width && y>=0 && y<=rect.height){
                const rotateX = (y - rect.height/2)/10;
                const rotateY = (rect.width/2 - x)/10;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            } else card.style.transform = '';
        });
    });
}

/* -------------------- Keyboard Shortcuts -------------------- */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.getElementById('navMenu').classList.remove('active');
            document.getElementById('navToggle').classList.remove('active');
        }
    });
}

/* -------------------- Lazy Load Sections -------------------- */
function initLazyLoadSections() {
    const lazyObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('hero')) entry.target.classList.add('loaded');
                lazyObserver.unobserve(entry.target);
            }
        });
    });
    document.querySelectorAll('section').forEach(section => lazyObserver.observe(section));
}
