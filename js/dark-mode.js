/**
 * Dark Mode Manager for Centro Médico San Rafael
 * Handles theme switching, persistence, and system preference detection
 */

class DarkModeManager {
    constructor() {
        this.storageKey = 'centroMedicoTheme';
        this.themes = {
            LIGHT: 'light',
            DARK: 'dark'
        };
        
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        this.init();
    }

    /**
     * Initialize the dark mode system
     */
    init() {
        this.createToggleButton();
        this.applyTheme(this.currentTheme);
        this.bindEvents();
        this.watchSystemTheme();
    }

    /**
     * Create the theme toggle button and add it to navbar
     */
    createToggleButton() {
        const navbar = document.querySelector('.navbar-nav');
        if (!navbar) return;

        // Create toggle button container
        const toggleContainer = document.createElement('li');
        toggleContainer.className = 'nav-item d-flex align-items-center';
        
        // Create toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'theme-toggle';
        toggleButton.setAttribute('aria-label', 'Cambiar tema');
        toggleButton.setAttribute('title', 'Cambiar entre modo claro y oscuro');
        
        toggleButton.innerHTML = `
            <i class="bi-sun icon icon-sun" aria-hidden="true"></i>
            <i class="bi-moon icon icon-moon" aria-hidden="true"></i>
            <span class="d-none d-md-inline">Tema</span>
        `;

        toggleContainer.appendChild(toggleButton);
        navbar.appendChild(toggleContainer);

        // Store reference for later use
        this.toggleButton = toggleButton;
    }

    /**
     * Get theme preference from localStorage (with fallback)
     */
    getStoredTheme() {
        try {
            return localStorage.getItem(this.storageKey);
        } catch (e) {
            // Fallback: leer de cookie
            try {
                const cookies = document.cookie.split(';');
                for (let cookie of cookies) {
                    const [name, value] = cookie.trim().split('=');
                    if (name === this.storageKey) {
                        return value;
                    }
                }
            } catch (cookieError) {
                // Silently fail
            }
            return null;
        }
    }

    /**
     * Save theme preference to localStorage (with fallback)
     */
    setStoredTheme(theme) {
        try {
            localStorage.setItem(this.storageKey, theme);
        } catch (e) {
            // Fallback: usar cookie
            try {
                document.cookie = `${this.storageKey}=${theme}; path=/; max-age=31536000`;
            } catch (cookieError) {
                // Silently fail
            }
        }
    }

    /**
     * Get system theme preference
     */
    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return this.themes.DARK;
        }
        return this.themes.LIGHT;
    }

    /**
     * Apply theme to the document
     */
    applyTheme(theme) {
        // Create transition overlay if it doesn't exist
        this.createTransitionOverlay();

        // Add switching class to prevent flash
        document.body.classList.add('theme-switching');

        // Apply theme with slight delay for smooth transition
        setTimeout(() => {
            if (theme === this.themes.DARK) {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
        }, 50);

        this.currentTheme = theme;
        this.setStoredTheme(theme);
        this.updateToggleButton();
        this.updateLanguageTranslations();

        // Remove switching class after transition
        setTimeout(() => {
            document.body.classList.remove('theme-switching');
        }, 600);
    }

    /**
     * Create transition overlay for smooth theme switching
     */
    createTransitionOverlay() {
        if (document.querySelector('.theme-transition-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'theme-transition-overlay';
        document.body.appendChild(overlay);
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        const newTheme = this.currentTheme === this.themes.DARK 
            ? this.themes.LIGHT 
            : this.themes.DARK;
        
        this.applyTheme(newTheme);
        
        // Trigger custom event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: newTheme }
        }));
    }

    /**
     * Update toggle button appearance
     */
    updateToggleButton() {
        if (!this.toggleButton) return;

        const isDark = this.currentTheme === this.themes.DARK;
        const label = isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
        
        this.toggleButton.setAttribute('aria-label', label);
        this.toggleButton.setAttribute('title', label);
    }

    /**
     * Update theme-related translations
     */
    updateLanguageTranslations() {
        // Update translations if language manager exists
        if (window.languageManager) {
            const currentLang = window.languageManager.currentLanguage;
            const themeTexts = {
                es: {
                    light: 'Cambiar a modo claro',
                    dark: 'Cambiar a modo oscuro',
                    theme: 'Tema'
                },
                en: {
                    light: 'Switch to light mode',
                    dark: 'Switch to dark mode',
                    theme: 'Theme'
                }
            };

            if (this.toggleButton && themeTexts[currentLang]) {
                const isDark = this.currentTheme === this.themes.DARK;
                const text = isDark ? themeTexts[currentLang].light : themeTexts[currentLang].dark;
                
                this.toggleButton.setAttribute('aria-label', text);
                this.toggleButton.setAttribute('title', text);
                
                const themeText = this.toggleButton.querySelector('.d-none');
                if (themeText) {
                    themeText.textContent = themeTexts[currentLang].theme;
                }
            }
        }
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Toggle button click
        document.addEventListener('click', (e) => {
            if (e.target.closest('.theme-toggle')) {
                e.preventDefault();
                this.toggleTheme();
            }
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.theme-toggle') && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                this.toggleTheme();
            }
        });

        // Listen for language changes
        window.addEventListener('languageChanged', () => {
            this.updateLanguageTranslations();
        });
    }

    /**
     * Watch for system theme changes
     */
    watchSystemTheme() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            mediaQuery.addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a preference
                if (!this.getStoredTheme()) {
                    const systemTheme = e.matches ? this.themes.DARK : this.themes.LIGHT;
                    this.applyTheme(systemTheme);
                }
            });
        }
    }

    /**
     * Get current theme
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Check if dark mode is active
     */
    isDarkMode() {
        return this.currentTheme === this.themes.DARK;
    }

    /**
     * Force set theme (useful for external integrations)
     */
    setTheme(theme) {
        if (Object.values(this.themes).includes(theme)) {
            this.applyTheme(theme);
        }
    }

    /**
     * Reset to system preference
     */
    resetToSystem() {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (e) {
            // Fallback: remover cookie
            try {
                document.cookie = `${this.storageKey}=; path=/; max-age=0`;
            } catch (cookieError) {
                // Silently fail
            }
        }
        const systemTheme = this.getSystemTheme();
        this.applyTheme(systemTheme);
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize dark mode manager
    window.darkModeManager = new DarkModeManager();
    
    // Integrate with language manager if it exists
    if (window.languageManager) {
        // Update theme translations when language changes
        window.addEventListener('languageChanged', () => {
            window.darkModeManager.updateLanguageTranslations();
        });
    }
});

// Expose utility functions globally
window.toggleTheme = () => {
    if (window.darkModeManager) {
        window.darkModeManager.toggleTheme();
    }
};

window.setTheme = (theme) => {
    if (window.darkModeManager) {
        window.darkModeManager.setTheme(theme);
    }
};

window.getCurrentTheme = () => {
    return window.darkModeManager ? window.darkModeManager.getCurrentTheme() : 'light';
};
