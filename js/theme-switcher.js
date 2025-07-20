/**
 * Theme Switcher - Modo Oscuro/Claro
 * Sistema automático que las agencias cobran $3,000-8,000 MXN
 */

class ThemeSwitcher {
    constructor() {
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        console.log('🌙 Theme Switcher iniciado - Modo oscuro/claro disponible');
        this.createThemeToggle();
        this.loadSavedTheme();
        this.setupThemeStyles();
        this.detectSystemPreference();
    }

    // Crear botón de cambio de tema
    createThemeToggle() {
        // Crear botón flotante
        const themeToggle = document.createElement('button');
        themeToggle.id = 'theme-toggle';
        themeToggle.innerHTML = '🌙';
        themeToggle.title = 'Cambiar a modo oscuro';
        themeToggle.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: #247cff;
            color: white;
            font-size: 20px;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
        `;

        // Hover effects
        themeToggle.addEventListener('mouseenter', () => {
            themeToggle.style.transform = 'scale(1.1)';
            themeToggle.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
        });

        themeToggle.addEventListener('mouseleave', () => {
            themeToggle.style.transform = 'scale(1)';
            themeToggle.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        });

        // Click handler
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        document.body.appendChild(themeToggle);
        this.themeToggle = themeToggle;
    }

    // Configurar estilos de tema
    setupThemeStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Variables CSS para temas */
            :root {
                --bg-primary: #ffffff;
                --bg-secondary: #f8f9fa;
                --text-primary: #333333;
                --text-secondary: #666666;
                --border-color: #e9ecef;
                --shadow-color: rgba(0,0,0,0.1);
                --card-bg: #ffffff;
                --navbar-bg: rgba(255,255,255,0.95);
            }

            [data-theme="dark"] {
                --bg-primary: #1a1a1a;
                --bg-secondary: #2d2d2d;
                --text-primary: #ffffff;
                --text-secondary: #cccccc;
                --border-color: #404040;
                --shadow-color: rgba(0,0,0,0.3);
                --card-bg: #2d2d2d;
                --navbar-bg: rgba(26,26,26,0.95);
            }

            /* Aplicar variables a elementos */
            body {
                background-color: var(--bg-primary) !important;
                color: var(--text-primary) !important;
                transition: background-color 0.3s ease, color 0.3s ease;
            }

            .navbar {
                background-color: var(--navbar-bg) !important;
                border-bottom: 1px solid var(--border-color);
            }

            .navbar-brand, .nav-link {
                color: var(--text-primary) !important;
            }

            .card, .section {
                background-color: var(--card-bg) !important;
                color: var(--text-primary) !important;
                border: 1px solid var(--border-color);
            }

            .bg-light {
                background-color: var(--bg-secondary) !important;
            }

            .text-muted {
                color: var(--text-secondary) !important;
            }

            .border {
                border-color: var(--border-color) !important;
            }

            .shadow, .shadow-sm, .shadow-lg {
                box-shadow: 0 0.125rem 0.25rem var(--shadow-color) !important;
            }

            /* Formularios en modo oscuro */
            [data-theme="dark"] .form-control {
                background-color: var(--bg-secondary);
                border-color: var(--border-color);
                color: var(--text-primary);
            }

            [data-theme="dark"] .form-control:focus {
                background-color: var(--bg-secondary);
                border-color: #247cff;
                color: var(--text-primary);
                box-shadow: 0 0 0 0.2rem rgba(36, 124, 255, 0.25);
            }

            /* Botones en modo oscuro */
            [data-theme="dark"] .btn-outline-primary {
                color: #247cff;
                border-color: #247cff;
            }

            [data-theme="dark"] .btn-outline-primary:hover {
                background-color: #247cff;
                color: white;
            }

            /* Animación suave para cambio de tema */
            * {
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    // Cambiar tema
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        this.saveTheme(this.currentTheme);
        
        // Actualizar botón
        if (this.currentTheme === 'dark') {
            this.themeToggle.innerHTML = '☀️';
            this.themeToggle.title = 'Cambiar a modo claro';
        } else {
            this.themeToggle.innerHTML = '🌙';
            this.themeToggle.title = 'Cambiar a modo oscuro';
        }

        // Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'theme_change', {
                event_category: 'UI',
                event_label: this.currentTheme,
                value: 1
            });
        }

        console.log(`🌙 Tema cambiado a: ${this.currentTheme}`);
    }

    // Aplicar tema
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Actualizar meta theme-color
        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (themeColorMeta) {
            themeColorMeta.content = theme === 'dark' ? '#1a1a1a' : '#247cff';
        }
    }

    // Guardar preferencia
    saveTheme(theme) {
        localStorage.setItem('preferred-theme', theme);
    }

    // Cargar tema guardado
    loadSavedTheme() {
        const savedTheme = localStorage.getItem('preferred-theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
            this.applyTheme(savedTheme);
            
            // Actualizar botón
            if (savedTheme === 'dark') {
                this.themeToggle.innerHTML = '☀️';
                this.themeToggle.title = 'Cambiar a modo claro';
            }
        }
    }

    // Detectar preferencia del sistema
    detectSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // Solo aplicar si no hay preferencia guardada
            if (!localStorage.getItem('preferred-theme')) {
                this.currentTheme = 'dark';
                this.applyTheme('dark');
                this.themeToggle.innerHTML = '☀️';
                this.themeToggle.title = 'Cambiar a modo claro';
            }
        }

        // Escuchar cambios en preferencia del sistema
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('preferred-theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                this.currentTheme = newTheme;
                this.applyTheme(newTheme);
                
                if (newTheme === 'dark') {
                    this.themeToggle.innerHTML = '☀️';
                    this.themeToggle.title = 'Cambiar a modo claro';
                } else {
                    this.themeToggle.innerHTML = '🌙';
                    this.themeToggle.title = 'Cambiar a modo oscuro';
                }
            }
        });
    }

    // Método público para obtener tema actual
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Método público para forzar tema
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.currentTheme = theme;
            this.applyTheme(theme);
            this.saveTheme(theme);
            
            if (theme === 'dark') {
                this.themeToggle.innerHTML = '☀️';
                this.themeToggle.title = 'Cambiar a modo claro';
            } else {
                this.themeToggle.innerHTML = '🌙';
                this.themeToggle.title = 'Cambiar a modo oscuro';
            }
        }
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.themeSwitcher = new ThemeSwitcher();
    });
} else {
    window.themeSwitcher = new ThemeSwitcher();
}

// Exportar para uso global
window.ThemeSwitcher = ThemeSwitcher;
