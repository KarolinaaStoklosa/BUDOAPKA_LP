document.addEventListener('DOMContentLoaded', () => {

    // Obsługa menu mobilnego
    const mobileToggle = document.querySelector('.header__mobile-toggle');
    const header = document.querySelector('.header');
    const mobileNav = document.querySelector('.header__mobile-nav');
    
    if (mobileToggle && header) {
        mobileToggle.addEventListener('click', () => {
            header.classList.toggle('nav-open');
        });
        
        // Zamykanie menu po kliknięciu na link
        if (mobileNav) {
            const navLinks = mobileNav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    header.classList.remove('nav-open');
                });
            });
        }
    }

    const setupHorizontalSlider = ({ sliderSelector, cardSelector, prevSelector, nextSelector, gap = 16 }) => {
        const slider = document.querySelector(sliderSelector);
        const prevBtn = document.querySelector(prevSelector);
        const nextBtn = document.querySelector(nextSelector);

        if (!slider || !prevBtn || !nextBtn) return;

        const updateArrowState = () => {
            const tolerance = 4;
            const maxScroll = slider.scrollWidth - slider.clientWidth;
            const left = Math.max(0, Math.round(slider.scrollLeft));
            prevBtn.classList.toggle('is-hidden', left <= tolerance);
            nextBtn.classList.toggle('is-hidden', left >= maxScroll - tolerance);
        };

        const scrollSlider = (direction) => {
            const card = slider.querySelector(cardSelector);
            if (!card) return;
            const cardWidth = card.offsetWidth;
            const scrollAmount = cardWidth + gap;
            slider.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
        };

        prevBtn.addEventListener('click', () => scrollSlider(-1));
        nextBtn.addEventListener('click', () => scrollSlider(1));

        let scrollTimer;
        slider.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(updateArrowState, 120);
        });

        window.addEventListener('load', updateArrowState);
        window.addEventListener('resize', updateArrowState);
        updateArrowState();
        requestAnimationFrame(updateArrowState);
    };

    // Obsługa suwaków
    setupHorizontalSlider({
        sliderSelector: '.testimonial-slider',
        cardSelector: '.testimonial-card',
        prevSelector: '.slider-btn--prev',
        nextSelector: '.slider-btn--next',
        gap: 30
    });

    setupHorizontalSlider({
        sliderSelector: '#firstStepsCarousel',
        cardSelector: '.first-step-video-card',
        prevSelector: '.first-steps-slider-btn--prev',
        nextSelector: '.first-steps-slider-btn--next',
        gap: 16
    });

    // Obsługa akordeonu FAQ (każda sekcja niezależnie)
    const faqAccordions = document.querySelectorAll('.faq__accordion');
    if (faqAccordions.length) {
        faqAccordions.forEach(accordion => {
            const accordionItems = accordion.querySelectorAll('.faq__item');
            accordionItems.forEach(item => {
                const question = item.querySelector('.faq__question');
                if (!question) return;
                question.addEventListener('click', () => {
                    const wasActive = item.classList.contains('active');
                    accordionItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                    });
                    if (!wasActive) {
                        item.classList.add('active');
                    }
                });
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
function toggleCard(card) {
    const allCards = document.querySelectorAll('.collaboration-card');
    allCards.forEach(c => {
        if (c !== card) {
            c.classList.remove('active');
        }
    });
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
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeContactModal();
            closeDemoModal();
        }
    });
}

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