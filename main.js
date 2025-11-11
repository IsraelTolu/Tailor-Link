// ===================================
// TailorLink Main JavaScript
// ===================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    initNavigation();
    initScrollEffects();
    initMobileMenu();
    initSmoothScroll();
    initAnimations();
    initButtons();
});

// ===================================
// Navigation Functions
// ===================================
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Handle scroll effect on navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Update active nav link based on scroll position
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===================================
// Mobile Menu Functions
// ===================================
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navButtons = document.querySelector('.nav-buttons');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            
            // Toggle mobile menu
            if (navLinks) {
                navLinks.classList.toggle('mobile-active');
            }
            if (navButtons) {
                navButtons.classList.toggle('mobile-active');
            }
            
            // Animate hamburger icon
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(10px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close mobile menu when clicking on a link
        const allNavLinks = document.querySelectorAll('.nav-link');
        allNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    mobileMenuToggle.classList.remove('active');
                    if (navLinks) navLinks.classList.remove('mobile-active');
                    if (navButtons) navButtons.classList.remove('mobile-active');
                    
                    const spans = mobileMenuToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            });
        });
    }
}

// ===================================
// Smooth Scroll Functions
// ===================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// Scroll Animation Functions
// ===================================
function initScrollEffects() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.stat-item, .value-card, .feature-card, .step-card, .about-content, .about-image'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ===================================
// Animation Functions
// ===================================
function initAnimations() {
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero-background img');
    
    if (hero && heroBackground) {
        window.addEventListener('scroll', function() {
            const scrolled = window.scrollY;
            const parallaxSpeed = 0.5;
            
            if (scrolled < hero.offsetHeight) {
                heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        });
    }
    
    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;
    
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    function animateCounters() {
        statNumbers.forEach(stat => {
            const text = stat.textContent;
            const hasPlus = text.includes('+');
            const hasStar = text.includes('★');
            const hasPercent = text.includes('%');
            
            let number = parseFloat(text.replace(/[^0-9.]/g, ''));
            const duration = 2000;
            const increment = number / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                
                if (current >= number) {
                    current = number;
                    clearInterval(timer);
                }
                
                let displayValue = Math.floor(current);
                
                if (text.includes('K')) {
                    displayValue = Math.floor(current) + 'K';
                } else if (hasStar) {
                    displayValue = current.toFixed(1) + '★';
                } else if (hasPercent) {
                    displayValue = Math.floor(current) + '%';
                }
                
                if (hasPlus && !hasStar && !hasPercent) {
                    displayValue += '+';
                }
                
                stat.textContent = displayValue;
            }, 16);
        });
    }
}

// ===================================
// Button Click Handlers
// ===================================
function initButtons() {
    // Get Started buttons
    const getStartedButtons = document.querySelectorAll('.btn-primary');
    getStartedButtons.forEach(button => {
        if (button.textContent.includes('Get Started') || 
            button.textContent.includes('Get Bookings')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                // Navigate to bookings page
                window.location.href = 'bookings.html';
            });
        }
    });
    
    // Browse Tailors buttons
    const browseTailorsButtons = document.querySelectorAll('.btn-secondary, .btn');
    browseTailorsButtons.forEach(button => {
        if (button.textContent.includes('Browse Tailors') || 
            button.textContent.includes('Browse Designers')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                // Navigate to browse tailors page
                window.location.href = 'browse_tailor.html';
            });
        }
    });
    
    // Login button
    const loginButtons = document.querySelectorAll('.btn-outline');
    loginButtons.forEach(button => {
        if (button.textContent.includes('Login')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                // Show login modal or navigate to login page
                alert('Login functionality will be implemented here');
            });
        }
    });
    
    // Join as Tailor/Customer buttons
    const joinButtons = document.querySelectorAll('.btn');
    joinButtons.forEach(button => {
        if (button.textContent.includes('Join as')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const userType = button.textContent.includes('Tailor') ? 'tailor' : 'customer';
                alert(`Join as ${userType} functionality will be implemented here`);
            });
        }
    });
}

// ===================================
// Utility Functions
// ===================================

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===================================
// Page Visibility API
// ===================================
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden
        console.log('Page is hidden');
    } else {
        // Page is visible
        console.log('Page is visible');
    }
});

// ===================================
// Performance Monitoring
// ===================================
window.addEventListener('load', function() {
    // Log page load time
    const loadTime = window.performance.timing.domContentLoadedEventEnd - 
                     window.performance.timing.navigationStart;
    console.log(`Page loaded in ${loadTime}ms`);
});

// ===================================
// Error Handling
// ===================================
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
});

// ===================================
// Resize Handler
// ===================================
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Handle resize events
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        const navButtons = document.querySelector('.nav-buttons');
        
        // Reset mobile menu on desktop
        if (window.innerWidth > 768) {
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
            if (navLinks) navLinks.classList.remove('mobile-active');
            if (navButtons) navButtons.classList.remove('mobile-active');
        }
    }, 250);
});

// ===================================
// Export functions for testing
// ===================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavigation,
        initMobileMenu,
        initSmoothScroll,
        initScrollEffects,
        initAnimations,
        initButtons
    };
}
