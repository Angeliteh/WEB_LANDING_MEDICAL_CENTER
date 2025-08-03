/**
 * Cookie Consent Management System
 * Centro Médico - GDPR Compliant Cookie Banner
 */

class CookieConsent {
    constructor() {
        this.cookieName = 'medic_care_consent';
        this.cookieExpiry = 365; // días
        this.banner = null;
        this.modal = null;
        
        this.init();
    }

    init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.banner = document.getElementById('cookieBanner');
        this.modal = document.getElementById('cookieModal');
        
        // Verificar si ya hay consentimiento
        const consent = this.getConsent();
        if (!consent) {
            this.showBanner();
        } else {
            // Aplicar configuración guardada
            this.applyConsent(consent);
        }

        // Solo log en desarrollo
        if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
            console.log('🍪 Cookie Consent System initialized');
        }
    }

    showBanner() {
        if (this.banner) {
            setTimeout(() => {
                this.banner.classList.add('show');
            }, 1000); // Mostrar después de 1 segundo
        }
    }

    hideBanner() {
        if (this.banner) {
            this.banner.classList.remove('show');
        }
    }

    getConsent() {
        try {
            const consent = localStorage.getItem(this.cookieName);
            return consent ? JSON.parse(consent) : null;
        } catch (e) {
            // Fallback a cookies si localStorage no está disponible
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === this.cookieName) {
                    try {
                        return JSON.parse(decodeURIComponent(value));
                    } catch (parseError) {
                        return null;
                    }
                }
            }
            return null;
        }
    }

    setConsent(consent) {
        const consentData = {
            ...consent,
            timestamp: new Date().toISOString(),
            version: '1.0'
        };

        try {
            localStorage.setItem(this.cookieName, JSON.stringify(consentData));
        } catch (e) {
            // Fallback a cookies
            const expires = new Date();
            expires.setDate(expires.getDate() + this.cookieExpiry);
            document.cookie = `${this.cookieName}=${encodeURIComponent(JSON.stringify(consentData))}; expires=${expires.toUTCString()}; path=/`;
        }

        this.applyConsent(consentData);
    }

    applyConsent(consent) {
        // Controlar Google Analytics basado en consentimiento
        if (consent.analytics && typeof gtag !== 'undefined') {
            // Habilitar Google Analytics
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
            // Solo log en desarrollo
            if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
                console.log('📊 Google Analytics enabled by user consent');
            }
        } else if (typeof gtag !== 'undefined') {
            // Deshabilitar Google Analytics
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
            // Solo log en desarrollo
            if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
                console.log('📊 Google Analytics disabled by user choice');
            }
        }

        // Aquí se pueden agregar más controles para otras cookies/servicios
        if (consent.marketing) {
            // Solo log en desarrollo
            if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
                console.log('🎯 Marketing cookies enabled');
            }
            // Habilitar cookies de marketing
        } else {
            // Solo log en desarrollo
            if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
                console.log('🎯 Marketing cookies disabled');
            }
            // Deshabilitar cookies de marketing
        }
    }
}

// Funciones globales para los botones del banner
function acceptCookies() {
    const consent = {
        essential: true,
        analytics: true,
        marketing: true
    };
    
    window.cookieConsent.setConsent(consent);
    window.cookieConsent.hideBanner();
    
    // Mostrar mensaje de confirmación
    showCookieMessage('✅ Todas las cookies han sido aceptadas. Gracias por ayudarnos a mejorar su experiencia.');
}

function acceptEssentialOnly() {
    const consent = {
        essential: true,
        analytics: false,
        marketing: false
    };
    
    window.cookieConsent.setConsent(consent);
    window.cookieConsent.hideBanner();
    
    showCookieMessage('⚙️ Solo las cookies esenciales han sido activadas.');
}

function showCookieSettings() {
    const modal = document.getElementById('cookieModal');
    if (modal) {
        modal.classList.add('show');
        
        // Cargar configuración actual
        const consent = window.cookieConsent.getConsent();
        if (consent) {
            document.getElementById('analyticsCookies').checked = consent.analytics || false;
            document.getElementById('marketingCookies').checked = consent.marketing || false;
        }
    }
}

function closeCookieSettings() {
    const modal = document.getElementById('cookieModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function saveCookiePreferences() {
    const consent = {
        essential: true, // Siempre true
        analytics: document.getElementById('analyticsCookies').checked,
        marketing: document.getElementById('marketingCookies').checked
    };
    
    window.cookieConsent.setConsent(consent);
    window.cookieConsent.hideBanner();
    closeCookieSettings();
    
    showCookieMessage('💾 Sus preferencias de cookies han sido guardadas correctamente.');
}

function showCookieMessage(message) {
    // Crear mensaje temporal
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent-color);
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10001;
        max-width: 300px;
        font-size: 14px;
        line-height: 1.4;
        animation: slideInRight 0.3s ease-out;
    `;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 4000);
}

// Cerrar modal al hacer clic fuera
document.addEventListener('click', function(event) {
    const modal = document.getElementById('cookieModal');
    if (modal && event.target === modal) {
        closeCookieSettings();
    }
});

// Inicializar el sistema de cookies
window.cookieConsent = new CookieConsent();

// Agregar estilos para las animaciones de mensajes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);
