/**
 * Accessibility Fixer
 * "Reparador automático" que arregla problemas de accesibilidad
 */

class AccessibilityFixer {
    constructor() {
        this.fixedCount = 0;
        this.fixes = [];
        this.init();
    }

    init() {
        // Verificar si necesita ejecutarse
        if (window.OPTIMIZATION_CACHE && !window.OPTIMIZATION_CACHE.needsRerun()) {
            // Solo log en desarrollo
            if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
                console.log('🔧 Accessibility Fixer: Usando cache (ya optimizado)');
            }
            return;
        }

        // Solo log en desarrollo
        if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
            console.log('🔧 Accessibility Fixer iniciado - Reparando problemas...');
        }
        this.fixAll();
        this.generateFixReport();
    }

    // Reparar TODOS los problemas automáticamente
    fixAll() {
        this.fixes = []; // Limpiar reparaciones anteriores
        
        // 1. Arreglar formularios
        this.fixForms();
        
        // 2. Mejorar navegación
        this.fixNavigation();
        
        // 3. Agregar ARIA labels
        this.addAriaLabels();
        
        // 4. Mejorar interactividad
        this.fixInteractivity();
        
        // 5. Agregar skip links
        this.addSkipLinks();
        
        // Solo log en desarrollo
        if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
            console.log(`✅ Reparaciones completadas: ${this.fixedCount} problemas arreglados`);
        }
    }

    // 1. ARREGLAR FORMULARIOS
    fixForms() {
        // Solo log en desarrollo
        if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
            console.log('📝 Reparando formularios...');
        }
        
        // Encontrar todos los campos de formulario
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach((input, index) => {
            this.fixSingleInput(input, index);
        });
    }

    fixSingleInput(input, index) {
        const inputType = input.type || input.tagName.toLowerCase();
        let fixed = false;
        
        // 🔧 ARREGLO 1: Agregar ID si no tiene
        if (!input.id) {
            input.id = `auto-input-${index}-${inputType}`;
            fixed = true;
        }
        
        // 🔧 ARREGLO 2: Crear label si no existe
        if (!this.hasAssociatedLabel(input)) {
            const label = this.createLabelForInput(input);
            if (label) {
                // Insertar label antes del input
                input.parentNode.insertBefore(label, input);
                this.addFix('Formulario', `Agregado label para campo ${inputType}`, input);
                fixed = true;
            }
        }
        
        // 🔧 ARREGLO 3: Agregar indicador de campo requerido
        if (input.required && !this.hasRequiredIndicator(input)) {
            this.addRequiredIndicator(input);
            fixed = true;
        }
        
        // 🔧 ARREGLO 4: Agregar aria-required
        if (input.required && !input.getAttribute('aria-required')) {
            input.setAttribute('aria-required', 'true');
            fixed = true;
        }
        
        // 🔧 ARREGLO 5: Mejorar placeholder como descripción
        if (input.placeholder && !input.getAttribute('aria-describedby')) {
            const descId = `desc-${input.id}`;
            const description = document.createElement('small');
            description.id = descId;
            description.textContent = input.placeholder;
            description.className = 'form-text text-muted';
            input.setAttribute('aria-describedby', descId);
            input.parentNode.insertBefore(description, input.nextSibling);
            fixed = true;
        }
        
        if (fixed) {
            this.fixedCount++;
        }
    }

    // Crear label inteligente según el tipo de input
    createLabelForInput(input) {
        const label = document.createElement('label');
        label.setAttribute('for', input.id);
        label.className = 'form-label';
        
        // Texto del label según el tipo de campo
        const inputType = input.type || input.tagName.toLowerCase();
        const inputName = input.name || '';
        
        let labelText = '';
        
        // 🎯 Textos inteligentes según el tipo
        switch (inputType) {
            case 'email':
                labelText = 'Correo Electrónico';
                break;
            case 'tel':
                labelText = 'Teléfono';
                break;
            case 'text':
                if (inputName.includes('name') || inputName.includes('nombre')) {
                    labelText = 'Nombre';
                } else if (inputName.includes('subject') || inputName.includes('asunto')) {
                    labelText = 'Asunto';
                } else {
                    labelText = 'Texto';
                }
                break;
            case 'textarea':
                labelText = 'Mensaje';
                break;
            case 'date':
                labelText = 'Fecha';
                break;
            case 'time':
                labelText = 'Hora';
                break;
            case 'select':
                labelText = 'Seleccionar opción';
                break;
            default:
                labelText = 'Campo de formulario';
        }
        
        // Agregar asterisco si es requerido
        if (input.required) {
            labelText += ' *';
        }
        
        label.textContent = labelText;
        return label;
    }

    // 2. MEJORAR NAVEGACIÓN
    fixNavigation() {
        // Solo log en desarrollo
        if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
            console.log('🧭 Mejorando navegación...');
        }
        
        // Arreglar enlaces con texto no descriptivo
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            this.fixSingleLink(link);
        });
        
        // Arreglar botones sin descripción
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            this.fixSingleButton(button);
        });
    }

    fixSingleLink(link) {
        const linkText = link.textContent.trim().toLowerCase();
        const href = link.getAttribute('href') || '';
        
        // 🔧 ARREGLO: Enlaces con texto no descriptivo
        const genericTexts = ['click here', 'here', 'read more', 'más', 'ver más', 'leer más'];
        
        if (genericTexts.includes(linkText) || linkText === '') {
            let ariaLabel = '';
            
            // Generar aria-label inteligente según el href
            if (href.includes('#contact')) {
                ariaLabel = 'Ir a la sección de contacto';
            } else if (href.includes('#booking')) {
                ariaLabel = 'Ir al formulario de citas';
            } else if (href.includes('#about')) {
                ariaLabel = 'Ir a la sección acerca de nosotros';
            } else if (href.includes('#services') || href.includes('#timeline')) {
                ariaLabel = 'Ir a la sección de servicios';
            } else if (href.includes('#testimonials') || href.includes('#reviews')) {
                ariaLabel = 'Ir a testimonios de pacientes';
            } else if (href.includes('tel:')) {
                ariaLabel = 'Llamar al centro médico';
            } else if (href.includes('mailto:')) {
                ariaLabel = 'Enviar correo electrónico';
            } else if (href.includes('whatsapp')) {
                ariaLabel = 'Contactar por WhatsApp';
            } else {
                ariaLabel = 'Enlace a ' + (href || 'página externa');
            }
            
            link.setAttribute('aria-label', ariaLabel);
            this.addFix('Navegación', `Mejorado enlace: "${ariaLabel}"`, link);
            this.fixedCount++;
        }
    }

    fixSingleButton(button) {
        const buttonText = button.textContent.trim();
        const hasAriaLabel = button.getAttribute('aria-label');
        
        // 🔧 ARREGLO: Botones sin texto ni aria-label
        if (!buttonText && !hasAriaLabel) {
            let ariaLabel = '';
            
            // Generar aria-label según clases o contexto
            if (button.classList.contains('navbar-toggler')) {
                ariaLabel = 'Abrir menú de navegación';
            } else if (button.classList.contains('close')) {
                ariaLabel = 'Cerrar';
            } else if (button.type === 'submit') {
                ariaLabel = 'Enviar formulario';
            } else {
                ariaLabel = 'Botón interactivo';
            }
            
            button.setAttribute('aria-label', ariaLabel);
            this.addFix('Navegación', `Agregado aria-label a botón: "${ariaLabel}"`, button);
            this.fixedCount++;
        }
    }

    // 3. AGREGAR ARIA LABELS AVANZADOS
    addAriaLabels() {
        // Solo log en desarrollo
        if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
            console.log('🏷️ Agregando ARIA labels...');
        }
        
        // Mejorar secciones principales
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            if (!section.getAttribute('aria-label') && !section.getAttribute('aria-labelledby')) {
                const heading = section.querySelector('h1, h2, h3, h4, h5, h6');
                if (heading) {
                    const headingId = `section-heading-${index}`;
                    heading.id = headingId;
                    section.setAttribute('aria-labelledby', headingId);
                } else {
                    // Generar aria-label según el ID o clase
                    let ariaLabel = '';
                    if (section.id.includes('about')) {
                        ariaLabel = 'Sección acerca de nosotros';
                    } else if (section.id.includes('services') || section.id.includes('timeline')) {
                        ariaLabel = 'Sección de servicios médicos';
                    } else if (section.id.includes('testimonials') || section.id.includes('reviews')) {
                        ariaLabel = 'Testimonios de pacientes';
                    } else if (section.id.includes('contact')) {
                        ariaLabel = 'Información de contacto';
                    } else if (section.id.includes('booking')) {
                        ariaLabel = 'Formulario de citas';
                    } else {
                        ariaLabel = `Sección ${index + 1}`;
                    }
                    
                    section.setAttribute('aria-label', ariaLabel);
                }
                
                this.addFix('Estructura', `Agregado aria-label a sección`, section);
                this.fixedCount++;
            }
        });
    }

    // 4. MEJORAR INTERACTIVIDAD
    fixInteractivity() {
        // Solo log en desarrollo
        if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
            console.log('⚡ Mejorando interactividad...');
        }
        
        // Agregar role="button" a elementos clickeables que no son botones
        const clickableElements = document.querySelectorAll('[onclick]:not(button):not(a)');
        clickableElements.forEach(element => {
            if (!element.getAttribute('role')) {
                element.setAttribute('role', 'button');
                element.setAttribute('tabindex', '0');
                
                // Agregar soporte para teclado
                element.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        element.click();
                    }
                });
                
                this.addFix('Interactividad', 'Mejorado elemento clickeable', element);
                this.fixedCount++;
            }
        });
    }

    // 5. AGREGAR SKIP LINKS
    addSkipLinks() {
        // Solo log en desarrollo
        if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
            console.log('⏭️ Agregando skip links...');
        }
        
        // Verificar si ya existe skip link
        if (!document.querySelector('.skip-link')) {
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.className = 'skip-link';
            skipLink.textContent = 'Saltar al contenido principal';
            skipLink.style.cssText = `
                position: absolute;
                top: -40px;
                left: 6px;
                background: #000;
                color: #fff;
                padding: 8px;
                text-decoration: none;
                z-index: 9999;
                border-radius: 4px;
            `;
            
            // Mostrar cuando recibe foco
            skipLink.addEventListener('focus', () => {
                skipLink.style.top = '6px';
            });
            
            skipLink.addEventListener('blur', () => {
                skipLink.style.top = '-40px';
            });
            
            // Insertar al inicio del body
            document.body.insertBefore(skipLink, document.body.firstChild);
            
            // Agregar ID al contenido principal si no existe
            const mainContent = document.querySelector('main') || document.querySelector('#main-content') || document.querySelector('.main-content');
            if (mainContent && !mainContent.id) {
                mainContent.id = 'main-content';
            } else if (!mainContent) {
                // Si no hay main, agregar ID al primer section
                const firstSection = document.querySelector('section');
                if (firstSection) {
                    firstSection.id = 'main-content';
                }
            }
            
            this.addFix('Navegación', 'Agregado skip link para accesibilidad', skipLink);
            this.fixedCount++;
        }
    }

    // MÉTODOS AUXILIARES
    hasAssociatedLabel(input) {
        const id = input.id;
        if (id && document.querySelector(`label[for="${id}"]`)) return true;
        if (input.closest('label')) return true;
        if (input.getAttribute('aria-label')) return true;
        return false;
    }

    hasRequiredIndicator(input) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label && (label.textContent.includes('*') || label.textContent.includes('requerido'))) {
            return true;
        }
        return false;
    }

    addRequiredIndicator(input) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label && !label.textContent.includes('*')) {
            label.textContent += ' *';
            this.addFix('Formulario', 'Agregado indicador de campo requerido (*)', input);
        }
    }

    addFix(category, description, element) {
        this.fixes.push({
            category,
            description,
            element: element.tagName.toLowerCase() + (element.id ? `#${element.id}` : '')
        });
    }

    // Generar reporte de reparaciones
    generateFixReport() {
        // Solo logs en desarrollo
        if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
            console.log('🔧 REPORTE DE REPARACIONES:');
            console.log(`✅ Total de problemas arreglados: ${this.fixedCount}`);
            console.log('📋 Para ver detalles: window.a11yFixer.getFixDetails()');
        }

        // Re-analizar para ver mejora
        if (window.a11yAnalyzer) {
            setTimeout(() => {
                if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
                    console.log('🔄 Re-analizando accesibilidad después de reparaciones...');
                }
                window.a11yAnalyzer.analyzeAll();
                const newScore = window.a11yAnalyzer.getScore();
                if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
                    console.log(`📈 Nueva puntuación: ${newScore.score}/100 (mejora aplicada)`);
                }
            }, 1000);
        }
    }

    // Método público para ver detalles de reparaciones
    getFixDetails() {
        console.table(this.fixes);
        return this.fixes;
    }

    // Método público para obtener estadísticas
    getStats() {
        return {
            totalFixes: this.fixedCount,
            fixes: this.fixes,
            categories: this.fixes.reduce((acc, fix) => {
                acc[fix.category] = (acc[fix.category] || 0) + 1;
                return acc;
            }, {})
        };
    }
}

// Inicializar después del analizador
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Esperar un poco para que el analizador termine
        setTimeout(() => {
            window.a11yFixer = new AccessibilityFixer();
        }, 2000);
    });
} else {
    setTimeout(() => {
        window.a11yFixer = new AccessibilityFixer();
    }, 2000);
}

// Exportar para uso global
window.AccessibilityFixer = AccessibilityFixer;
