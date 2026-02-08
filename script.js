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
    const allOldPrices = document.querySelectorAll('.old-price[data-monthly]');
    const allPricesBefore = document.querySelectorAll('.price-before[data-monthly]');
    const allPeriods = document.querySelectorAll('.yearly-info');

    options.forEach(option => {
        option.addEventListener('click', () => {
            const isYearly = option.dataset.period === 'yearly';
            const period = option.dataset.period;

            // Update active state
            options.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');

            // Update prices
            allPrices.forEach(priceEl => {
                priceEl.textContent = isYearly ? priceEl.dataset.yearly : priceEl.dataset.monthly;
            });

            // Update old prices
            allOldPrices.forEach(price => {
                const newPrice = price.dataset[period];
                price.textContent = `${newPrice} zł`;
            });

            // Update prices before promo code
            allPricesBefore.forEach(priceBeforeEl => {
                const priceValue = isYearly ? priceBeforeEl.dataset.yearly : priceBeforeEl.dataset.monthly;
                priceBeforeEl.textContent = `${priceValue} zł Cena przed kodem`;
            });

            // Update payment period info
            allPeriods.forEach(periodEl => {
                periodEl.textContent = isYearly ? 'Płatność z góry roczna - 20% zniżki' : 'Płatność miesięczna';
            });
        });
    });
}

// Obsługa akordeonu FAQ
const faqItems = document.querySelectorAll('.faq__item');
if (faqItems) {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        question.addEventListener('click', () => {
            const wasActive = item.classList.contains('active');
            
            // Zamknij wszystkie inne otwarte odpowiedzi
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Jeśli kliknięty element nie był aktywny, otwórz go
            if (!wasActive) {
                item.classList.add('active');
            }
        });
    });
}

// ===== CONTACT MODAL FUNCTIONALITY =====

// GraphQL endpoint - you'll need to replace this with your actual GraphQL endpoint
const GRAPHQL_ENDPOINT = 'https://api.budoapka.pl/graphql';

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Modal functions
function openContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        resetContactForm();
    }
}

// Reset form to initial state
function resetContactForm() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const emailError = document.getElementById('emailError');
    const submitBtn = document.getElementById('submitBtn');
    
    if (form) form.reset();
    if (successMessage) successMessage.style.display = 'none';
    if (errorMessage) errorMessage.style.display = 'none';
    if (emailError) emailError.style.display = 'none';
    if (submitBtn) {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
    
    // Remove error classes from inputs
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => input.classList.remove('error'));
}

// Show error message
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.style.display = 'block';
        errorMessage.querySelector('p').textContent = message;
    }
}

// Show success message
function showSuccess() {
    const successMessage = document.getElementById('successMessage');
    const form = document.getElementById('contactForm');
    if (successMessage) {
        successMessage.style.display = 'block';
    }
    if (form) {
        form.style.display = 'none';
    }
}

// GraphQL mutation for creating feedback
async function createFeedback(comment, topic, email) {
    const mutation = `
        mutation createFeedback($comment: String!, $topic: String, $email: String) {
            createFeedback(data: { comment: $comment, topic: $topic, email: $email }) {
                comment
                topic
            }
        }
    `;

    const variables = {
        comment: comment,
        topic: topic || null, // Handle optional topic
        email: email
    };

    try {
        const response = await fetch(GRAPHQL_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: mutation,
                variables: variables
            })
        });

        const result = await response.json();
        
        if (result.errors) {
            throw new Error(result.errors[0].message);
        }
        
        return result.data;
    } catch (error) {
        console.error('GraphQL Error:', error);
        throw error;
    }
}

// Handle form submission
async function handleContactFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const title = formData.get('title').trim();
    const email = formData.get('email').trim();
    const description = formData.get('description').trim();
    
    // Validate required fields
    if (!title || !email || !description) {
        showError('Wszystkie pola są wymagane.');
        return;
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
        const emailInput = document.getElementById('contactEmail');
        const emailError = document.getElementById('emailError');
        if (emailInput) emailInput.classList.add('error');
        if (emailError) emailError.style.display = 'block';
        return;
    }
    
    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    }
    
    try {
        // Send feedback via GraphQL
        await createFeedback(description, title, email);
        
        // Show success message
        showSuccess();
        
        // Auto-close modal after 3 seconds
        setTimeout(() => {
            closeContactModal();
        }, 3000);
        
    } catch (error) {
        console.error('Error sending feedback:', error);
        showError('Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.');
        
        // Reset button state
        if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }
}

