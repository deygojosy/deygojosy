document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js');

// Loader
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            loader.setAttribute('aria-hidden', 'true'); 
        }, 800);
    }
});

// Scroll Reveal
const initScrollAnimations = () => {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    reveals.forEach(r => observer.observe(r));
};

// Accordeon Discographie
const initDiscographyAccordion = () => {
    document.querySelectorAll('.disco-folder-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const folder = btn.parentElement;
            folder.classList.toggle('active');
            btn.setAttribute('aria-expanded', folder.classList.contains('active'));
        });
    });
};

// Menu Burger
const initBurgerMenu = () => {
    const btn = document.querySelector('.burger-btn');
    const nav = document.querySelector('.main-nav');
    if (!btn || !nav) return;

    const toggleMenu = () => {
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !isExpanded);
        nav.setAttribute('aria-hidden', isExpanded);
    };

    btn.addEventListener('click', toggleMenu);
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
        btn.setAttribute('aria-expanded', 'false');
        nav.setAttribute('aria-hidden', 'true');
    }));
};

// Sommaire (ScrollSpy Wiki)
const initWikiSpy = () => {
    const sections = document.querySelectorAll('.wiki-content h3');
    const navLinks = document.querySelectorAll('.wiki-toc a');
    
    if(sections.length === 0 || navLinks.length === 0) return;

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
};

// Lightbox Galerie
const initLightbox = () => {
    const items = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    let currentIndex = 0;

    if (!lightbox || items.length === 0) return;

    const showImg = (index) => {
        lbImg.src = items[index].src;
        currentIndex = index;
    };

    items.forEach((img, index) => {
        img.parentElement.addEventListener('click', () => {
            showImg(index);
            lightbox.classList.add('active');
        });
    });

    document.querySelector('.lightbox-close').addEventListener('click', () => lightbox.classList.remove('active'));
    document.querySelector('.lightbox-prev').addEventListener('click', (e) => { e.stopPropagation(); showImg(currentIndex > 0 ? currentIndex - 1 : items.length - 1); });
    document.querySelector('.lightbox-next').addEventListener('click', (e) => { e.stopPropagation(); showImg(currentIndex < items.length - 1 ? currentIndex + 1 : 0); });
    lightbox.addEventListener('click', (e) => { if(e.target === lightbox) lightbox.classList.remove('active'); });
};

// Formulaire FormSubmit temporaire
const initContact = () => {
    const form = document.getElementById('contactForm');
    if(form) {
        form.addEventListener('submit', () => {
            form.querySelector('button').textContent = "Redirection...";
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initDiscographyAccordion();
    initBurgerMenu();
    initWikiSpy();
    initLightbox();
    initContact();
});
