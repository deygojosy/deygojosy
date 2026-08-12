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
    },
    DEFAULT_COVER: 'images/album-cover.webp'
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

    const navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);

    burgerBtn.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        mainNav.setAttribute('aria-hidden', String(isExpanded)); 
        navOverlay.classList.toggle('active', !isExpanded);
        document.body.style.overflow = isExpanded ? '' : 'hidden';
        this.setAttribute('aria-label', isExpanded ? 'Ouvrir le menu' : 'Fermer le menu');
    });

    const closeMenu = () => {
        burgerBtn.setAttribute('aria-expanded', 'false');
        mainNav.setAttribute('aria-hidden', 'true');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
        burgerBtn.setAttribute('aria-label', 'Ouvrir le menu');
    };

    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    navOverlay.addEventListener('click', closeMenu);
};

// Logique du Lecteur Audio
const initSpotifyPlayer = () => {
    const spotifyPlayerContainer = document.getElementById('spotifyPlayer');
    const audioElement = document.getElementById('playerAudio');
    const closeBtn = spotifyPlayerContainer.querySelector('.close-player');
    const playerPlayPauseBtn = spotifyPlayerContainer.querySelector('.main-play-pause-btn'); 
    const prevBtn = spotifyPlayerContainer.querySelector('.prev-btn');
    const nextBtn = spotifyPlayerContainer.querySelector('.next-btn');
    const playerTrackTitleDisplay = document.getElementById('playerTrackTitle');
    const playerTrackArtistDisplay = document.getElementById('playerTrackArtist');
    const playerTrackImageDisplay = document.getElementById('playerTrackImage');

    const miniPlayerContainer = document.getElementById('miniPlayer');
    const miniPlayerTrackTitleDisplay = document.getElementById('miniPlayerTrackTitle');
    const miniPlayerTrackArtistDisplay = document.getElementById('miniPlayerTrackArtist');
    const miniPlayerTrackImageDisplay = document.getElementById('miniPlayerTrackImage');
    const miniPlayerPlayPauseBtn = document.getElementById('miniPlayerPlayPauseBtn');

    if (!audioElement || !spotifyPlayerContainer || !miniPlayerContainer || !playerPlayPauseBtn || !miniPlayerPlayPauseBtn) {
        console.error("Un ou plusieurs éléments du lecteur audio sont manquants.");
        return;
    }
    
    const tracks = [];
    document.querySelectorAll('.track-card .play-btn').forEach((btn) => {
        tracks.push({
            id: btn.getAttribute('data-audio'), 
            title: btn.getAttribute('data-title'),
            audio: btn.getAttribute('data-audio'),
            image: btn.getAttribute('data-cover') || CONFIG.DEFAULT_COVER,
            artist: btn.getAttribute('data-artist') || 'Deygo Josy',
            originalButton: btn 
        });
    });

    let currentTrackIndex = -1;
    let isPlaying = false;

    const updatePlayButtonStates = (trackIsPlaying, trackTitle = "") => {
        const playText = "▶";
        const pauseText = "❚❚";
        const playLabel = trackTitle ? `Lire ${trackTitle}` : "Lire";
        const pauseLabel = trackTitle ? `Mettre en pause ${trackTitle}` : "Mettre en pause";

        if (trackIsPlaying) {
            playerPlayPauseBtn.textContent = pauseText;
            playerPlayPauseBtn.setAttribute('aria-label', pauseLabel);
            miniPlayerPlayPauseBtn.textContent = pauseText;
            miniPlayerPlayPauseBtn.setAttribute('aria-label', pauseLabel);
        } else {
            playerPlayPauseBtn.textContent = playText;
            playerPlayPauseBtn.setAttribute('aria-label', playLabel);
            miniPlayerPlayPauseBtn.textContent = playText;
            miniPlayerPlayPauseBtn.setAttribute('aria-label', playLabel);
        }

        tracks.forEach((track, index) => {
            const buttonLabelBase = track.title ? ` ${track.title}` : "";
            if (index === currentTrackIndex && trackIsPlaying) {
                track.originalButton.innerHTML = `<span aria-hidden="true">${pauseText} Pause</span>`;
                track.originalButton.setAttribute('aria-label', `Mettre en pause${buttonLabelBase}`);
            } else {
                track.originalButton.innerHTML = `<span aria-hidden="true">${playText} Écouter</span>`;
                track.originalButton.setAttribute('aria-label', `Écouter${buttonLabelBase}`);
            }
        });
    };
    
    const loadTrack = (index) => {
        if (index < 0 || index >= tracks.length) return;
        currentTrackIndex = index;
        const track = tracks[currentTrackIndex];

        audioElement.src = track.audio;
        playerTrackTitleDisplay.textContent = track.title;
        playerTrackArtistDisplay.textContent = track.artist;
        playerTrackImageDisplay.src = track.image;
        playerTrackImageDisplay.alt = `Pochette de ${track.title}`;

        miniPlayerTrackTitleDisplay.textContent = track.title;
        miniPlayerTrackArtistDisplay.textContent = track.artist;
        miniPlayerTrackImageDisplay.src = track.image;
        miniPlayerTrackImageDisplay.alt = `Mini pochette de ${track.title}`;

        updatePlayButtonStates(isPlaying, track.title); 
    };

    const playCurrentTrack = () => {
        audioElement.play().then(() => {
            isPlaying = true;
            updatePlayButtonStates(true, tracks[currentTrackIndex].title);
            spotifyPlayerContainer.setAttribute('aria-hidden', 'false');
            miniPlayerContainer.classList.add('active');
        }).catch(error => {
            console.warn("La lecture automatique a été bloquée. L'utilisateur doit interagir.", error);
            isPlaying = false;
            updatePlayButtonStates(false, tracks[currentTrackIndex].title);
        });
    };

    const pauseCurrentTrack = () => {
        audioElement.pause();
        isPlaying = false;
        updateVoici le code corrigé pour afficher les vidéos à l'horizontale tout en réduisant leur taille. L'utilisation de **Flexbox** est la méthode la plus simple pour gérer cet affichage sur ton site.

**HTML**
Assure-toi que tes vidéos sont regroupées dans une balise contenant une classe spécifique, par exemple `<div class="video-container">` :

```html
<div class="video-container">
    <video src="chemin/vers/ta-video1.mp4" controls></video>
    <video src="chemin/vers/ta-video2.mp4" controls></video>
    <video src="chemin/vers/ta-video3.mp4" controls></video>
</div>
