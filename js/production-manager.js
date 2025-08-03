/**
 * Production Manager - Sistema de Control de Entorno
 * Detecta si la web está en desarrollo o producción y controla los logs
 */

class ProductionManager {
    constructor() {
        this.isProduction = this.detectEnvironment();
        this.originalConsole = {
            log: console.log,
            info: console.info,
            warn: console.warn,
            error: console.error
        };
        
        this.init();
    }

    /**
     * Detectar si estamos en producción o desarrollo
     */
    detectEnvironment() {
        // Métodos para detectar producción:
        
        // 1. Por hostname (más confiable)
        const hostname = window.location.hostname;
        const isLocalhost = hostname === 'localhost' || 
                           hostname === '127.0.0.1' || 
                           hostname.includes('localhost') ||
                           hostname.includes('127.0.0.1') ||
                           hostname.includes('.local');
        
        // 2. Por puerto de desarrollo
        const port = window.location.port;
        const isDevelopmentPort = port === '3000' || 
                                 port === '5500' || 
                                 port === '8080' || 
                                 port === '4200';
        
        // 3. Por protocolo file://
        const isFileProtocol = window.location.protocol === 'file:';
        
        // 4. Variable de entorno personalizada (opcional)
        const isDebugMode = window.location.search.includes('debug=true') ||
                           localStorage.getItem('debugMode') === 'true';
        
        // Es desarrollo si cumple alguna condición
        const isDevelopment = isLocalhost || isDevelopmentPort || isFileProtocol || isDebugMode;
        
        return !isDevelopment; // Retorna true si es producción
    }

    /**
     * Inicializar el sistema
     */
    init() {
        if (this.isProduction) {
            this.enableProductionMode();
        } else {
            this.enableDevelopmentMode();
        }

        // Agregar información del entorno al objeto window
        window.ENVIRONMENT = {
            isProduction: this.isProduction,
            isDevelopment: !this.isProduction,
            hostname: window.location.hostname,
            port: window.location.port,
            protocol: window.location.protocol
        };

        // Sistema de optimización inteligente
        this.setupSmartOptimization();
    }

    /**
     * Configurar optimización inteligente (ejecutar análisis solo cuando sea necesario)
     */
    setupSmartOptimization() {
        // Crear sistema de cache para evitar re-análisis innecesarios
        window.OPTIMIZATION_CACHE = {
            lastRun: localStorage.getItem('optimizationLastRun'),
            version: '1.0.0', // Cambiar esto cuando actualices los sistemas
            pageHash: this.generatePageHash(),

            // Verificar si necesita re-ejecutar análisis
            needsRerun: function() {
                const stored = localStorage.getItem('optimizationCache');
                if (!stored) return true;

                const cache = JSON.parse(stored);
                return (
                    cache.version !== this.version ||
                    cache.pageHash !== this.pageHash ||
                    !cache.lastRun ||
                    Date.now() - cache.lastRun > 24 * 60 * 60 * 1000 // 24 horas
                );
            },

            // Marcar como completado
            markCompleted: function() {
                const cacheData = {
                    version: this.version,
                    pageHash: this.pageHash,
                    lastRun: Date.now()
                };
                localStorage.setItem('optimizationCache', JSON.stringify(cacheData));
            }
        };
    }

    /**
     * Generar hash de la página para detectar cambios
     */
    generatePageHash() {
        // Hash simple basado en elementos clave de la página
        const content = document.title +
                       document.querySelectorAll('img').length +
                       document.querySelectorAll('form').length +
                       document.querySelectorAll('a').length;
        return this.simpleHash(content);
    }

    /**
     * Hash simple para detectar cambios
     */
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString();
    }

    /**
     * Activar modo producción (sin logs)
     */
    enableProductionMode() {
        // Reemplazar console.log con función vacía
        console.log = () => {};
        console.info = () => {};
        
        // Mantener warnings y errors críticos pero limpios
        console.warn = (...args) => {
            // Solo mostrar warnings realmente importantes
            const message = args.join(' ');
            if (this.isCriticalWarning(message)) {
                this.originalConsole.warn(...args);
            }
        };
        
        console.error = (...args) => {
            // Mantener errores pero sin stack traces innecesarios
            this.originalConsole.error(...args);
        };

        // Limpiar consola existente
        console.clear();
        
        // Mensaje único de producción (opcional, se puede quitar)
        this.originalConsole.log('%c🚀 Centro Médico San Rafael - Modo Producción', 
            'color: #247cff; font-weight: bold; font-size: 14px;');
    }

    /**
     * Activar modo desarrollo (con logs)
     */
    enableDevelopmentMode() {
        // Mantener todos los logs en desarrollo
        console.log('%c🔧 Centro Médico San Rafael - Modo Desarrollo', 
            'color: #28a745; font-weight: bold; font-size: 14px;');
        console.log('📊 Logs de desarrollo activos');
    }

    /**
     * Determinar si un warning es crítico
     */
    isCriticalWarning(message) {
        const criticalKeywords = [
            'security',
            'seguridad',
            'error',
            'failed',
            'blocked',
            'unauthorized',
            'forbidden'
        ];
        
        return criticalKeywords.some(keyword => 
            message.toLowerCase().includes(keyword)
        );
    }

    /**
     * Método para forzar modo debug (útil para testing)
     */
    static enableDebugMode() {
        localStorage.setItem('debugMode', 'true');
        location.reload();
    }

    /**
     * Método para deshabilitar modo debug
     */
    static disableDebugMode() {
        localStorage.removeItem('debugMode');
        location.reload();
    }

    /**
     * Obtener información del entorno
     */
    getEnvironmentInfo() {
        return {
            isProduction: this.isProduction,
            isDevelopment: !this.isProduction,
            hostname: window.location.hostname,
            port: window.location.port,
            protocol: window.location.protocol,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };
    }
}

// Inicializar inmediatamente (antes que otros scripts)
window.productionManager = new ProductionManager();

// Funciones globales para control manual
window.enableDebug = ProductionManager.enableDebugMode;
window.disableDebug = ProductionManager.disableDebugMode;

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductionManager;
}