// ===== DEMO MODAL FUNCTIONALITY =====

// Demo modal functions
function openDemoModal() {
    const modal = document.getElementById('demoModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeDemoModal() {
    const modal = document.getElementById('demoModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        resetDemoForm();
    }
}

// Reset demo form to initial state
function resetDemoForm() {
    const form = document.getElementById('demoForm');
    const successMessage = document.getElementById('demoSuccessMessage');
    const errorMessage = document.getElementById('demoErrorMessage');
    const emailError = document.getElementById('demoEmailError');
    const submitBtn = document.getElementById('demoSubmitBtn');
    
    if (form) form.reset();
    if (successMessage) successMessage.style.display = 'none';
    if (errorMessage) errorMessage.style.display = 'none';
    if (emailError) emailError.style.display = 'none';
    if (submitBtn) {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
    
    // Remove error classes from inputs
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => input.classList.remove('error'));
}

// Show demo error message
function showDemoError(message) {
    const errorMessage = document.getElementById('demoErrorMessage');
    if (errorMessage) {
        errorMessage.style.display = 'block';
        errorMessage.querySelector('p').textContent = message;
    }
}

// Show demo success message
function showDemoSuccess() {
    const successMessage = document.getElementById('demoSuccessMessage');
    const form = document.getElementById('demoForm');
    if (successMessage) {
        successMessage.style.display = 'block';
    }
    if (form) {
        form.style.display = 'none';
    }
}

// Handle demo form submission
async function handleDemoFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const email = formData.get('email').trim();
    const description = formData.get('description').trim();
    
    // Validate required fields
    if (!email) {
        showDemoError('Email jest wymagany.');
        return;
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
        const emailInput = document.getElementById('demoEmail');
        const emailError = document.getElementById('demoEmailError');
        if (emailInput) emailInput.classList.add('error');
        if (emailError) emailError.style.display = 'block';
        return;
    }
    
    // Show loading state
    const submitBtn = document.getElementById('demoSubmitBtn');
    if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    }
    
    try {
        // Send demo request via GraphQL with "DEMO" as topic
        await createFeedback(description || 'Zgłoszenie na prezentację DEMO', 'DEMO', email);
        
        // Show success message
        showDemoSuccess();
        
        // Auto-close modal after 3 seconds
        setTimeout(() => {
            closeDemoModal();
        }, 3000);
        
    } catch (error) {
        console.error('Error sending demo request:', error);
        showDemoError('Wystąpił błąd podczas wysyłania zgłoszenia. Spróbuj ponownie.');
        
        // Reset button state
        if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }
}

// Initialize contact modal functionality
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const contactModal = document.getElementById('contactModal');
    const demoForm = document.getElementById('demoForm');
    const demoModal = document.getElementById('demoModal');
    
    // Add form submit handlers
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
    
    if (demoForm) {
        demoForm.addEventListener('submit', handleDemoFormSubmit);
    }
    
    // Close modals when clicking outside
    if (contactModal) {
        contactModal.addEventListener('click', (event) => {
            if (event.target === contactModal) {
                closeContactModal();
            }
        });
    }
    
    if (demoModal) {
        demoModal.addEventListener('click', (event) => {
            if (event.target === demoModal) {
                closeDemoModal();
            }
        });
    }
    
    // Close modals with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeContactModal();
            closeDemoModal();
        }
    });
    
    // Real-time email validation for contact form
    const contactEmailInput = document.getElementById('contactEmail');
    const contactEmailError = document.getElementById('emailError');
    
    if (contactEmailInput && contactEmailError) {
        contactEmailInput.addEventListener('input', () => {
            const email = contactEmailInput.value.trim();
            if (email && !isValidEmail(email)) {
                contactEmailInput.classList.add('error');
                contactEmailError.style.display = 'block';
            } else {
                contactEmailInput.classList.remove('error');
                contactEmailError.style.display = 'none';
            }
        });
    }
    
    // Real-time email validation for demo form
    const demoEmailInput = document.getElementById('demoEmail');
    const demoEmailError = document.getElementById('demoEmailError');
    
    if (demoEmailInput && demoEmailError) {
        demoEmailInput.addEventListener('input', () => {
            const email = demoEmailInput.value.trim();
            if (email && !isValidEmail(email)) {
                demoEmailInput.classList.add('error');
                demoEmailError.style.display = 'block';
            } else {
                demoEmailInput.classList.remove('error');
                demoEmailError.style.display = 'none';
            }
        });
    }
});

