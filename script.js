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
        // Funkcja do aktualizacji widoczności strzałek
        const updateArrowState = () => {
            if (!slider || !prevBtn || !nextBtn) return;

            // Tolerancja, aby uniknąć problemów z zaokrąglaniem pikseli
            const tolerance = 1; 

            // Ukryj przycisk "wstecz", jeśli jesteśmy na początku
            prevBtn.classList.toggle('is-hidden', slider.scrollLeft <= tolerance);

            // Ukryj przycisk "dalej", jeśli jesteśmy na końcu
            const maxScroll = slider.scrollWidth - slider.clientWidth;
            nextBtn.classList.toggle('is-hidden', slider.scrollLeft >= maxScroll - tolerance);
        };

        // Funkcja do przewijania
        const scrollSlider = (direction) => {
            const card = slider.querySelector('.testimonial-card');
            if (!card) return;
            
            const cardWidth = card.offsetWidth;
            const gap = 30; // Wartość 'gap' z CSS
            const scrollAmount = cardWidth + gap;
            
            slider.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
        };

        // Nasłuchiwanie na kliknięcia
        prevBtn.addEventListener('click', () => scrollSlider(-1));
        nextBtn.addEventListener('click', () => scrollSlider(1));

        // Aktualizuj stan strzałek po każdym przewinięciu
        let scrollTimer;
        slider.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(updateArrowState, 150);
        });

        // Ustaw stan początkowy po załadowaniu i przy zmianie rozmiaru okna
        window.addEventListener('load', updateArrowState);
        window.addEventListener('resize', updateArrowState);
    }

});

// Obsługa przełącznika cennika
const toggleWrapper = document.querySelector('.pricing__toggle-wrapper');
if (toggleWrapper) {
    const options = toggleWrapper.querySelectorAll('.toggle-option');
    const allPrices = document.querySelectorAll('.price[data-monthly]');
    const allPeriods = document.querySelectorAll('.period');

    options.forEach(option => {
        option.addEventListener('click', () => {
            // Usuń klasę 'active' z obu opcji
            options.forEach(opt => opt.classList.remove('active'));
            // Dodaj klasę 'active' do klikniętej opcji
            option.classList.add('active');

            const isYearly = option.dataset.period === 'yearly';

            allPrices.forEach(priceEl => {
                priceEl.textContent = isYearly ? priceEl.dataset.yearly : priceEl.dataset.monthly;
            });

            allPeriods.forEach(periodEl => {
                periodEl.textContent = isYearly ? '/ rok' : '/ miesiąc';
            });
        });
    });
}