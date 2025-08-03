/**
 * SEO Optimizer System
 * Sistema reutilizable de SEO avanzado para cualquier plantilla
 */

class SEOOptimizer {
    constructor(config = {}) {
        this.config = {
            // Configuración por defecto (FÁCIL DE CAMBIAR EN OTRAS PLANTILLAS)
            siteName: config.siteName || 'Centro Médico San Rafael',
            siteUrl: config.siteUrl || 'https://www.centromedico.com',
            businessType: config.businessType || 'MedicalOrganization',
            language: config.language || 'es',
            sector: config.sector || 'medical',
            ...config
        };
        
        this.currentLanguage = this.config.language;
        this.init();
    }

    init() {
        this.setupDynamicMetas();
        this.setupSchemaMarkup();
        this.setupCanonicalUrls();
        this.setupBreadcrumbs();
        this.setupHreflang();
        this.trackSEOEvents();
        
        // Solo logs en desarrollo
        if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
            console.log('🔍 SEO Optimizer initialized for:', this.config.siteName);
            console.log('🌐 Business Type:', this.config.businessType);
            console.log('🗣️ Language:', this.currentLanguage);
        }
    }

    // Meta tags dinámicos por idioma
    setupDynamicMetas() {
        // Obtener traducciones actuales
        const translations = window.translations || {};
        const currentLang = this.currentLanguage;
        const content = translations[currentLang] || translations['es'] || {};

        // Actualizar título dinámico
        if (content.seo && content.seo.title) {
            document.title = content.seo.title;
            this.updateMetaProperty('og:title', content.seo.title);
            this.updateMetaProperty('twitter:title', content.seo.title);
        }

        // Actualizar descripción dinámica
        if (content.seo && content.seo.description) {
            this.updateMetaTag('description', content.seo.description);
            this.updateMetaProperty('og:description', content.seo.description);
            this.updateMetaProperty('twitter:description', content.seo.description);
        }

        // Actualizar keywords dinámicas
        if (content.seo && content.seo.keywords) {
            this.updateMetaTag('keywords', content.seo.keywords);
        }

        // Meta tags específicos por idioma
        this.updateMetaTag('language', currentLang);
        this.updateMetaProperty('og:locale', currentLang === 'es' ? 'es_ES' : 'en_US');
    }

    // Schema Markup avanzado y reutilizable
    setupSchemaMarkup() {
        const schema = this.generateSchemaMarkup();
        
        // Remover schema anterior si existe
        const existingSchema = document.querySelector('script[type="application/ld+json"]');
        if (existingSchema) {
            existingSchema.remove();
        }

        // Agregar nuevo schema
        const schemaScript = document.createElement('script');
        schemaScript.type = 'application/ld+json';
        schemaScript.textContent = JSON.stringify(schema, null, 2);
        document.head.appendChild(schemaScript);

        // Solo log en desarrollo
        if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
            console.log('📊 Schema Markup updated:', this.config.businessType);
        }
    }

    // Generar Schema Markup según el tipo de negocio
    generateSchemaMarkup() {
        const baseSchema = {
            "@context": "https://schema.org",
            "@type": this.config.businessType,
            "name": this.config.siteName,
            "url": this.config.siteUrl,
            "logo": `${this.config.siteUrl}/images/logo.png`,
            "description": this.getMetaContent('description'),
            "telephone": this.config.phone || "+52 55 5661-8420",
            "email": this.config.email || "contacto@centromedico.com"
        };

        // Schema específico por sector
        switch (this.config.sector) {
            case 'medical':
                return this.generateMedicalSchema(baseSchema);
            case 'legal':
                return this.generateLegalSchema(baseSchema);
            case 'creative':
                return this.generateCreativeSchema(baseSchema);
            case 'business':
                return this.generateBusinessSchema(baseSchema);
            default:
                return baseSchema;
        }
    }

    // Schema específico para sector médico
    generateMedicalSchema(base) {
        return {
            ...base,
            "@type": "MedicalOrganization",
            "medicalSpecialty": [
                "General Practice",
                "Cardiology", 
                "Dermatology",
                "Pediatrics"
            ],
            "availableService": [
                {
                    "@type": "MedicalProcedure",
                    "name": "Consulta General",
                    "description": "Atención médica integral"
                },
                {
                    "@type": "MedicalProcedure", 
                    "name": "Especialidades Médicas",
                    "description": "Servicios especializados"
                }
            ],
            "address": {
                "@type": "PostalAddress",
                "streetAddress": this.config.address || "Av. Principal 123",
                "addressLocality": this.config.city || "Ciudad de México",
                "addressCountry": "MX"
            },
            "openingHours": [
                "Mo-Fr 08:00-20:00",
                "Sa 09:00-14:00"
            ],
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "127"
            }
        };
    }

    // Schema para sector legal (REUTILIZABLE)
    generateLegalSchema(base) {
        return {
            ...base,
            "@type": "LegalService",
            "serviceType": [
                "Legal Consultation",
                "Contract Law",
                "Family Law",
                "Corporate Law"
            ],
            "areaServed": {
                "@type": "Country",
                "name": "Mexico"
            }
        };
    }

    // Schema para sector creativo (REUTILIZABLE)
    generateCreativeSchema(base) {
        return {
            ...base,
            "@type": "ProfessionalService",
            "serviceType": [
                "Web Design",
                "Graphic Design", 
                "Photography",
                "Digital Marketing"
            ]
        };
    }

    // Schema para sector empresarial (REUTILIZABLE)
    generateBusinessSchema(base) {
        return {
            ...base,
            "@type": "Organization",
            "serviceType": [
                "Business Consulting",
                "Financial Services",
                "Management",
                "Strategy"
            ]
        };
    }

    // URLs canónicas dinámicas
    setupCanonicalUrls() {
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }

        const currentPath = window.location.pathname;
        const langPath = this.currentLanguage === 'en' ? '/en' : '';
        canonical.href = `${this.config.siteUrl}${langPath}${currentPath}`;

        // Solo log en desarrollo
        if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
            console.log('🔗 Canonical URL set:', canonical.href);
        }
    }

    // Hreflang para multiidioma
    setupHreflang() {
        // Remover hreflang existentes
        document.querySelectorAll('link[rel="alternate"]').forEach(link => {
            if (link.getAttribute('hreflang')) {
                link.remove();
            }
        });

        // Agregar hreflang para español
        const hreflangEs = document.createElement('link');
        hreflangEs.rel = 'alternate';
        hreflangEs.hreflang = 'es';
        hreflangEs.href = `${this.config.siteUrl}/`;
        document.head.appendChild(hreflangEs);

        // Agregar hreflang para inglés
        const hreflangEn = document.createElement('link');
        hreflangEn.rel = 'alternate';
        hreflangEn.hreflang = 'en';
        hreflangEn.href = `${this.config.siteUrl}/en/`;
        document.head.appendChild(hreflangEn);

        // Agregar x-default
        const hreflangDefault = document.createElement('link');
        hreflangDefault.rel = 'alternate';
        hreflangDefault.hreflang = 'x-default';
        hreflangDefault.href = `${this.config.siteUrl}/`;
        document.head.appendChild(hreflangDefault);

        // Solo log en desarrollo
        if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
            console.log('🌐 Hreflang tags configured');
        }
    }

    // Breadcrumbs automáticos
    setupBreadcrumbs() {
        const breadcrumbSchema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Inicio",
                    "item": this.config.siteUrl
                }
            ]
        };

        // Agregar breadcrumb schema
        const breadcrumbScript = document.createElement('script');
        breadcrumbScript.type = 'application/ld+json';
        breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);
        document.head.appendChild(breadcrumbScript);
    }

    // Tracking de eventos SEO
    trackSEOEvents() {
        // Track cuando cambia el idioma
        document.addEventListener('languageChanged', (e) => {
            this.currentLanguage = e.detail.language;
            this.setupDynamicMetas();
            this.setupCanonicalUrls();
            
            // Track en Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'language_change', {
                    event_category: 'SEO',
                    event_label: this.currentLanguage,
                    value: 1
                });
            }
        });

        // Track scroll depth para SEO
        this.trackScrollDepth();
    }

    // Track scroll depth (importante para SEO)
    trackScrollDepth() {
        const milestones = [25, 50, 75, 100];
        const tracked = new Set();

        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );

            milestones.forEach(milestone => {
                if (scrollPercent >= milestone && !tracked.has(milestone)) {
                    tracked.add(milestone);
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'scroll_depth', {
                            event_category: 'SEO',
                            event_label: `${milestone}%`,
                            value: milestone
                        });
                    }
                }
            });
        });
    }

    // Métodos auxiliares
    updateMetaTag(name, content) {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = name;
            document.head.appendChild(meta);
        }
        meta.content = content;
    }

    updateMetaProperty(property, content) {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', property);
            document.head.appendChild(meta);
        }
        meta.content = content;
    }

    getMetaContent(name) {
        const meta = document.querySelector(`meta[name="${name}"]`);
        return meta ? meta.content : '';
    }

    // Método público para cambiar configuración (REUTILIZABLE)
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.init(); // Reinicializar con nueva config
    }

    // Método para obtener estadísticas SEO
    getSEOStats() {
        return {
            title: document.title,
            description: this.getMetaContent('description'),
            keywords: this.getMetaContent('keywords'),
            canonical: document.querySelector('link[rel="canonical"]')?.href,
            language: this.currentLanguage,
            businessType: this.config.businessType,
            hasSchema: !!document.querySelector('script[type="application/ld+json"]'),
            hasHreflang: !!document.querySelector('link[hreflang]')
        };
    }
}

// Configuración específica para Centro Médico (FÁCIL DE CAMBIAR)
const medicalSEOConfig = {
    siteName: 'Centro Médico San Rafael',
    siteUrl: 'https://www.centromedico.com',
    businessType: 'MedicalOrganization',
    sector: 'medical',
    phone: '+52 55 5661-8420',
    email: 'contacto@centromedico.com',
    address: 'Av. Principal 123',
    city: 'Ciudad de México'
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.seoOptimizer = new SEOOptimizer(medicalSEOConfig);
    });
} else {
    window.seoOptimizer = new SEOOptimizer(medicalSEOConfig);
}

// Exportar para uso global y reutilización
window.SEOOptimizer = SEOOptimizer;
