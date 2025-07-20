// Gestor de idiomas para Medic Care Template
// Maneja el cambio de idioma y aplicación de traducciones

class LanguageManager {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || 'es';
        this.translations = translations;
        this.init();
    }

    init() {
        this.createLanguageSelector();
        this.applyTranslations();
        this.bindEvents();
    }

    // Crear selector de idioma en la navbar
    createLanguageSelector() {
        const navbar = document.querySelector('.navbar-nav');
        if (!navbar) return;

        // Crear elemento del selector de idioma
        const languageSelector = document.createElement('li');
        languageSelector.className = 'nav-item dropdown ms-3';
        languageSelector.innerHTML = `
            <a class="nav-link dropdown-toggle" href="#" id="languageDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi-globe"></i> ${this.currentLanguage.toUpperCase()}
            </a>
            <ul class="dropdown-menu" aria-labelledby="languageDropdown">
                <li><a class="dropdown-item" href="#" data-lang="es"><i class="bi-flag"></i> Español</a></li>
                <li><a class="dropdown-item" href="#" data-lang="en"><i class="bi-flag"></i> English</a></li>
            </ul>
        `;

        // Insertar después del último elemento de navegación
        navbar.appendChild(languageSelector);
    }

    // Obtener idioma almacenado en localStorage (with fallback)
    getStoredLanguage() {
        try {
            return localStorage.getItem('medicCareLanguage');
        } catch (e) {
            // Fallback: leer de cookie
            try {
                const cookies = document.cookie.split(';');
                for (let cookie of cookies) {
                    const [name, value] = cookie.trim().split('=');
                    if (name === 'medicCareLanguage') {
                        return value;
                    }
                }
            } catch (cookieError) {
                // Silently fail
            }
            return null;
        }
    }

    // Guardar idioma en localStorage (with fallback)
    setStoredLanguage(lang) {
        try {
            localStorage.setItem('medicCareLanguage', lang);
        } catch (e) {
            // Fallback: usar cookie
            try {
                document.cookie = `medicCareLanguage=${lang}; path=/; max-age=31536000`;
            } catch (cookieError) {
                // Silently fail
            }
        }
    }

    // Cambiar idioma
    changeLanguage(newLanguage) {
        if (this.translations[newLanguage]) {
            this.currentLanguage = newLanguage;
            this.setStoredLanguage(newLanguage);
            this.applyTranslations();
            this.updateLanguageSelector();
        }
    }

    // Actualizar el selector de idioma
    updateLanguageSelector() {
        const selector = document.querySelector('#languageDropdown');
        if (selector) {
            selector.innerHTML = `<i class="bi-globe"></i> ${this.currentLanguage.toUpperCase()}`;
        }
    }

    // Aplicar traducciones a toda la página
    applyTranslations() {
        const t = this.translations[this.currentLanguage];
        if (!t) return;

        // Meta tags y título
        document.title = t.title;
        this.updateMetaTag('description', t.metaDescription);
        this.updateLangAttribute();

        // Navegación
        this.updateNavigation(t.nav);

        // Marca/Brand
        this.updateBrand(t.brand);

        // Hero section
        this.updateHeroSection(t.hero);

        // About section
        this.updateAboutSection(t.about);

        // Timeline/Services section
        this.updateTimelineSection(t.timeline);

        // Reviews section
        this.updateReviewsSection(t.reviews);

        // Booking section
        this.updateBookingSection(t.booking);

        // Contact section
        this.updateContactSection(t.contact);

        // Footer
        this.updateFooterSection(t.footer);

        // Dark mode (if available)
        this.updateDarkModeTranslations(t.darkMode);

        // Trigger language change event
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLanguage }
        }));
    }

    // Actualizar meta tag
    updateMetaTag(name, content) {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = name;
            document.head.appendChild(meta);
        }
        meta.content = content;
    }

    // Actualizar atributo lang del HTML
    updateLangAttribute() {
        document.documentElement.lang = this.currentLanguage;
    }

    // Actualizar navegación
    updateNavigation(navTranslations) {
        const navLinks = {
            '#hero': navTranslations.home,
            '#about': navTranslations.about,
            '#timeline': navTranslations.timeline,
            '#reviews': navTranslations.testimonials,
            '#booking': navTranslations.booking,
            '#contact': navTranslations.contact
        };

        Object.entries(navLinks).forEach(([href, text]) => {
            const link = document.querySelector(`a.nav-link[href="${href}"]`);
            if (link) link.textContent = text;
        });
    }

    // Actualizar marca
    updateBrand(brandTranslations) {
        const brandElements = document.querySelectorAll('.navbar-brand');
        brandElements.forEach(brand => {
            const nameElement = brand.childNodes[0];
            const subtitleElement = brand.querySelector('strong');
            
            if (nameElement && nameElement.nodeType === Node.TEXT_NODE) {
                nameElement.textContent = brandTranslations.name + '\n                                ';
            }
            if (subtitleElement) {
                subtitleElement.textContent = brandTranslations.subtitle;
            }
        });
    }

    // Actualizar sección hero
    updateHeroSection(heroTranslations) {
        // Título principal - usar el span con data-translate
        const mainTitleSpan = document.querySelector('[data-translate="hero.title"]');
        if (mainTitleSpan) {
            mainTitleSpan.textContent = heroTranslations.title;
        }

        // Items animados - actualizar y reiniciar animación
        const animatedItems = document.querySelectorAll('.animated-item');
        animatedItems.forEach((item, index) => {
            if (heroTranslations.animatedItems[index]) {
                item.textContent = heroTranslations.animatedItems[index];
            }
        });

        // Reiniciar animación de texto
        this.restartTextAnimation();

        // Descripción
        const description = document.querySelector('.heroText p');
        if (description) {
            description.textContent = heroTranslations.description;
        }

        // Botón "Learn More"
        const learnMoreBtn = document.querySelector('.custom-link');
        if (learnMoreBtn) {
            learnMoreBtn.textContent = heroTranslations.learnMore;
            learnMoreBtn.setAttribute('data-hover', heroTranslations.learnMore);
        }
    }

    // Actualizar sección about
    updateAboutSection(aboutTranslations) {
        const aboutSection = document.querySelector('#about');
        if (!aboutSection) return;

        // Título
        const title = aboutSection.querySelector('h2');
        if (title) title.textContent = aboutTranslations.title;

        // Párrafos
        const paragraphs = aboutSection.querySelectorAll('p');
        if (paragraphs[0]) paragraphs[0].textContent = aboutTranslations.description1;
        if (paragraphs[1]) paragraphs[1].textContent = aboutTranslations.description2;

        // Texto de experiencia
        const experienceText = aboutSection.querySelector('.featured-text');
        if (experienceText) {
            experienceText.innerHTML = `<span class="featured-number">12</span> ${aboutTranslations.experience}`;
        }
    }

    // Actualizar sección timeline/servicios
    updateTimelineSection(timelineTranslations) {
        const timelineSection = document.querySelector('#timeline');
        if (!timelineSection) return;

        // Título principal
        const title = timelineSection.querySelector('h2');
        if (title) title.textContent = timelineTranslations.title;

        // Servicios individuales
        const serviceNodes = timelineSection.querySelectorAll('.timeline-nodes');
        serviceNodes.forEach((node, index) => {
            if (timelineTranslations.services[index]) {
                const service = timelineTranslations.services[index];
                
                const titleElement = node.querySelector('h3');
                const descElement = node.querySelector('p');
                const dateElement = node.querySelector('time');
                
                if (titleElement) titleElement.textContent = service.title;
                if (descElement) descElement.textContent = service.description;
                if (dateElement) dateElement.textContent = service.date;
            }
        });
    }

    // Actualizar sección de reseñas
    updateReviewsSection(reviewsTranslations) {
        const reviewsSection = document.querySelector('#reviews');
        if (!reviewsSection) return;

        // Título principal
        const title = reviewsSection.querySelector('h2');
        if (title) title.textContent = reviewsTranslations.title;

        // Testimonios individuales
        const testimonials = reviewsSection.querySelectorAll('.reviews-thumb');
        testimonials.forEach((testimonial, index) => {
            if (reviewsTranslations.testimonials[index]) {
                const review = reviewsTranslations.testimonials[index];
                
                const titleElement = testimonial.querySelector('p strong');
                const textElement = testimonial.querySelector('.reviews-text');
                const nameElement = testimonial.querySelector('figcaption strong');
                const roleElement = testimonial.querySelector('figcaption .text-muted');
                
                if (titleElement) titleElement.textContent = review.title;
                if (textElement) textElement.textContent = review.text;
                if (nameElement) nameElement.textContent = review.name;
                if (roleElement) roleElement.textContent = review.role;
            }
        });
    }

    // Actualizar sección de reservas
    updateBookingSection(bookingTranslations) {
        const bookingSection = document.querySelector('#booking');
        if (!bookingSection) return;

        // Título
        const title = bookingSection.querySelector('h2');
        if (title) title.textContent = bookingTranslations.title;

        // Campos del formulario
        const form = bookingTranslations.form;
        const nameInput = bookingSection.querySelector('#name');
        const emailInput = bookingSection.querySelector('#email');
        const phoneInput = bookingSection.querySelector('#phone');
        const messageInput = bookingSection.querySelector('#message');
        const submitBtn = bookingSection.querySelector('#submit-button');

        if (nameInput) nameInput.placeholder = form.fullName;
        if (emailInput) emailInput.placeholder = form.email;
        if (phoneInput) phoneInput.placeholder = form.phone;
        if (messageInput) messageInput.placeholder = form.message;
        if (submitBtn) submitBtn.textContent = form.submit;
    }

    // Actualizar footer
    updateFooterSection(footerTranslations) {
        if (!footerTranslations) return;

        // Horarios
        if (footerTranslations.hours) {
            this.updateElement('[data-translate="footer.hours.title"]', footerTranslations.hours.title);
            this.updateElement('[data-translate="footer.hours.sunday"]', footerTranslations.hours.sunday);
            this.updateElement('[data-translate="footer.hours.weekdays"]', footerTranslations.hours.weekdays);
            this.updateElement('[data-translate="footer.hours.weekdaysTime"]', footerTranslations.hours.weekdaysTime);
            this.updateElement('[data-translate="footer.hours.saturday"]', footerTranslations.hours.saturday);
            this.updateElement('[data-translate="footer.hours.saturdayTime"]', footerTranslations.hours.saturdayTime);
        }

        // Información de la clínica
        if (footerTranslations.clinic) {
            this.updateElement('[data-translate="footer.clinic.title"]', footerTranslations.clinic.title);
            this.updateElement('[data-translate="footer.clinic.email"]', footerTranslations.clinic.email);
            this.updateElement('[data-translate="footer.clinic.address"]', footerTranslations.clinic.address);
        }

        // Redes sociales
        if (footerTranslations.social) {
            this.updateElement('[data-translate="footer.social.title"]', footerTranslations.social.title);
        }

        // Copyright
        if (footerTranslations.copyright) {
            const copyrightElement = document.querySelector('[data-translate="footer.copyright"]');
            if (copyrightElement) {
                copyrightElement.innerHTML = `${footerTranslations.copyright}<br><br>Design: <a href="https://templatemo.com" target="_parent">TemplateMo</a>`;
            }
        }
    }

    // Actualizar traducciones del modo oscuro
    updateDarkModeTranslations(darkModeTranslations) {
        if (!darkModeTranslations || !window.darkModeManager) return;

        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            const isDark = window.darkModeManager.isDarkMode();
            const label = isDark ? darkModeTranslations.switchToLight : darkModeTranslations.switchToDark;

            themeToggle.setAttribute('aria-label', label);
            themeToggle.setAttribute('title', label);

            const themeText = themeToggle.querySelector('.d-none');
            if (themeText) {
                themeText.textContent = darkModeTranslations.theme;
            }
        }
    }

    // Vincular eventos
    bindEvents() {
        // Event delegation para los enlaces de idioma
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-lang]') || e.target.closest('[data-lang]')) {
                e.preventDefault();
                const langElement = e.target.matches('[data-lang]') ? e.target : e.target.closest('[data-lang]');
                const newLang = langElement.getAttribute('data-lang');
                this.changeLanguage(newLang);
            }
        });
    }

    // Método para reiniciar la animación de texto
    restartTextAnimation() {
        const animatedInfo = document.querySelector('.animated-info');
        if (animatedInfo) {
            const items = animatedInfo.querySelectorAll('.animated-item');

            // Reiniciar cada item individualmente
            items.forEach((item, index) => {
                // Remover animación
                item.style.animation = 'none';
                item.offsetHeight; // Trigger reflow

                // Restaurar animación con delay correcto (secuencial)
                item.style.animation = 'BottomTotop 9s linear infinite';
                item.style.animationDelay = `${index * 3}s`;
            });

            console.log('🔄 Text animation restarted');
        }
    }

    // Método auxiliar para actualizar elementos por selector
    updateElement(selector, text) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = text;
        }
    }

    // Actualizar sección de contacto
    updateContactSection(contactTranslations) {
        if (!contactTranslations) return;

        // Título principal de contacto
        this.updateElement('[data-translate="contact.title"]', contactTranslations.title);

        // Información de contacto
        if (contactTranslations.info) {
            this.updateElement('[data-translate="contact.info.title"]', contactTranslations.info.title);
        }

        // Dirección
        if (contactTranslations.address) {
            this.updateElement('[data-translate="contact.address.label"]', contactTranslations.address.label);
            this.updateElement('[data-translate="contact.address.full"]', contactTranslations.address.full);
        }

        // Teléfono
        if (contactTranslations.phone) {
            this.updateElement('[data-translate="contact.phone.label"]', contactTranslations.phone.label);
            this.updateElement('[data-translate="contact.phone.number"]', contactTranslations.phone.number);
        }

        // Email
        if (contactTranslations.email) {
            this.updateElement('[data-translate="contact.email.label"]', contactTranslations.email.label);
            this.updateElement('[data-translate="contact.email.address"]', contactTranslations.email.address);
        }

        // Horarios
        if (contactTranslations.hours) {
            this.updateElement('[data-translate="contact.hours.label"]', contactTranslations.hours.label);
            this.updateElement('[data-translate="contact.hours.weekdays"]', contactTranslations.hours.weekdays);
            this.updateElement('[data-translate="contact.hours.saturday"]', contactTranslations.hours.saturday);
            this.updateElement('[data-translate="contact.hours.sunday"]', contactTranslations.hours.sunday);
        }

        // Mapa
        if (contactTranslations.map) {
            this.updateElement('[data-translate="contact.map.title"]', contactTranslations.map.title);
        }
    }
}

// Inicializar el gestor de idiomas cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.languageManager = new LanguageManager();
});
