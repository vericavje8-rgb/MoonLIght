/**
 * MoonLight Restaurant - Performance Enhancements
 * Works with existing CSS - adds lazy loading, image optimization, and monitoring
 */

class MoonLightEnhancer {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.enhance());
        } else {
            this.enhance();
        }
    }

    enhance() {
        this.optimizeImages();
        this.addSmoothScrolling();
        this.optimizeAnimations();
        this.monitorPerformance();
        this.addBackToTop();
        this.optimizeMenuIfPresent();
        console.log('🚀 MoonLight performance enhancements loaded');
    }

    /**
     * Optimize images with lazy loading
     */
    optimizeImages() {
        // Convert existing images to lazy loading
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add fade-in effect when loaded
            img.addEventListener('load', () => {
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                setTimeout(() => img.style.opacity = '1', 10);
            });
        });

        // Optimize background images for mobile
        this.optimizeBackgroundImages();
    }

    /**
     * Optimize background images for mobile
     */
    optimizeBackgroundImages() {
        const hero = document.querySelector('.hero');
        if (hero && window.innerWidth < 768) {
            hero.style.backgroundAttachment = 'scroll';
        }
    }

    /**
     * Add smooth scrolling to all anchor links
     */
    addSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Add scroll-triggered animations to existing elements
     */
    optimizeAnimations() {
        // Add animation classes to service items and highlights
        const animatableElements = document.querySelectorAll(
            '.service-item, .highlight-item, .contact-info, .map-container, ' +
            '.hero-content h1, .hero-content p, .section-title'
        );

        // Create intersection observer for scroll animations
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '0';
                        entry.target.style.transform = 'translateY(20px)';
                        entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, parseInt(entry.target.dataset.delay) || 0);
                        
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '0px 0px -50px 0px',
                threshold: 0.1
            });

            animatableElements.forEach((el, index) => {
                el.dataset.delay = (index % 3) * 100; // Stagger animations
                observer.observe(el);
            });
        }
    }

    /**
     * Monitor performance metrics
     */
    monitorPerformance() {
        // Core Web Vitals monitoring
        if ('PerformanceObserver' in window) {
            try {
                // LCP (Largest Contentful Paint)
                new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log(`📊 LCP: ${Math.round(lastEntry.startTime)}ms`);
                }).observe({entryTypes: ['largest-contentful-paint']});

                // FID (First Input Delay)
                new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        const delay = entry.processingStart - entry.startTime;
                        console.log(`⚡ FID: ${Math.round(delay)}ms`);
                    });
                }).observe({entryTypes: ['first-input']});

                // CLS (Cumulative Layout Shift)
                let clsScore = 0;
                new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        if (!entry.hadRecentInput) {
                            clsScore += entry.value;
                            console.log(`📐 CLS: ${clsScore.toFixed(4)}`);
                        }
                    });
                }).observe({entryTypes: ['layout-shift']});
            } catch(e) {
                console.log('Performance monitoring not supported');
            }
        }

        // Basic timing
        window.addEventListener('load', () => {
            setTimeout(() => {
                const timing = performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                console.log(`⏱️ Total load time: ${loadTime}ms`);
            }, 100);
        });
    }

    /**
     * Add back to top button
     */
    addBackToTop() {
        // Create button if it doesn't exist
        let backToTop = document.querySelector('.back-to-top');
        if (!backToTop) {
            backToTop = document.createElement('button');
            backToTop.className = 'back-to-top';
            backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
            backToTop.setAttribute('aria-label', 'Back to top');
            document.body.appendChild(backToTop);

            // Add CSS styles
            const style = document.createElement('style');
            style.textContent = `
                .back-to-top {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    background: var(--gold, #c9a961);
                    color: var(--primary, #2d1810);
                    border: none;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    font-size: 1.2rem;
                    cursor: pointer;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                    z-index: 1000;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                }
                .back-to-top.visible {
                    opacity: 1;
                    visibility: visible;
                }
                .back-to-top:hover {
                    background: var(--primary, #2d1810);
                    color: var(--gold, #c9a961);
                    transform: translateY(-3px);
                }
                @media (max-width: 768px) {
                    .back-to-top {
                        bottom: 1rem;
                        right: 1rem;
                        width: 45px;
                        height: 45px;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Show/hide button based on scroll
        let throttled = false;
        window.addEventListener('scroll', () => {
            if (!throttled) {
                requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset > 500;
                    backToTop.classList.toggle('visible', scrolled);
                    throttled = false;
                });
                throttled = true;
            }
        });

        // Smooth scroll to top
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * Optimize menu functionality if present
     */
    optimizeMenuIfPresent() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const menuItems = document.querySelectorAll('.menu-item');

        if (filterButtons.length > 0 && menuItems.length > 0) {
            this.optimizeMenuFiltering(filterButtons, menuItems);
        }
    }

    /**
     * Optimize menu filtering with better performance
     */
    optimizeMenuFiltering(filterButtons, menuItems) {
        let isAnimating = false;

        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (isAnimating) return;
                
                isAnimating = true;
                const filter = btn.dataset.filter;
                
                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Animate items efficiently
                this.animateMenuItems(filter, menuItems, () => {
                    isAnimating = false;
                });
            });
        });
    }

    /**
     * Animate menu items with optimal performance
     */
    animateMenuItems(filter, menuItems, callback) {
        const showItems = [];
        const hideItems = [];

        // Categorize items
        menuItems.forEach(item => {
            const shouldShow = filter === 'all' || item.classList.contains(filter);
            if (shouldShow && item.style.display === 'none') {
                showItems.push(item);
            } else if (!shouldShow && item.style.display !== 'none') {
                hideItems.push(item);
            }
        });

        // Hide items first
        hideItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => item.style.display = 'none', 200);
            }, index * 50);
        });

        // Show items after hiding completes
        setTimeout(() => {
            showItems.forEach((item, index) => {
                item.style.display = 'block';
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, index * 100 + 100);
            });
            
            setTimeout(callback, showItems.length * 100 + 300);
        }, hideItems.length * 50 + 200);
    }
}

// Initialize performance enhancements
new MoonLightEnhancer();

// Export for potential external use
window.MoonLightEnhancer = MoonLightEnhancer;
            }
        };
    }
}

// Initialize performance optimizations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new MoonLightPerformance());
} else {
    new MoonLightPerformance();
}

// Export for use in other modules
window.MoonLightPerformance = MoonLightPerformance;