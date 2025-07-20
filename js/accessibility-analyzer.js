/**
 * Accessibility Analyzer
 * "Doctor" que examina tu web y encuentra problemas de accesibilidad
 */

class AccessibilityAnalyzer {
    constructor() {
        this.issues = [];
        this.score = 0;
        this.maxScore = 100;
        this.init();
    }

    init() {
        console.log('♿ Accessibility Analyzer iniciado - Examinando web...');
        this.analyzeAll();
        this.generateReport();
    }

    // Examinar TODA la web
    analyzeAll() {
        this.issues = []; // Limpiar problemas anteriores
        
        // 1. Examinar imágenes
        this.analyzeImages();
        
        // 2. Examinar formularios
        this.analyzeForms();
        
        // 3. Examinar navegación
        this.analyzeNavigation();
        
        // 4. Examinar colores y contraste
        this.analyzeColors();
        
        // 5. Examinar estructura HTML
        this.analyzeStructure();
        
        // 6. Examinar interactividad
        this.analyzeInteractivity();
        
        // Calcular puntuación final
        this.calculateScore();
    }

    // 1. EXAMINAR IMÁGENES
    analyzeImages() {
        const images = document.querySelectorAll('img');
        let imageIssues = 0;
        
        images.forEach((img, index) => {
            // ❌ PROBLEMA: Imagen sin texto alternativo
            if (!img.alt || img.alt.trim() === '') {
                this.addIssue({
                    type: 'error',
                    category: 'Imágenes',
                    element: img,
                    problem: 'Imagen sin texto alternativo (alt)',
                    impact: 'Alto',
                    explanation: 'Las personas ciegas no pueden "ver" esta imagen',
                    solution: 'Agregar descripción en atributo alt=""',
                    example: `<img src="..." alt="Doctor examinando paciente">`
                });
                imageIssues++;
            }
            
            // ❌ PROBLEMA: Alt text muy genérico
            else if (img.alt && (img.alt.includes('image') || img.alt.includes('photo') || img.alt.includes('picture'))) {
                this.addIssue({
                    type: 'warning',
                    category: 'Imágenes',
                    element: img,
                    problem: 'Texto alternativo muy genérico',
                    impact: 'Medio',
                    explanation: 'El alt text debe describir QUÉ se ve, no que es una "imagen"',
                    solution: 'Describir el contenido específico de la imagen'
                });
            }
        });
        
        console.log(`🖼️ Imágenes analizadas: ${images.length}, Problemas: ${imageIssues}`);
    }

    // 2. EXAMINAR FORMULARIOS
    analyzeForms() {
        const inputs = document.querySelectorAll('input, textarea, select');
        let formIssues = 0;
        
        inputs.forEach(input => {
            // ❌ PROBLEMA: Input sin label
            const hasLabel = this.hasAssociatedLabel(input);
            if (!hasLabel) {
                this.addIssue({
                    type: 'error',
                    category: 'Formularios',
                    element: input,
                    problem: 'Campo de formulario sin etiqueta (label)',
                    impact: 'Alto',
                    explanation: 'Los lectores de pantalla no saben qué es este campo',
                    solution: 'Agregar <label> asociado al campo',
                    example: `<label for="email">Email:</label><input id="email" type="email">`
                });
                formIssues++;
            }
            
            // ❌ PROBLEMA: Input requerido sin indicación
            if (input.required && !this.hasRequiredIndicator(input)) {
                this.addIssue({
                    type: 'warning',
                    category: 'Formularios',
                    element: input,
                    problem: 'Campo requerido sin indicación visual',
                    impact: 'Medio',
                    explanation: 'Los usuarios no saben que este campo es obligatorio',
                    solution: 'Agregar asterisco (*) o texto "requerido"'
                });
            }
        });
        
        console.log(`📝 Campos de formulario analizados: ${inputs.length}, Problemas: ${formIssues}`);
    }

