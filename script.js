// Bascule la classe no-js en js sur l'élément html pour le CSS
document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js');

// Configuration
const CONFIG = {
    RELEASE_DATE: '2023-12-15', 
    SCROLL_THRESHOLD: 100,
    LOADER_DURATION: 1000,
    HEADER: { 
        DEFAULT_PADDING: '1rem 5%',
        SCROLLED_PADDING: '0.5rem 5%',
        LOGO: {
            DEFAULT_HEIGHT: '50px',
            SCROLLED_HEIGHT: '40px'
        }
    }
};

// Loader
const initLoader = () => {
    const loader = document.querySelector('.loader');
    if (!loader) return;

    loader.setAttribute('aria-hidden', 'false');

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            loader.style.pointerEvents = 'none';
            loader.setAttribute('aria-hidden', 'true'); 
        }, CONFIG.LOADER_DURATION);
    });
};

// Smooth scrolling
const initSmoothScrolling = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                try {
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    } else {
                        location.hash = targetId;
                    }
                } catch (err) {
                    location.hash = targetId;
                }
            }
        });
    });
};

// Header scroll effect
const initHeaderScrollEffect = () => {
    const header = document.querySelector('header');
    const logoImg = document.querySelector('.logo img');

    if (!header) return;

    let isScrolling;
    window.addEventListener('scroll', () => {
        clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            const scrollY = window.scrollY || window.pageYOffset;
            if (scrollY > CONFIG.SCROLL_THRESHOLD) {
                header.style.padding = CONFIG.HEADER.SCROLLED_PADDING;
                if (logoImg) logoImg.style.height = CONFIG.HEADER.LOGO.SCROLLED_HEIGHT;
            } else {
                header.style.padding = CONFIG.HEADER.DEFAULT_PADDING;
                if (logoImg) logoImg.style.height = CONFIG.HEADER.LOGO.DEFAULT_HEIGHT;
            }
        }, 50); 
    }, { passive: true });
};

// Animations au défilement (Scroll Reveal)
const initScrollAnimations = () => {
    const reveals = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" 
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });
};

// Accordeon Discographie
const initDiscographyAccordion = () => {
    const folders = document.querySelectorAll('.disco-folder');
    
    folders.forEach(folder => {
        const btn = folder.querySelector('.disco-folder-btn');
        if(!btn) return;
        
        btn.addEventListener('click', () => {
            folder.classList.toggle('active');
            const isExpanded = folder.classList.contains('active');
            btn.setAttribute('aria-expanded', isExpanded);
        });
    });
};

// Countdown
const initCountdown = () => {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return; 

    const updateCountdown = () => {
        const releaseDate = new Date(CONFIG.RELEASE_DATE).getTime();
        const now = new Date().getTime();
        const distance = releaseDate - now;

        if (distance < 0) {
            countdownElement.textContent = "DISPONIBLE MAINTENANT !";
            countdownElement.setAttribute('aria-label', "Le pré-album est disponible maintenant.");
            return false; 
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        let countdownText = `Sortie dans ${days} jour${days > 1 ? 's' : ''}`;
        if (days < 1) { 
             countdownText = `Sortie dans ${hours} heure${hours > 1 ? 's' : ''} et ${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else if (days < 7) { 
            countdownText = `Sortie dans ${days} jour${days > 1 ? 's' : ''} et ${hours} heure${hours > 1 ? 's' : ''}`;
        }
        countdownElement.textContent = countdownText;
        countdownElement.setAttribute('aria-label', countdownText.replace('Sortie dans', 'Sortie prévue dans'));
        return true; 
    };

    if (updateCountdown()) {
        const countdownInterval = setInterval(() => {
            if (!updateCountdown()) {
                clearInterval(countdownInterval);
            }
        }, 60000); 
    }
};

// Menu Burger
const initBurgerMenu = () => {
    const burgerBtn = document.querySelector('.burger-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (!burgerBtn || !mainNav) return;

    const openMenu = () => {
        burgerBtn.setAttribute('aria-expanded', 'true');
        mainNav.setAttribute('aria-hidden', 'false'); 
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        burgerBtn.setAttribute('aria-expanded', 'false');
        mainNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    burgerBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
};

// Bio "Afficher tout"
const initReadMoreBio = () => {
    const btnReadMore = document.getElementById('btn-read-more');
    const bioMoreText = document.getElementById('bio-more');

    if (btnReadMore && bioMoreText) {
        btnReadMore.addEventListener('click', () => {
            if (bioMoreText.style.display === 'none' || bioMoreText.style.display === '') {
                bioMoreText.style.display = 'block';
                btnReadMore.textContent = 'Réduire';
            } else {
                bioMoreText.style.display = 'none';
                btnReadMore.textContent = 'Afficher tout';
            }
        });
    }
};

// Formulaire de contact (Activation FormSubmit Temporaire)
const initContactForm = () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', () => {
        const btn = form.querySelector('button[type="submit"]');
        btn.textContent = 'Redirection vers FormSubmit...';
    });
};

// Lightbox Galerie
const initLightbox = () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    if (!lightbox || galleryItems.length === 0) return;

    let currentIndex = 0;
    const images = Array.from(galleryItems).map(item => item.querySelector('img'));

    const updateLightboxImage = (index) => {
        lightboxImg.src = images[index].src;
        lightboxImg.alt = images[index].alt;
        currentIndex = index;
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            updateLightboxImage(index);
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        setTimeout(() => lightboxImg.src = '', 300); 
    };

    const showPrev = (e) => {
        if(e) e.stopPropagation();
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
        updateLightboxImage(currentIndex);
    };

    const showNext = (e) => {
        if(e) e.stopPropagation();
        currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
        updateLightboxImage(currentIndex);
    };

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        }
    });
};

// Initialisation globale
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initSmoothScrolling();
    initHeaderScrollEffect();
    initScrollAnimations();
    initDiscographyAccordion();
    initCountdown();
    initBurgerMenu();
    initReadMoreBio();
    initLightbox();
    initContactForm();

    const copyrightSmall = document.querySelector('footer .copyright small');
    if (copyrightSmall) {
        const currentYear = new Date().getFullYear();
        copyrightSmall.innerHTML = `© ${currentYear} Deygo Josy | Propulsé par <a href="https://www.instagram.com/dizame221" target="_blank" style="color: var(--primary-color); font-weight: bold; text-decoration: none;">Dizame</a>. Tous droits réservés.`;
    }
});
