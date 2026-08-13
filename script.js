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

        if (trackIsPlaying) {
            playerPlayPauseBtn.textContent = pauseText;
            miniPlayerPlayPauseBtn.textContent = pauseText;
        } else {
            playerPlayPauseBtn.textContent = playText;
            miniPlayerPlayPauseBtn.textContent = playText;
        }

        tracks.forEach((track, index) => {
            if (index === currentTrackIndex && trackIsPlaying) {
                track.originalButton.innerHTML = `<span aria-hidden="true">${pauseText} Pause</span>`;
            } else {
                track.originalButton.innerHTML = `<span aria-hidden="true">${playText} Écouter</span>`;
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
        
        miniPlayerTrackTitleDisplay.textContent = track.title;
        miniPlayerTrackArtistDisplay.textContent = track.artist;
        miniPlayerTrackImageDisplay.src = track.image;

        updatePlayButtonStates(isPlaying, track.title); 
    };

    const playCurrentTrack = () => {
        audioElement.play().then(() => {
            isPlaying = true;
            updatePlayButtonStates(true, tracks[currentTrackIndex].title);
            spotifyPlayerContainer.setAttribute('aria-hidden', 'false');
            miniPlayerContainer.classList.add('active');
        }).catch(error => {
            isPlaying = false;
            updatePlayButtonStates(false, tracks[currentTrackIndex].title);
        });
    };

    const pauseCurrentTrack = () => {
        audioElement.pause();
        isPlaying = false;
        updatePlayButtonStates(false, tracks[currentTrackIndex].title);
    };
    
    const togglePlayPause = () => {
        if (currentTrackIndex === -1 && tracks.length > 0) { 
            loadTrack(0);
            playCurrentTrack();
        } else if (audioElement.paused) {
            playCurrentTrack();
        } else {
            pauseCurrentTrack();
        }
    };

    document.querySelectorAll('.track-card').forEach((card, index) => {
        card.addEventListener('click', () => { 
            if (index === currentTrackIndex) {
                togglePlayPause();
            } else {
                loadTrack(index);
                playCurrentTrack();
            }
            spotifyPlayerContainer.classList.add('active'); 
            spotifyPlayerContainer.setAttribute('aria-hidden', 'false');
            miniPlayerContainer.classList.add('active');
        });
    });

    closeBtn.addEventListener('click', () => {
        spotifyPlayerContainer.classList.remove('active');
        spotifyPlayerContainer.setAttribute('aria-hidden', 'true');
    });

    playerPlayPauseBtn.addEventListener('click', togglePlayPause);
    miniPlayerPlayPauseBtn.addEventListener('click', togglePlayPause);

    prevBtn.addEventListener('click', () => {
        if (tracks.length === 0) return;
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        loadTrack(currentTrackIndex);
        playCurrentTrack();
    });

    nextBtn.addEventListener('click', () => {
        if (tracks.length === 0) return;
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(currentTrackIndex);
        playCurrentTrack();
    });

    audioElement.addEventListener('ended', () => {
        if (currentTrackIndex < tracks.length - 1) {
            nextBtn.click(); 
        } else {
            pauseCurrentTrack();
        }
    });

    audioElement.addEventListener('play', () => {
        isPlaying = true;
        if(currentTrackIndex !== -1) updatePlayButtonStates(true, tracks[currentTrackIndex].title);
    });
    audioElement.addEventListener('pause', () => {
        isPlaying = false;
        if(currentTrackIndex !== -1) updatePlayButtonStates(false, tracks[currentTrackIndex].title);
    });
    
    miniPlayerContainer.addEventListener('click', (event) => {
        if (!miniPlayerPlayPauseBtn.contains(event.target) && event.target !== miniPlayerPlayPauseBtn) {
            spotifyPlayerContainer.classList.add('active');
            spotifyPlayerContainer.setAttribute('aria-hidden', 'false');
        }
    });
};

// Initialisation globale
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initSmoothScrolling();
    initHeaderScrollEffect();
    initCountdown();
    initBurgerMenu();
    initReadMoreBio();
    initSpotifyPlayer();

    // ICI EST LA CORRECTION POUR LE FOOTER : innerHTML au lieu de textContent
    const copyrightSmall = document.querySelector('footer .copyright small');
    if (copyrightSmall) {
        const currentYear = new Date().getFullYear();
        copyrightSmall.innerHTML = `© ${currentYear} Deygo Josy | Propulsé par <a href="https://www.instagram.com/dizame221" target="_blank" style="color: var(--primary-color); font-weight: bold; text-decoration: none;">Dizame</a>. Tous droits réservés.`;
    }
});