// ===== COOKIE BANNER FUNCTIONALITY =====

// Cookie banner functions
function showCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    if (banner) {
        banner.classList.add('show');
    }
}

function hideCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    if (banner) {
        banner.classList.remove('show');
    }
}

function acceptCookies() {
    // Save acceptance to localStorage
    localStorage.setItem('cookiesAccepted', 'true');
    localStorage.setItem('cookiesAcceptedDate', new Date().toISOString());
    
    // Hide the banner
    hideCookieBanner();
    
    // Here you can initialize analytics or other tracking scripts
    console.log('Cookies accepted - analytics can be initialized');
}

function rejectCookies() {
    
    // Redirect to Google.pl
    window.location.href = 'https://www.google.pl';
}

function checkCookieConsent() {
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    
    // If no decision has been made, show the banner
    if (cookiesAccepted === null) {
        showCookieBanner();
    }
}

// Initialize cookie banner functionality
document.addEventListener('DOMContentLoaded', () => {
    // Check if user has already made a decision about cookies
    checkCookieConsent();
    
    // Add event listeners for cookie banner buttons
    const acceptBtn = document.getElementById('acceptCookies');
    const rejectBtn = document.getElementById('rejectCookies');
    
    if (acceptBtn) {
        acceptBtn.addEventListener('click', acceptCookies);
    }
    
    if (rejectBtn) {
        rejectBtn.addEventListener('click', rejectCookies);
    }
    
    // Auto-open Early Access modal on page load
    // Add a small delay to ensure page is fully loaded
    // setTimeout(() => {
    //     openEarlyAccessModal();
    // }, 1500); // 1.5 second delay after page load
});


// ======== EARLY ACCESS MODAL FUNCTIONALITY ========
document.addEventListener('DOMContentLoaded', () => {
    const minimizedBanner = document.getElementById('earlyAccessMinimized');
    
    if (minimizedBanner) {
        // Ukryj baner na starcie
        minimizedBanner.classList.remove('show');
        document.body.classList.remove('banner-visible');
        
        // Pokaż baner po scrollowaniu 300px
        window.addEventListener('scroll', () => {
            if (window.scrollY > 0) {
                if (!minimizedBanner.classList.contains('show')) {
                    minimizedBanner.classList.add('show');
                    document.body.classList.add('banner-visible');
                }
            } else {
                minimizedBanner.classList.remove('show');
                document.body.classList.remove('banner-visible');
            }
        }, { passive: true });
    }
});

// Global functions for Early Access modal
// function openEarlyAccessModal() {
//     const modal = document.getElementById('earlyAccessModal');
//     const minimized = document.getElementById('earlyAccessMinimized');
    
//     if (modal) {
//         modal.style.display = 'flex';
//         document.body.style.overflow = 'hidden';
//     }
    
//     if (minimized) {
//         minimized.classList.remove('show');
//         setTimeout(() => {
//             minimized.style.display = 'none';
//         }, 300);
//     }
// }

// function closeEarlyAccessModal() {
//     const modal = document.getElementById('earlyAccessModal');
    
//     if (modal) {
//         modal.style.display = 'none';
//         document.body.style.overflow = '';
//     }
// }

// function minimizeEarlyAccessModal() {
//     const modal = document.getElementById('earlyAccessModal');
//     const minimized = document.getElementById('earlyAccessMinimized');
    
//     // Close the modal
//     if (modal) {
//         modal.style.display = 'none';
//         document.body.style.overflow = '';
//     }
    
