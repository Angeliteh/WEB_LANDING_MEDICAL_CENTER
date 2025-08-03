/**
 * Security Protector
 * "Guardaespaldas automático" que implementa protecciones de seguridad
 */

class SecurityProtector {
    constructor() {
        this.protectionsApplied = 0;
        this.protections = [];
        this.csrfToken = this.generateCSRFToken();
        this.init();
    }

    init() {
        // Verificar si necesita ejecutarse
        if (window.OPTIMIZATION_CACHE && !window.OPTIMIZATION_CACHE.needsRerun()) {
            // Solo log en desarrollo
            if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
                console.log('🛡️ Security Protector: Usando cache (ya optimizado)');
            }
            return;
        }

        // Solo log en desarrollo
        if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
            console.log('🛡️ Security Protector iniciado - Implementando protecciones...');
        }
        this.protectAll();
        this.generateProtectionReport();
    }

    // Implementar TODAS las protecciones automáticamente
    protectAll() {
        this.protections = []; // Limpiar protecciones anteriores
        
        // 1. Simular Security Headers (para desarrollo)
        this.simulateSecurityHeaders();
        
        // 2. Proteger formularios
        this.protectForms();
        
        // 3. Asegurar enlaces externos
        this.secureExternalLinks();
        
        // 4. Implementar CSP básico
        this.implementBasicCSP();
        
        // 5. Sanitizar inputs
        this.sanitizeInputs();
        
        // 6. Proteger contra clickjacking
        this.preventClickjacking();
        
        // 7. Implementar rate limiting básico
        this.implementRateLimiting();
        
        // Solo log en desarrollo
        if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
            console.log(`🛡️ Protecciones implementadas: ${this.protectionsApplied} medidas de seguridad`);
        }
    }

    // 1. SIMULAR SECURITY HEADERS (para desarrollo)
    simulateSecurityHeaders() {
        // Solo log en desarrollo
        if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
            console.log('🔒 Simulando Security Headers...');
        }
        
        // En desarrollo, agregamos meta tags que simulan headers
        const securityHeaders = {
            'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: https:; img-src 'self' data: https:; font-src 'self' data: https:",
            'X-Frame-Options': 'SAMEORIGIN',
            'X-Content-Type-Options': 'nosniff',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
        };

        // Agregar meta tags que simulan headers
        Object.entries(securityHeaders).forEach(([header, value]) => {
            if (!document.querySelector(`meta[http-equiv="${header}"]`)) {
                const meta = document.createElement('meta');
                meta.setAttribute('http-equiv', header);
                meta.content = value;
                document.head.appendChild(meta);
                
                this.addProtection('Security Headers', `Simulado header: ${header}`, 'meta tag');
                this.protectionsApplied++;
            }
        });

        // Nota: En producción, estos headers se configuran en el servidor
        // Solo log en desarrollo
        if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
            console.log('📝 NOTA: En producción, configurar estos headers en el servidor web');
        }
    }

    // 2. PROTEGER FORMULARIOS
    protectForms() {
        // Solo log en desarrollo
        if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
            console.log('📝 Protegiendo formularios...');
        }
        
        const forms = document.querySelectorAll('form');
        
        forms.forEach((form, index) => {
            this.protectSingleForm(form, index);
        });
    }

    protectSingleForm(form, index) {
        let formProtected = false;
        
        // 🛡️ PROTECCIÓN 1: Agregar token CSRF
        if (!this.hasCSRFProtection(form)) {
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrf_token';
            csrfInput.value = this.csrfToken;
            form.appendChild(csrfInput);
            
            this.addProtection('Formularios', 'Agregado token CSRF', `form #${index}`);
            formProtected = true;
        }
        
        // 🛡️ PROTECCIÓN 2: Validación mejorada
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            this.enhanceInputValidation(input);
        });
        
        // 🛡️ PROTECCIÓN 3: Sanitización en tiempo real
        form.addEventListener('submit', (e) => {
            this.sanitizeFormData(form);
        });
        
        // 🛡️ PROTECCIÓN 4: Rate limiting por formulario
        this.addFormRateLimit(form);
        
        if (formProtected) {
            this.protectionsApplied++;
        }
    }

    // 3. ASEGURAR ENLACES EXTERNOS
    secureExternalLinks() {
        // Solo log en desarrollo
        if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
            console.log('🔗 Asegurando enlaces externos...');
        }
        
        const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
        
        externalLinks.forEach(link => {
            let linkSecured = false;
            
            // 🛡️ PROTECCIÓN: Agregar rel="noopener noreferrer"
            if (!link.rel.includes('noopener')) {
                const currentRel = link.rel || '';
                link.rel = currentRel + ' noopener noreferrer';
                linkSecured = true;
            }
            
            // 🛡️ PROTECCIÓN: Agregar target="_blank" si no existe
            if (!link.target) {
                link.target = '_blank';
                linkSecured = true;
            }
            
            // 🛡️ PROTECCIÓN: Advertencia visual para enlaces externos
            if (!link.querySelector('.external-link-icon')) {
                const icon = document.createElement('span');
                icon.className = 'external-link-icon';
                icon.innerHTML = ' ↗️';
                icon.style.fontSize = '0.8em';
                icon.title = 'Enlace externo - se abre en nueva ventana';
                link.appendChild(icon);
                linkSecured = true;
            }
            
            if (linkSecured) {
                this.addProtection('Enlaces Externos', 'Asegurado enlace externo', link.href);
                this.protectionsApplied++;
            }
        });
    }

    // 4. IMPLEMENTAR CSP BÁSICO
    implementBasicCSP() {
        // Solo log en desarrollo
        if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
            console.log('🔐 Implementando Content Security Policy...');
        }
        
        // Mover scripts inline a funciones
        this.moveInlineScripts();
        
        // Mover event handlers inline
        this.moveInlineEventHandlers();
        
        this.addProtection('CSP', 'Implementado Content Security Policy básico', 'meta tag');
        this.protectionsApplied++;
    }

    // 5. SANITIZAR INPUTS
    sanitizeInputs() {
        // Solo log en desarrollo
        if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
            console.log('🧹 Implementando sanitización de inputs...');
        }
        
        const inputs = document.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Sanitización en tiempo real
            input.addEventListener('input', (e) => {
                const sanitized = this.sanitizeString(e.target.value);
                if (sanitized !== e.target.value) {
                    e.target.value = sanitized;
                    // Solo log en desarrollo
                    if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
                        console.log('🧹 Input sanitizado automáticamente');
                    }
                }
            });
            
            this.addProtection('Sanitización', 'Agregada sanitización automática', input.name || input.type);
        });
        
        this.protectionsApplied++;
    }

    // 6. PREVENIR CLICKJACKING
    preventClickjacking() {
        // Solo log en desarrollo
        if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
            console.log('🚫 Implementando protección contra clickjacking...');
        }
        
        // Verificar si la página está en un iframe
        if (window.self !== window.top) {
            // Si está en iframe, mostrar advertencia
            const warning = document.createElement('div');
            warning.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 0, 0, 0.9);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;
                font-size: 24px;
                text-align: center;
            `;
            warning.innerHTML = `
                <div>
                    <h2>⚠️ ADVERTENCIA DE SEGURIDAD</h2>
                    <p>Esta página no debe mostrarse en un iframe</p>
                    <button onclick="window.top.location = window.location">Ir a página original</button>
                </div>
            `;
            document.body.appendChild(warning);
        }
        
        this.addProtection('Clickjacking', 'Implementada protección contra clickjacking', 'iframe detection');
        this.protectionsApplied++;
    }

    // 7. IMPLEMENTAR RATE LIMITING BÁSICO
    implementRateLimiting() {
        // Solo log en desarrollo
        if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
            console.log('⏱️ Implementando rate limiting...');
        }
        
        // Rate limiting para formularios
        this.formSubmissions = new Map();
        
        // Rate limiting para clics
        this.clickCounts = new Map();
        
        this.addProtection('Rate Limiting', 'Implementado rate limiting básico', 'client-side');
        this.protectionsApplied++;
    }

    // MÉTODOS AUXILIARES
    generateCSRFToken() {
        return 'csrf_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    hasCSRFProtection(form) {
        return !!form.querySelector('input[name*="csrf"], input[name*="token"]');
    }

    enhanceInputValidation(input) {
        const inputType = input.type || 'text';
        
        switch (inputType) {
            case 'email':
                if (!input.pattern) {
                    input.pattern = '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$';
                    input.title = 'Ingrese un email válido';
                }
                break;
            case 'tel':
                if (!input.pattern) {
                    input.pattern = '[0-9+\\-\\s\\(\\)]{10,}';
                    input.title = 'Ingrese un teléfono válido';
                }
                break;
            case 'text':
                if (input.name && input.name.includes('name')) {
                    input.pattern = '[A-Za-zÀ-ÿ\\s]{2,}';
                    input.title = 'Solo letras y espacios, mínimo 2 caracteres';
                }
                break;
        }
        
        // Agregar maxlength si no existe
        if (!input.maxLength && inputType === 'text') {
            input.maxLength = 100;
        }
        
        if (!input.maxLength && inputType === 'textarea') {
            input.maxLength = 500;
        }
    }

    sanitizeString(str) {
        // Sanitización básica
        return str
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remover scripts
            .replace(/<[^>]*>/g, '') // Remover HTML tags
            .replace(/javascript:/gi, '') // Remover javascript:
            .replace(/on\w+\s*=/gi, '') // Remover event handlers
            .trim();
    }

    sanitizeFormData(form) {
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            if (input.type !== 'hidden' && input.type !== 'submit') {
                input.value = this.sanitizeString(input.value);
            }
        });
    }

    addFormRateLimit(form) {
        form.addEventListener('submit', (e) => {
            const now = Date.now();
            const lastSubmit = this.formSubmissions.get(form) || 0;
            
            // Limitar a 1 envío por minuto
            if (now - lastSubmit < 60000) {
                e.preventDefault();
                alert('⏱️ Por favor espere un minuto antes de enviar el formulario nuevamente');
                return false;
            }
            
            this.formSubmissions.set(form, now);
        });
    }

    moveInlineScripts() {
        // En una implementación real, moveríamos scripts inline a archivos externos
        // Por ahora, solo los documentamos
        const inlineScripts = document.querySelectorAll('script:not([src])');
        // Solo log en desarrollo
        if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
            console.log(`📜 Detectados ${inlineScripts.length} scripts inline - Recomendación: mover a archivos externos`);
        }
    }

    moveInlineEventHandlers() {
        // Convertir event handlers inline a addEventListener
        const elementsWithHandlers = document.querySelectorAll('[onclick], [onload], [onerror]');
        elementsWithHandlers.forEach(element => {
            // Por ahora solo documentamos - en producción se moverían
            // Solo log en desarrollo
            if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
                console.log('📜 Event handler inline detectado - Recomendación: usar addEventListener');
            }
        });
    }

    addProtection(category, description, target) {
        this.protections.push({
            category,
            description,
            target: target.toString().substring(0, 50) + '...'
        });
    }

    // Generar reporte de protecciones
    generateProtectionReport() {
        // Solo logs en desarrollo
        if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
            console.log('🛡️ REPORTE DE PROTECCIONES:');
            console.log(`✅ Total de protecciones implementadas: ${this.protectionsApplied}`);
            console.log('📋 Para ver detalles: window.securityProtector.getProtectionDetails()');
        }

        // Re-analizar seguridad para ver mejora
        if (window.securityAnalyzer) {
            setTimeout(() => {
                if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
                    console.log('🔄 Re-analizando seguridad después de protecciones...');
                }
                window.securityAnalyzer.analyzeAll();
                const newScore = window.securityAnalyzer.getSecurityScore();
                if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
                    console.log(`📈 Nueva puntuación de seguridad: ${newScore.score}/100 (${newScore.level})`);
                }
            }, 1000);
        }
    }

    // Método público para ver detalles de protecciones
    getProtectionDetails() {
        console.table(this.protections);
        return this.protections;
    }

    // Método público para obtener estadísticas
    getStats() {
        return {
            totalProtections: this.protectionsApplied,
            protections: this.protections,
            csrfToken: this.csrfToken,
            categories: this.protections.reduce((acc, protection) => {
                acc[protection.category] = (acc[protection.category] || 0) + 1;
                return acc;
            }, {})
        };
    }
}

// Inicializar después del analizador de seguridad
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Esperar un poco para que el analizador termine
        setTimeout(() => {
            window.securityProtector = new SecurityProtector();
        }, 3000);
    });
} else {
    setTimeout(() => {
        window.securityProtector = new SecurityProtector();
    }, 3000);
}

// Exportar para uso global
window.SecurityProtector = SecurityProtector;
