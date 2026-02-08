document.addEventListener('DOMContentLoaded', () => {

    // Obsługa menu mobilnego
    const mobileToggle = document.querySelector('.header__mobile-toggle');
    const header = document.querySelector('.header');
    
    if (mobileToggle && header) {
        mobileToggle.addEventListener('click', () => {
            header.classList.toggle('nav-open');
        });
    }

    // ULEPSZONA OBSŁUGA SUWAKA OPINII
    const slider = document.querySelector('.testimonial-slider');
    const prevBtn = document.querySelector('.slider-btn--prev');
    const nextBtn = document.querySelector('.slider-btn--next');

    if (slider && prevBtn && nextBtn) {
        const updateArrowState = () => {
            if (!slider || !prevBtn || !nextBtn) return;
            const tolerance = 1; 
            prevBtn.classList.toggle('is-hidden', slider.scrollLeft <= tolerance);
            const maxScroll = slider.scrollWidth - slider.clientWidth;
            nextBtn.classList.toggle('is-hidden', slider.scrollLeft >= maxScroll - tolerance);
        };

        const scrollSlider = (direction) => {
            const card = slider.querySelector('.testimonial-card');
            if (!card) return;
            const cardWidth = card.offsetWidth;
            const gap = 30; // Wartość 'gap' z CSS
            const scrollAmount = cardWidth + gap;
            slider.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
        };

        prevBtn.addEventListener('click', () => scrollSlider(-1));
        nextBtn.addEventListener('click', () => scrollSlider(1));

        let scrollTimer;
        slider.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(updateArrowState, 150);
        });

        window.addEventListener('load', updateArrowState);
        window.addEventListener('resize', updateArrowState);
    }

    // Obsługa akordeonu FAQ
    const faqItems = document.querySelectorAll('.faq__item');
    if (faqItems) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq__question');
            question.addEventListener('click', () => {
                const wasActive = item.classList.contains('active');
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                if (!wasActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // Obsługa Banera Cookies
    checkCookieConsent();
    const acceptBtn = document.getElementById('acceptCookies');
    const rejectBtn = document.getElementById('rejectCookies');
    if (acceptBtn) acceptBtn.addEventListener('click', acceptCookies);
    if (rejectBtn) rejectBtn.addEventListener('click', rejectCookies);

    // Obsługa Modali
    setupModals();
    
    // Obsługa Banera Early Access (Sticky Header)
    const minimizedBanner = document.getElementById('earlyAccessMinimized');
    if (minimizedBanner) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                minimizedBanner.classList.add('show');
            } else {
                minimizedBanner.classList.remove('show');
            }
        }, { passive: true });
    }
});

// --- FUNKCJA ROZWIJANIA KART (COLLABORATION) ---
// Ta funkcja jest wywoływana z onclick w HTML
function toggleCard(card) {
    // 1. Znajdź wszystkie karty
    const allCards = document.querySelectorAll('.collaboration-card');
    
    // 2. Zamknij wszystkie inne karty oprócz klikniętej
    allCards.forEach(c => {
        if (c !== card) {
            c.classList.remove('active');
        }
    });

    // 3. Przełącz klasę active na klikniętej karcie
    card.classList.toggle('active');
}

// --- FUNKCJE POMOCNICZE (MODALE, COOKIES) ---

function openContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) modal.classList.add('active');
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) modal.classList.remove('active');
}

function openDemoModal() {
    const modal = document.getElementById('demoModal');
    if (modal) modal.classList.add('active');
}

function closeDemoModal() {
    const modal = document.getElementById('demoModal');
    if (modal) modal.classList.remove('active');
}

function setupModals() {
    // Zamykanie modali przyciskiem Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeContactModal();
            closeDemoModal();
        }
    });
}

// Cookies
function showCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.classList.add('show');
}
function hideCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.classList.remove('show');
}
function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    hideCookieBanner();
}
function rejectCookies() {
    window.location.href = 'https://www.google.pl';
}
function checkCookieConsent() {
    if (!localStorage.getItem('cookiesAccepted')) {
        showCookieBanner();
    }
}