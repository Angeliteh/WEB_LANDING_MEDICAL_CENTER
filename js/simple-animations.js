/**
 * Simple Animations - Immediate Visual Feedback
 * Lightweight script to activate visual improvements
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // === NAVBAR SCROLL EFFECT DISABLED ===
    // Navbar now has solid background always for better contrast
    // No scroll animation needed
    const navbar = document.querySelector('.navbar');

    // Ensure navbar always has solid background
    if (navbar) {
        navbar.classList.add('scrolled'); // Apply solid styles immediately
    }
    
    // === SCROLL ANIMATIONS ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll('.timeline-nodes, .reviews-thumb, .featured-circle, .booking-form');
    elementsToAnimate.forEach(el => observer.observe(el));
    
    // === IMMEDIATE VISUAL FEEDBACK ===
    console.log('🎨 Visual improvements loaded!');
    console.log('✅ Navbar solid background active (scroll animation disabled)');
    console.log('✅ Scroll animations active');
    console.log('✅ Hover effects active');
    
    // Add a temporary visual indicator
    const indicator = document.createElement('div');
    indicator.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #247cff;
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-family: Arial, sans-serif;
    `;
    indicator.textContent = '🎨 Mejoras Visuales Activas';
    document.body.appendChild(indicator);
    
    // Remove indicator after 3 seconds
    setTimeout(() => {
        indicator.style.opacity = '0';
        indicator.style.transform = 'translateY(-20px)';
        setTimeout(() => indicator.remove(), 300);
    }, 3000);
    
});

// === THEME TRANSITION OVERLAY ===
document.addEventListener('DOMContentLoaded', function() {
    // Create transition overlay for smooth theme switching
    const overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, rgba(36, 124, 255, 0.05) 0%, transparent 70%);
        opacity: 0;
        pointer-events: none;
        z-index: 9999;
        transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    `;
    document.body.appendChild(overlay);
});
