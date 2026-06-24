// Main JavaScript for VIT Bhopal Campus Tour
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNavigation();
    initAnimations();
    initContactForm();
    initTourHandlers();
    initSmoothScrolling();
    initParallax();
    initShowcaseSlider();
    initInteractiveMap();
    initVideoModal();
    initKeyboardShortcuts();
    initLazyLoadSections();
    console.log('🎓 VIT Bhopal Virtual Gateway initialized successfully!');
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

    if (navToggle) navToggle.addEventListener('click', toggleMobileMenu);

    // Highlight active link
    const sections = document.querySelectorAll('section');
    const updateActiveLink = () => {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= (section.offsetTop - 200)) current = section.id;
        });
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === `#${current}` || (current === 'home' && href === '#home'));
        });
    };
    
    window.addEventListener('scroll', () => {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
        updateActiveLink();
    });

    navLinks.forEach(link => link.addEventListener('click', () => {
        if (navToggle) navToggle.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
    }));
}

/* -------------------- Scroll Animations -------------------- */
function initAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/* -------------------- Contact Form (Email.js) -------------------- */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    if (!form || !submitBtn) return;

    emailjs.init("QC0tm7J1LheIuk7J3"); // Original Public Key

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
                    submitBtn.innerHTML = 'Submit Inquiry <i class="fa-solid fa-paper-plane"></i>';
                    submitBtn.disabled = false;
                }, 2000);
            })
            .catch(() => {
                submitBtn.innerHTML = '❌ Failed';
                showNotification('Error sending message. Try again.', 'error');
                setTimeout(() => {
                    submitBtn.innerHTML = 'Submit Inquiry <i class="fa-solid fa-paper-plane"></i>';
                    submitBtn.disabled = false;
                }, 2000);
            });
    });
}

/* -------------------- Tour Handlers -------------------- */
function initTourHandlers() {
    const startBtn = document.getElementById('startTourBtn');
    const learnBtn = document.getElementById('learnMoreBtn');

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            showNotification('Starting virtual campus tour...', 'info');
            setTimeout(() => {
                window.location.href = 'tour-project/campus tour.html';
            }, 800);
        });
    }

    if (learnBtn) {
        learnBtn.addEventListener('click', () => {
            const target = document.getElementById('about');
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    }
}

/* -------------------- Hero Showcase Slider -------------------- */
function initShowcaseSlider() {
    const items = document.querySelectorAll('.showcase-item');
    if (items.length === 0) return;
    
    let currentIndex = 0;
    let intervalId = null;

    function showImage(index) {
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        currentIndex = index;
    }

    function nextImage() {
        let next = (currentIndex + 1) % items.length;
        showImage(next);
    }

    function prevImage() {
        let prev = (currentIndex - 1 + items.length) % items.length;
        showImage(prev);
    }

    function startCycle() {
        intervalId = setInterval(nextImage, 5000);
    }

    function stopCycle() {
        if (intervalId) clearInterval(intervalId);
    }

    const nextBtn = document.querySelector('.showcase-arrow.next');
    const prevBtn = document.querySelector('.showcase-arrow.prev');

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            stopCycle();
            nextImage();
            startCycle();
        });
        prevBtn.addEventListener('click', () => {
            stopCycle();
            prevImage();
            startCycle();
        });
    }

    startCycle();
}

/* -------------------- Interactive Campus Map -------------------- */
function initInteractiveMap() {
    const pins = document.querySelectorAll('.map-pin');
    const title = document.getElementById('detailTitle');
    const desc = document.getElementById('detailDesc');
    const num = document.getElementById('detailNum');
    const bg = document.querySelector('.blueprint-bg');

    if (pins.length === 0) return;

    function updateCard(pin) {
        const pinNum = pin.getAttribute('data-num');
        const pinTitle = pin.getAttribute('data-title');
        const pinDesc = pin.getAttribute('data-desc');

        pins.forEach(p => p.classList.remove('active'));
        pin.classList.add('active');

        if (num) num.textContent = pinNum;
        if (title) title.textContent = pinTitle;
        if (desc) desc.textContent = pinDesc;

        if (bg) {
            const top = parseFloat(pin.style.top);
            const left = parseFloat(pin.style.left);
            bg.style.transform = `scale(1.06) translate(${(50 - left) * 0.15}px, ${(50 - top) * 0.15}px)`;
        }
    }

    pins.forEach(pin => {
        pin.addEventListener('mouseenter', () => updateCard(pin));
        pin.addEventListener('click', () => updateCard(pin));
    });

    // Initialize with first pin
    if (pins[0]) updateCard(pins[0]);
}

/* -------------------- Preview Video Modal -------------------- */
function initVideoModal() {
    const modal = document.getElementById('videoModal');
    const openBtn = document.getElementById('watchPreviewBtn');
    const closeBtn = document.getElementById('modalCloseBtn');
    const overlay = modal ? modal.querySelector('.modal-overlay') : null;
    const video = document.getElementById('previewVideo');

    if (!modal || !openBtn || !closeBtn || !video) return;

    openBtn.addEventListener('click', () => {
        modal.classList.add('active');
        video.play().catch(e => console.log('Autoplay blocked:', e));
    });

    const closeModal = () => {
        modal.classList.remove('active');
        video.pause();
        video.currentTime = 0;
    };

    closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
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
        background: 'rgba(15, 15, 22, 0.8)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px',
        padding: '1rem 1.5rem', color: '#f5f5f7',
        zIndex: 10000, transform: 'translateX(100%)', transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
        maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
    });
    switch(type){ case 'success': n.style.borderColor = '#10b981'; break; case 'error': n.style.borderColor = '#ef4444'; break; case 'warning': n.style.borderColor = '#f59e0b'; break; default: n.style.borderColor = '#0693e3'; }
    document.body.appendChild(n);
    setTimeout(() => n.style.transform = 'translateX(0)', 100);
    setTimeout(() => { n.style.transform = 'translateX(100%)'; setTimeout(() => n.remove(), 400); }, 4000);
}
function getIcon(type){ return { success:'✅', error:'❌', warning:'⚠️', info:'ℹ️' }[type] || 'ℹ️'; }

/* -------------------- Parallax -------------------- */
function initParallax() {
    const bgImage = document.querySelector('.hero-bg-image');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        if (bgImage) {
            bgImage.style.transform = `scale(1.02) translateY(${scrollY * 0.35}px)`;
        }
    });
}

/* -------------------- Keyboard Shortcuts -------------------- */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            const navMenu = document.getElementById('navMenu');
            const navToggle = document.getElementById('navToggle');
            if (navMenu) navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
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