    // 3. EXAMINAR NAVEGACIÓN
    analyzeNavigation() {
        let navIssues = 0;
        
        // ❌ PROBLEMA: Enlaces sin texto descriptivo
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            const linkText = link.textContent.trim().toLowerCase();
            if (linkText === 'click here' || linkText === 'read more' || linkText === 'here' || linkText === '') {
                this.addIssue({
                    type: 'warning',
                    category: 'Navegación',
                    element: link,
                    problem: 'Enlace con texto no descriptivo',
                    impact: 'Medio',
                    explanation: 'Los usuarios no saben a dónde los lleva este enlace',
                    solution: 'Usar texto descriptivo como "Agendar cita médica"'
                });
                navIssues++;
            }
        });
        
        // ❌ PROBLEMA: Botones sin texto o aria-label
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            const hasText = button.textContent.trim() !== '';
            const hasAriaLabel = button.getAttribute('aria-label');
            
            if (!hasText && !hasAriaLabel) {
                this.addIssue({
                    type: 'error',
                    category: 'Navegación',
                    element: button,
                    problem: 'Botón sin texto ni aria-label',
                    impact: 'Alto',
                    explanation: 'Los lectores de pantalla no saben qué hace este botón',
                    solution: 'Agregar texto visible o aria-label="descripción"'
                });
                navIssues++;
            }
        });
        
        console.log(`🧭 Elementos de navegación analizados, Problemas: ${navIssues}`);
    }

    // 4. EXAMINAR COLORES Y CONTRASTE
    analyzeColors() {
        // Esta es una versión simplificada
        // En producción usarías una librería para calcular contraste real
        let colorIssues = 0;
        
        // ❌ PROBLEMA: Texto que depende solo del color
        const colorOnlyElements = document.querySelectorAll('.text-danger, .text-success, .text-warning');
        colorOnlyElements.forEach(element => {
            this.addIssue({
                type: 'warning',
                category: 'Colores',
                element: element,
                problem: 'Información transmitida solo por color',
                impact: 'Medio',
                explanation: 'Las personas daltónicas no pueden distinguir esta información',
                solution: 'Agregar iconos o texto adicional además del color'
            });
            colorIssues++;
        });
        
        console.log(`🎨 Elementos de color analizados, Problemas: ${colorIssues}`);
    }

    // 5. EXAMINAR ESTRUCTURA HTML
    analyzeStructure() {
        let structureIssues = 0;
        
        // ❌ PROBLEMA: Falta de headings jerárquicos
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        if (headings.length === 0) {
            this.addIssue({
                type: 'error',
                category: 'Estructura',
                element: document.body,
                problem: 'Página sin encabezados (h1, h2, etc.)',
                impact: 'Alto',
                explanation: 'Los lectores de pantalla usan encabezados para navegar',
                solution: 'Agregar estructura de encabezados jerárquica'
            });
            structureIssues++;
        }
        
        // ❌ PROBLEMA: Múltiples H1
        const h1s = document.querySelectorAll('h1');
        if (h1s.length > 1) {
            this.addIssue({
                type: 'warning',
                category: 'Estructura',
                element: h1s[1],
                problem: 'Múltiples elementos H1 en la página',
                impact: 'Medio',
                explanation: 'Confunde a los lectores de pantalla sobre el tema principal',
                solution: 'Usar solo un H1 por página'
            });
        }
        
        console.log(`🏗️ Estructura HTML analizada, Problemas: ${structureIssues}`);
    }

    // 6. EXAMINAR INTERACTIVIDAD
    analyzeInteractivity() {
        let interactivityIssues = 0;
        
        // ❌ PROBLEMA: Elementos clickeables que no son botones/enlaces
        const clickableElements = document.querySelectorAll('[onclick], .clickable, .btn:not(button):not(a)');
        clickableElements.forEach(element => {
            if (element.tagName !== 'BUTTON' && element.tagName !== 'A') {
                this.addIssue({
                    type: 'warning',
                    category: 'Interactividad',
                    element: element,
                    problem: 'Elemento clickeable que no es botón ni enlace',
                    impact: 'Medio',
                    explanation: 'No es accesible por teclado ni para lectores de pantalla',
                    solution: 'Usar <button> o <a> en su lugar'
                });
                interactivityIssues++;
            }
        });
        
        console.log(`⚡ Elementos interactivos analizados, Problemas: ${interactivityIssues}`);
    }

    // MÉTODOS AUXILIARES
    hasAssociatedLabel(input) {
        // Verificar si tiene label asociado
        const id = input.id;
        if (id) {
            const label = document.querySelector(`label[for="${id}"]`);
            if (label) return true;
        }
        
        // Verificar si está dentro de un label
        const parentLabel = input.closest('label');
        if (parentLabel) return true;
        
        // Verificar aria-label
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

    // Agregar problema encontrado
    addIssue(issue) {
        this.issues.push(issue);
    }

    // Calcular puntuación de accesibilidad
    calculateScore() {
        const totalIssues = this.issues.length;
        const errorIssues = this.issues.filter(issue => issue.type === 'error').length;
        const warningIssues = this.issues.filter(issue => issue.type === 'warning').length;
        
        // Fórmula de puntuación (errores pesan más que warnings)
        const penalty = (errorIssues * 10) + (warningIssues * 5);
        this.score = Math.max(0, this.maxScore - penalty);
        
        console.log(`📊 Puntuación de Accesibilidad: ${this.score}/100`);
        console.log(`❌ Errores: ${errorIssues}, ⚠️ Advertencias: ${warningIssues}`);
    }

    // Generar reporte completo
    generateReport() {
        const report = {
            score: this.score,
            maxScore: this.maxScore,
            totalIssues: this.issues.length,
            errors: this.issues.filter(issue => issue.type === 'error').length,
            warnings: this.issues.filter(issue => issue.type === 'warning').length,
            issues: this.issues,
            recommendations: this.getRecommendations()
        };
        
        // Mostrar resumen en consola
        console.log('♿ REPORTE DE ACCESIBILIDAD:');
        console.log(`📊 Puntuación: ${report.score}/100`);
        console.log(`❌ Errores críticos: ${report.errors}`);
        console.log(`⚠️ Advertencias: ${report.warnings}`);
        console.log('📋 Para ver detalles: window.a11yAnalyzer.getDetailedReport()');
        
        return report;
    }

    // Obtener recomendaciones prioritarias
    getRecommendations() {
        const recommendations = [];
        
        if (this.issues.filter(i => i.category === 'Imágenes').length > 0) {
            recommendations.push('🖼️ Agregar texto alternativo a todas las imágenes');
        }
        
        if (this.issues.filter(i => i.category === 'Formularios').length > 0) {
            recommendations.push('📝 Asociar etiquetas a todos los campos de formulario');
        }
        
        if (this.issues.filter(i => i.category === 'Navegación').length > 0) {
            recommendations.push('🧭 Mejorar textos de enlaces y botones');
        }
        
        return recommendations;
    }

    // Método público para obtener reporte detallado
    getDetailedReport() {
        console.table(this.issues.map(issue => ({
            Categoría: issue.category,
            Problema: issue.problem,
            Impacto: issue.impact,
            Solución: issue.solution
        })));
        
        return this.issues;
    }

    // Método público para obtener puntuación
    getScore() {
        return {
            score: this.score,
            maxScore: this.maxScore,
            percentage: Math.round((this.score / this.maxScore) * 100)
        };
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.a11yAnalyzer = new AccessibilityAnalyzer();
    });
} else {
    window.a11yAnalyzer = new AccessibilityAnalyzer();
}

// Exportar para uso global
window.AccessibilityAnalyzer = AccessibilityAnalyzer;
