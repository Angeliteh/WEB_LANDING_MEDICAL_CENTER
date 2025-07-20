/**
 * Security Analyzer
 * "Detective de seguridad" que examina vulnerabilidades en la web
 */

class SecurityAnalyzer {
    constructor() {
        this.vulnerabilities = [];
        this.securityScore = 0;
        this.maxScore = 100;
        this.securityHeaders = {};
        this.init();
    }

    init() {
        console.log('🔒 Security Analyzer iniciado - Examinando vulnerabilidades...');
        this.analyzeAll();
        this.generateSecurityReport();
    }

    // Examinar TODA la seguridad de la web
    async analyzeAll() {
        this.vulnerabilities = []; // Limpiar vulnerabilidades anteriores
        
        // 1. Examinar headers de seguridad
        await this.analyzeSecurityHeaders();
        
        // 2. Examinar formularios (vulnerabilidades XSS/CSRF)
        this.analyzeFormSecurity();
        
        // 3. Examinar enlaces externos
        this.analyzeExternalLinks();
        
        // 4. Examinar contenido mixto (HTTP/HTTPS)
        this.analyzeMixedContent();
        
        // 5. Examinar cookies de seguridad
        this.analyzeCookieSecurity();
        
        // 6. Examinar JavaScript inline
        this.analyzeInlineScripts();
        
        // Calcular puntuación de seguridad
        this.calculateSecurityScore();
    }

    // 1. EXAMINAR HEADERS DE SEGURIDAD
    async analyzeSecurityHeaders() {
        console.log('🛡️ Analizando headers de seguridad...');
        
        try {
            // Simular verificación de headers (en producción se haría con fetch)
            // Por ahora verificamos qué headers faltan
            
            const requiredHeaders = {
                'Content-Security-Policy': 'Previene ataques XSS',
                'X-Frame-Options': 'Previene clickjacking',
                'X-Content-Type-Options': 'Previene MIME sniffing',
                'Referrer-Policy': 'Controla información de referencia',
                'Permissions-Policy': 'Controla APIs del navegador',
                'Strict-Transport-Security': 'Fuerza HTTPS'
            };

            // Verificar cada header requerido
            for (const [header, purpose] of Object.entries(requiredHeaders)) {
                if (!this.hasSecurityHeader(header)) {
                    this.addVulnerability({
                        type: 'critical',
                        category: 'Security Headers',
                        vulnerability: `Falta header: ${header}`,
                        impact: 'Alto',
                        explanation: purpose,
                        solution: `Agregar header ${header} al servidor`,
                        example: this.getHeaderExample(header)
                    });
                }
            }
            
        } catch (error) {
            console.error('Error analizando headers:', error);
        }
    }

