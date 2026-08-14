/**
 * DEYGO JOSY - SCRIPT OFFICIEL
 * Architecture modulaire pour gestion de l'UI et de la Performance.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Retrait de la classe loading une fois le DOM chargé
    document.body.classList.remove('loading');
    
    // Initialisation des modules
    HeaderManager.init();
    MobileMenu.init();
    ScrollObserver.init();
    LightboxManager.init();
    FooterManager.init();
});

/**
 * 1. Gestion de l'entête au scroll (Effet Glassmorphism)
 */
const HeaderManager = {
    init() {
        this.header = document.getElementById('header');
        if (!this.header) return;
        this.bindEvents();
    },
    bindEvents() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        }, { passive: true });
    }
};

/**
 * 2. Gestion du Menu Mobile
 */
const MobileMenu = {
    init() {
        this.toggleBtn = document.querySelector('.menu-toggle');
        this.nav = document.getElementById('main-nav');
        this.navLinks = document.querySelectorAll('.nav-link, .nav-btn');
        
        if (!this.toggleBtn || !this.nav) return;
        this.bindEvents();
    },
    bindEvents() {
        this.toggleBtn.addEventListener('click', () => this.toggle());
        
        // Fermeture au clic sur un lien
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.nav.classList.contains('active')) {
                    this.toggle();
                }
            });
        });
    },
    toggle() {
        const isExpanded = this.toggleBtn.getAttribute('aria-expanded') === 'true';
        this.toggleBtn.setAttribute('aria-expanded', !isExpanded);
        this.toggleBtn.classList.toggle('active');
        this.nav.classList.toggle('active');
        
        // Blocage du scroll du body sur mobile
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    }
};

/**
 * 3. Observer pour les animations au défilement
 */
const ScrollObserver = {
    init() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        this.elements = document.querySelectorAll('.fade-up');
        if (!this.elements.length) return;

        const options = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver(this.handleIntersection, options);
        
        this.elements.forEach(el => {
            this.observer.observe(el);
        });
    },
    handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }
};

/**
 * 4. Gestion Lightbox Galerie (Interactive)
 */
const LightboxManager = {
    init() {
        this.items = document.querySelectorAll('.gallery-item img');
        this.lightbox = document.getElementById('lightbox');
        this.lbImg = document.getElementById('lightbox-img');
        if (!this.lightbox || this.items.length === 0) return;
        
        this.currentIndex = 0;
        this.bindEvents();
    },
    showImg(index) {
        this.lbImg.src = this.items[index].src;
        this.currentIndex = index;
    },
    bindEvents() {
        this.items.forEach((img, index) => {
            img.parentElement.addEventListener('click', () => {
                this.showImg(index);
                this.lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        document.querySelector('.lightbox-close').addEventListener('click', () => this.close());
        
        document.querySelector('.lightbox-prev').addEventListener('click', (e) => {
            e.stopPropagation();
            this.showImg(this.currentIndex > 0 ? this.currentIndex - 1 : this.items.length - 1);
        });
        
        document.querySelector('.lightbox-next').addEventListener('click', (e) => {
            e.stopPropagation();
            this.showImg(this.currentIndex < this.items.length - 1 ? this.currentIndex + 1 : 0);
        });
        
        this.lightbox.addEventListener('click', (e) => {
            if(e.target === this.lightbox) this.close();
        });
    },
    close() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
};

/**
 * 5. Gestion Footer Dynamique
 */
const FooterManager = {
    init() {
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }
};
