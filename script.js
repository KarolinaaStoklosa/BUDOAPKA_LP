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

    // Interaktywny Plan Startu
    const firstStepsGrid = document.getElementById('firstStepsGrid');
    if (firstStepsGrid) {
        const stepCards = Array.from(firstStepsGrid.querySelectorAll('.first-step-card'));
        const progressFill = document.getElementById('firstStepsProgress');
        const progressSummary = document.getElementById('firstStepsSummary');
        const finalCta = document.getElementById('firstStepsFinalCta');
        const progressTrack = document.querySelector('.first-steps-plan__progress-track');
        const storageKey = 'firstStepsWatchedSteps';

        const savedSteps = (() => {
            try {
                const parsed = JSON.parse(localStorage.getItem(storageKey) || '[]');
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return [];
            }
        })();

        const openStep = (cardToOpen) => {
            stepCards.forEach(card => {
                const toggle = card.querySelector('.first-step-card__toggle');
                const content = card.querySelector('.first-step-card__content');
                const shouldOpen = card === cardToOpen;
                card.classList.toggle('is-open', shouldOpen);
                if (content) content.classList.toggle('is-open', shouldOpen);
                if (toggle) toggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
            });
        };

        const updateCurrentStep = () => {
            stepCards.forEach(card => card.classList.remove('is-current'));
            const nextCard = stepCards.find(card => !card.classList.contains('is-completed'));
            if (nextCard) {
                nextCard.classList.add('is-current');
            }
        };

        const updateProgress = () => {
            const completedCount = stepCards.filter(card => card.classList.contains('is-completed')).length;
            const totalCount = stepCards.length;
            const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

            if (progressFill) {
                progressFill.style.width = `${percentage}%`;
            }

            if (progressSummary) {
                progressSummary.textContent = `Obejrzano ${completedCount}/${totalCount} kroków`;
            }

            if (progressTrack) {
                progressTrack.setAttribute('aria-valuenow', String(completedCount));
                progressTrack.setAttribute('aria-valuemax', String(totalCount));
            }

            if (finalCta) {
                finalCta.classList.toggle('is-visible', completedCount === totalCount && totalCount > 0);
            }

            updateCurrentStep();
        };

        stepCards.forEach((card, index) => {
            const stepNumber = index + 1;
            const toggle = card.querySelector('.first-step-card__toggle');
            const doneButton = card.querySelector('.first-step-card__done');

            if (savedSteps.includes(stepNumber)) {
                card.classList.add('is-completed');
                if (doneButton) {
                    doneButton.textContent = 'Krok obejrzany';
                }
            }

            if (toggle) {
                toggle.addEventListener('click', () => {
                    const isOpen = card.classList.contains('is-open');
                    if (isOpen) {
                        stepCards.forEach(item => {
                            item.classList.remove('is-open');
                            const itemContent = item.querySelector('.first-step-card__content');
                            const itemToggle = item.querySelector('.first-step-card__toggle');
                            if (itemContent) itemContent.classList.remove('is-open');
                            if (itemToggle) itemToggle.setAttribute('aria-expanded', 'false');
                        });
                        return;
                    }
                    openStep(card);
                });
            }

            if (doneButton) {
                doneButton.addEventListener('click', () => {
                    const nowCompleted = !card.classList.contains('is-completed');
                    card.classList.toggle('is-completed', nowCompleted);
                    doneButton.textContent = nowCompleted ? 'Krok obejrzany' : 'Oznacz jako obejrzane';

                    const completedSteps = stepCards
                        .map((item, idx) => (item.classList.contains('is-completed') ? idx + 1 : null))
                        .filter(Boolean);

                    localStorage.setItem(storageKey, JSON.stringify(completedSteps));
                    updateProgress();
                });
            }
        });

        updateProgress();

        const openCurrentOrFirst = stepCards.find(card => card.classList.contains('is-current')) || stepCards[0];
        if (openCurrentOrFirst) {
            openStep(openCurrentOrFirst);
        }
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