//     // Show minimized banner
//     if (minimized) {
//         minimized.style.display = 'block';
//         setTimeout(() => {
//             minimized.classList.add('show');
//             // Add pulsing animation after the initial animation completes
//             setTimeout(() => {
//                 minimized.classList.add('pulsing');
//             }, 1000); // 1 second delay to match slideInAndPulse duration
//         }, 50);
//     }
// }

// function closeEarlyAccessMinimized() {
//     const minimized = document.getElementById('earlyAccessMinimized');
    
//     if (minimized) {
//         minimized.classList.remove('show');
//         setTimeout(() => {
//             minimized.style.display = 'none';
//         }, 300);
//     }
// }

// Early Access form submission
document.addEventListener('DOMContentLoaded', () => {
    const earlyAccessForm = document.getElementById('earlyAccessForm');
    const submitBtn = document.getElementById('earlyAccessSubmitBtn');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnSpinner = submitBtn?.querySelector('.btn-spinner');
    const successMessage = document.getElementById('earlyAccessSuccessMessage');
    const errorMessage = document.getElementById('earlyAccessErrorMessage');
    const emailError = document.getElementById('earlyAccessEmailError');

    if (earlyAccessForm) {
        earlyAccessForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(earlyAccessForm);
            const email = formData.get('email');
            const description = formData.get('description');
            
            // Validate email
            if (!isValidEmail(email)) {
                if (emailError) {
                    emailError.style.display = 'block';
                }
                return;
            } else {
                if (emailError) {
                    emailError.style.display = 'none';
                }
            }
            
            // Show loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                if (btnText) btnText.style.display = 'none';
                if (btnSpinner) btnSpinner.style.display = 'inline';
            }
            
            // Hide previous messages
            if (successMessage) successMessage.style.display = 'none';
            if (errorMessage) errorMessage.style.display = 'none';
            
            try {
                await createFeedback(description || 'Zgłoszenie na Early Access', 'Early Access', email);

                // Show success message
                if (successMessage) {
                    successMessage.style.display = 'block';
                }
                
                // Reset form
                earlyAccessForm.reset();
                
                // Close modal after 2 seconds
                setTimeout(() => {
                    closeEarlyAccessModal();
                    closeEarlyAccessMinimized();
                }, 2000);
                
            } catch (error) {
                console.error('Error submitting early access form:', error);
                
                // Show error message
                if (errorMessage) {
                    errorMessage.style.display = 'block';
                }
            } finally {
                // Reset button state
                if (submitBtn) {
                    submitBtn.disabled = false;
                    if (btnText) btnText.style.display = 'inline';
                    if (btnSpinner) btnSpinner.style.display = 'none';
                }
            }
        });
    }
});

// Helper function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to copy promo code to clipboard
function copyPromoCode() {
    const promoCodeElement = document.getElementById('promoCode');
    const promoCodeText = promoCodeElement.textContent;
    const copyButton = document.querySelector('.promo-code-copy');
    
    // Use the Clipboard API
    navigator.clipboard.writeText(promoCodeText).then(() => {
        // Change button text temporarily
        const originalText = copyButton.textContent;
        copyButton.textContent = 'Skopiowano!';
        copyButton.style.color = '#16A34A'; // Green color
        
        // Reset after 2 seconds
        setTimeout(() => {
            copyButton.textContent = originalText;
            copyButton.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Błąd podczas kopiowania:', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = promoCodeText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            const originalText = copyButton.textContent;
            copyButton.textContent = 'Skopiowano!';
            copyButton.style.color = '#16A34A';
            setTimeout(() => {
                copyButton.textContent = originalText;
                copyButton.style.color = '';
            }, 2000);
        } catch (err) {
            console.error('Fallback: Błąd podczas kopiowania:', err);
        }
        document.body.removeChild(textArea);
    });
}

function toggleCard(card) {
        // Opcjonalnie: Zamknij inne karty przy otwarciu nowej (tzw. Accordion mode)
        // Jeśli chcesz, żeby można było mieć otwarte wszystkie naraz, usuń pętlę poniżej.
        const allCards = document.querySelectorAll('.expand-card');
        allCards.forEach(c => {
            if (c !== card) c.classList.remove('active');
        });

        // Przełącz klasę active na klikniętej karcie
        card.classList.toggle('active');
    }