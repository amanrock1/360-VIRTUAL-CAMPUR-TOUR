// Landing page behaviour: mobile menu, header shadow and the campus video dialog.
document.addEventListener('DOMContentLoaded', () => {
    // ---------- Mobile menu ----------
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('siteNav');

    function setMenu(open) {
        nav.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

    // ---------- Header shadow once the page scrolls ----------
    const header = document.getElementById('siteHeader');
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ---------- Campus video dialog ----------
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('previewVideo');
    const openBtn = document.getElementById('watchPreviewBtn');
    const closeBtn = document.getElementById('modalCloseBtn');
    const overlay = document.getElementById('modalOverlay');

    function openModal() {
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        video.play().catch(() => {});
        closeBtn.focus();
    }

    function closeModal() {
        modal.hidden = true;
        document.body.style.overflow = '';
        video.pause();
        openBtn.focus();
    }

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!modal.hidden) closeModal();
            else setMenu(false);
        }
    });
});
