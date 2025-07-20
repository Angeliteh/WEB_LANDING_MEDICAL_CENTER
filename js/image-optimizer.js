/**
 * Image Optimizer System
 * Optimiza carga de imágenes con WebP, Lazy Loading y Responsive Images
 */

class ImageOptimizer {
    constructor() {
        this.supportsWebP = false;
        this.lazyImages = [];
        this.observer = null;
        this.init();
    }

    async init() {
        // Detectar soporte WebP
        await this.detectWebPSupport();
        
        // Configurar lazy loading
        this.setupLazyLoading();
        
        // Optimizar imágenes existentes
        this.optimizeExistingImages();
        
        console.log('🖼️ Image Optimizer initialized');
        console.log(`📊 WebP Support: ${this.supportsWebP ? 'YES' : 'NO'}`);
    }

    // Detectar si el navegador soporta WebP
    async detectWebPSupport() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                this.supportsWebP = (webP.height === 2);
                resolve(this.supportsWebP);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    // Configurar Intersection Observer para lazy loading
    setupLazyLoading() {
        // Verificar soporte del navegador
        if (!('IntersectionObserver' in window)) {
            console.log('⚠️ IntersectionObserver no soportado, cargando todas las imágenes');
            this.loadAllImages();
            return;
        }

        // Configurar observer
        const options = {
            root: null,
            rootMargin: '50px', // Cargar 50px antes de que sea visible
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);
    }

    // Optimizar imágenes existentes en la página
    optimizeExistingImages() {
        // Buscar todas las imágenes
        const images = document.querySelectorAll('img[src]');
        
        images.forEach(img => {
            this.optimizeImage(img);
        });
    }

    // Optimizar una imagen individual
    optimizeImage(img) {
        const originalSrc = img.src;
        
        // Solo optimizar imágenes locales
        if (!originalSrc.includes('/images/')) {
            return;
        }

        // Crear versión optimizada
        const optimizedSrc = this.getOptimizedSrc(originalSrc);
        
        // Configurar lazy loading
        img.dataset.src = optimizedSrc;
        img.dataset.fallback = originalSrc;
        
        // Agregar clase para lazy loading
        img.classList.add('lazy-image');
        
        // Placeholder mientras carga
        img.src = this.createPlaceholder(img.width || 400, img.height || 300);
        
        // Observar para lazy loading
        if (this.observer) {
            this.observer.observe(img);
        } else {
            // Fallback: cargar inmediatamente
            this.loadImage(img);
        }
    }

    // Obtener URL optimizada (WebP si es soportado)
    getOptimizedSrc(originalSrc) {
        if (!this.supportsWebP) {
            return originalSrc;
        }

        // Convertir extensión a WebP
        const webpSrc = originalSrc
            .replace(/\.jpg$/i, '.webp')
            .replace(/\.jpeg$/i, '.webp')
            .replace(/\.png$/i, '.webp');

        return webpSrc;
    }

    // Cargar imagen con fallback
    async loadImage(img) {
        const optimizedSrc = img.dataset.src;
        const fallbackSrc = img.dataset.fallback;

        try {
            // Intentar cargar versión optimizada
            await this.preloadImage(optimizedSrc);
            img.src = optimizedSrc;
            img.classList.add('loaded');
            
            console.log(`✅ Loaded WebP: ${optimizedSrc.split('/').pop()}`);
            
        } catch (error) {
            // Fallback a imagen original
            try {
                await this.preloadImage(fallbackSrc);
                img.src = fallbackSrc;
                img.classList.add('loaded');
                
                console.log(`⚠️ Fallback to original: ${fallbackSrc.split('/').pop()}`);
                
            } catch (fallbackError) {
                console.error('❌ Error loading image:', fallbackError);
                img.classList.add('error');
            }
        }

        // Limpiar datos
        delete img.dataset.src;
        delete img.dataset.fallback;
    }

    // Precargar imagen para verificar que existe
    preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = src;
        });
    }

    // Crear placeholder SVG
    createPlaceholder(width, height) {
        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f0f0f0"/>
                <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" 
                      fill="#999" text-anchor="middle" dy=".3em">Cargando...</text>
            </svg>
        `;
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }

    // Cargar todas las imágenes (fallback para navegadores antiguos)
    loadAllImages() {
        const lazyImages = document.querySelectorAll('.lazy-image');
        lazyImages.forEach(img => this.loadImage(img));
    }

    // Método público para optimizar nuevas imágenes dinámicamente
    optimizeNewImage(img) {
        this.optimizeImage(img);
    }

    // Obtener estadísticas de optimización
    getStats() {
        const totalImages = document.querySelectorAll('img').length;
        const lazyImages = document.querySelectorAll('.lazy-image').length;
        const loadedImages = document.querySelectorAll('.lazy-image.loaded').length;
        
        return {
            total: totalImages,
            optimized: lazyImages,
            loaded: loadedImages,
            webpSupport: this.supportsWebP
        };
    }
}

// CSS para transiciones suaves
const imageOptimizerCSS = `
<style>
.lazy-image {
    transition: opacity 0.3s ease;
    opacity: 0.7;
}

.lazy-image.loaded {
    opacity: 1;
}

.lazy-image.error {
    opacity: 0.5;
    filter: grayscale(100%);
}

/* Efecto de carga suave */
.lazy-image:not(.loaded) {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
}

@keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
</style>
`;

// Inyectar CSS
document.head.insertAdjacentHTML('beforeend', imageOptimizerCSS);

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.imageOptimizer = new ImageOptimizer();
    });
} else {
    window.imageOptimizer = new ImageOptimizer();
}

// Exportar para uso global
window.ImageOptimizer = ImageOptimizer;