    // 2. EXAMINAR SEGURIDAD DE FORMULARIOS
    analyzeFormSecurity() {
        console.log('📝 Analizando seguridad de formularios...');
        
        const forms = document.querySelectorAll('form');
        let formVulnerabilities = 0;
        
        forms.forEach((form, index) => {
            // ❌ VULNERABILIDAD: Formulario sin CSRF protection
            if (!this.hasCSRFProtection(form)) {
                this.addVulnerability({
                    type: 'warning',
                    category: 'Formularios',
                    vulnerability: 'Formulario sin protección CSRF',
                    impact: 'Medio',
                    explanation: 'Vulnerable a ataques Cross-Site Request Forgery',
                    solution: 'Agregar token CSRF al formulario',
                    example: '<input type="hidden" name="csrf_token" value="random_token">'
                });
                formVulnerabilities++;
            }
            
            // ❌ VULNERABILIDAD: Formulario sin validación client-side
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                if (input.type === 'email' && !input.pattern && !input.required) {
                    this.addVulnerability({
                        type: 'info',
                        category: 'Formularios',
                        vulnerability: 'Campo email sin validación estricta',
                        impact: 'Bajo',
                        explanation: 'Puede permitir datos malformados',
                        solution: 'Agregar pattern y required al campo email'
                    });
                }
            });
        });
        
        console.log(`📝 Formularios analizados: ${forms.length}, Vulnerabilidades: ${formVulnerabilities}`);
    }

    // 3. EXAMINAR ENLACES EXTERNOS
    analyzeExternalLinks() {
        console.log('🔗 Analizando enlaces externos...');
        
        const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
        let linkVulnerabilities = 0;
        
        externalLinks.forEach(link => {
            // ❌ VULNERABILIDAD: Enlace externo sin rel="noopener"
            if (!link.rel.includes('noopener')) {
                this.addVulnerability({
                    type: 'warning',
                    category: 'Enlaces Externos',
                    vulnerability: 'Enlace externo sin rel="noopener"',
                    impact: 'Medio',
                    explanation: 'Puede permitir acceso al objeto window de tu sitio',
                    solution: 'Agregar rel="noopener noreferrer" a enlaces externos',
                    example: '<a href="external-site.com" rel="noopener noreferrer">Enlace</a>'
                });
                linkVulnerabilities++;
            }
            
            // ❌ VULNERABILIDAD: Enlace a HTTP desde HTTPS
            if (window.location.protocol === 'https:' && link.href.startsWith('http:')) {
                this.addVulnerability({
                    type: 'critical',
                    category: 'Enlaces Externos',
                    vulnerability: 'Enlace HTTP desde página HTTPS',
                    impact: 'Alto',
                    explanation: 'Contenido mixto - compromete la seguridad HTTPS',
                    solution: 'Cambiar enlace a HTTPS o usar protocolo relativo'
                });
            }
        });
        
        console.log(`🔗 Enlaces externos analizados: ${externalLinks.length}, Vulnerabilidades: ${linkVulnerabilities}`);
    }

    // 4. EXAMINAR CONTENIDO MIXTO
    analyzeMixedContent() {
        console.log('🔀 Analizando contenido mixto...');
        
        if (window.location.protocol === 'https:') {
            // Verificar imágenes HTTP
            const httpImages = document.querySelectorAll('img[src^="http:"]');
            if (httpImages.length > 0) {
                this.addVulnerability({
                    type: 'warning',
                    category: 'Contenido Mixto',
                    vulnerability: `${httpImages.length} imágenes cargadas por HTTP`,
                    impact: 'Medio',
                    explanation: 'Contenido no seguro en página HTTPS',
                    solution: 'Cambiar URLs de imágenes a HTTPS'
                });
            }
            
            // Verificar scripts HTTP
            const httpScripts = document.querySelectorAll('script[src^="http:"]');
            if (httpScripts.length > 0) {
                this.addVulnerability({
                    type: 'critical',
                    category: 'Contenido Mixto',
                    vulnerability: `${httpScripts.length} scripts cargados por HTTP`,
                    impact: 'Crítico',
                    explanation: 'Scripts no seguros pueden comprometer toda la página',
                    solution: 'Cambiar URLs de scripts a HTTPS'
                });
            }
        }
    }

    // 5. EXAMINAR COOKIES DE SEGURIDAD
    analyzeCookieSecurity() {
        console.log('🍪 Analizando seguridad de cookies...');
        
        const cookies = document.cookie.split(';');
        
        if (cookies.length > 1) { // Si hay cookies
            // En una implementación real, verificaríamos flags Secure y HttpOnly
            // Por ahora, agregamos recomendación general
            this.addVulnerability({
                type: 'info',
                category: 'Cookies',
                vulnerability: 'Cookies sin flags de seguridad verificados',
                impact: 'Bajo',
                explanation: 'Las cookies deben tener flags Secure y HttpOnly',
                solution: 'Configurar cookies con flags de seguridad en el servidor',
                example: 'Set-Cookie: sessionid=abc123; Secure; HttpOnly; SameSite=Strict'
            });
        }
    }

    // 6. EXAMINAR JAVASCRIPT INLINE
    analyzeInlineScripts() {
        console.log('📜 Analizando JavaScript inline...');
        
        // Verificar scripts inline
        const inlineScripts = document.querySelectorAll('script:not([src])');
        let inlineCount = 0;
        
        inlineScripts.forEach(script => {
            if (script.textContent.trim().length > 0) {
                inlineCount++;
            }
        });
        
        if (inlineCount > 0) {
            this.addVulnerability({
                type: 'warning',
                category: 'JavaScript',
                vulnerability: `${inlineCount} scripts inline detectados`,
                impact: 'Medio',
                explanation: 'Scripts inline dificultan implementar CSP estricto',
                solution: 'Mover JavaScript a archivos externos',
                example: 'Usar <script src="archivo.js"></script> en lugar de <script>código</script>'
            });
        }
        
        // Verificar event handlers inline
        const inlineHandlers = document.querySelectorAll('[onclick], [onload], [onerror]');
        if (inlineHandlers.length > 0) {
            this.addVulnerability({
                type: 'warning',
                category: 'JavaScript',
                vulnerability: `${inlineHandlers.length} event handlers inline`,
                impact: 'Medio',
                explanation: 'Event handlers inline son vulnerables a XSS',
                solution: 'Usar addEventListener en archivos JavaScript externos'
            });
        }
    }

    // MÉTODOS AUXILIARES
    hasSecurityHeader(headerName) {
        // En desarrollo local, asumimos que no hay headers de seguridad
        // En producción, esto se verificaría con una petición fetch
        return false;
    }

    hasCSRFProtection(form) {
        // Verificar si el formulario tiene token CSRF
        const csrfToken = form.querySelector('input[name*="csrf"], input[name*="token"]');
        return !!csrfToken;
    }

    getHeaderExample(headerName) {
        const examples = {
            'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'",
            'X-Frame-Options': 'DENY',
            'X-Content-Type-Options': 'nosniff',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
        };
        return examples[headerName] || 'Consultar documentación';
    }

    // Agregar vulnerabilidad encontrada
    addVulnerability(vulnerability) {
        this.vulnerabilities.push(vulnerability);
    }

    // Calcular puntuación de seguridad
    calculateSecurityScore() {
        const totalVulnerabilities = this.vulnerabilities.length;
        const criticalVulnerabilities = this.vulnerabilities.filter(v => v.type === 'critical').length;
        const warningVulnerabilities = this.vulnerabilities.filter(v => v.type === 'warning').length;
        const infoVulnerabilities = this.vulnerabilities.filter(v => v.type === 'info').length;
        
        // Fórmula de puntuación (críticos pesan más)
        const penalty = (criticalVulnerabilities * 20) + (warningVulnerabilities * 10) + (infoVulnerabilities * 5);
        this.securityScore = Math.max(0, this.maxScore - penalty);
        
        console.log(`🔒 Puntuación de Seguridad: ${this.securityScore}/100`);
        console.log(`🚨 Críticas: ${criticalVulnerabilities}, ⚠️ Advertencias: ${warningVulnerabilities}, ℹ️ Info: ${infoVulnerabilities}`);
    }

    // Generar reporte de seguridad
    generateSecurityReport() {
        const report = {
            securityScore: this.securityScore,
            maxScore: this.maxScore,
            totalVulnerabilities: this.vulnerabilities.length,
            critical: this.vulnerabilities.filter(v => v.type === 'critical').length,
            warnings: this.vulnerabilities.filter(v => v.type === 'warning').length,
            info: this.vulnerabilities.filter(v => v.type === 'info').length,
            vulnerabilities: this.vulnerabilities,
            recommendations: this.getSecurityRecommendations()
        };
        
        // Mostrar resumen en consola
        console.log('🔒 REPORTE DE SEGURIDAD:');
        console.log(`📊 Puntuación: ${report.securityScore}/100`);
        console.log(`🚨 Vulnerabilidades críticas: ${report.critical}`);
        console.log(`⚠️ Advertencias: ${report.warnings}`);
        console.log(`ℹ️ Información: ${report.info}`);
        console.log('📋 Para ver detalles: window.securityAnalyzer.getDetailedReport()');
        
        return report;
    }

    // Obtener recomendaciones prioritarias
    getSecurityRecommendations() {
        const recommendations = [];
        
        if (this.vulnerabilities.filter(v => v.category === 'Security Headers').length > 0) {
            recommendations.push('🛡️ Implementar headers de seguridad básicos');
        }
        
        if (this.vulnerabilities.filter(v => v.category === 'Formularios').length > 0) {
            recommendations.push('📝 Agregar protección CSRF a formularios');
        }
        
        if (this.vulnerabilities.filter(v => v.category === 'Enlaces Externos').length > 0) {
            recommendations.push('🔗 Asegurar enlaces externos con rel="noopener"');
        }
        
        return recommendations;
    }

    // Método público para obtener reporte detallado
    getDetailedReport() {
        console.table(this.vulnerabilities.map(vuln => ({
            Categoría: vuln.category,
            Vulnerabilidad: vuln.vulnerability,
            Impacto: vuln.impact,
            Solución: vuln.solution
        })));
        
        return this.vulnerabilities;
    }

    // Método público para obtener puntuación
    getSecurityScore() {
        return {
            score: this.securityScore,
            maxScore: this.maxScore,
            percentage: Math.round((this.securityScore / this.maxScore) * 100),
            level: this.getSecurityLevel()
        };
    }

    getSecurityLevel() {
        if (this.securityScore >= 90) return 'Excelente';
        if (this.securityScore >= 70) return 'Buena';
        if (this.securityScore >= 50) return 'Regular';
        return 'Necesita mejoras urgentes';
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.securityAnalyzer = new SecurityAnalyzer();
    });
} else {
    window.securityAnalyzer = new SecurityAnalyzer();
}

// Exportar para uso global
window.SecurityAnalyzer = SecurityAnalyzer;
