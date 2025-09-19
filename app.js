class PresentationApp {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 11;
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateProgress();
        this.updateSlideCounter();
        this.updateNavigationButtons();
        this.startCounters();
    }
    
    bindEvents() {
        // Navigation buttons - fix event binding
        document.addEventListener('click', (e) => {
            if (e.target.id === 'prevBtn' || e.target.closest('#prevBtn')) {
                e.preventDefault();
                this.prevSlide();
            } else if (e.target.id === 'nextBtn' || e.target.closest('#nextBtn')) {
                e.preventDefault();
                this.nextSlide();
            } else if (e.target.id === 'contactFab' || e.target.closest('#contactFab')) {
                e.preventDefault();
                this.handleContact();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                this.prevSlide();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
                e.preventDefault();
                this.nextSlide();
            }
        });
        
        // Touch/swipe navigation
        this.bindTouchEvents();
        
        // Add click listeners to timeline items for interactivity
        this.bindTimelineEvents();
        
        // Add hover effects to strategy pillars
        this.bindStrategyHoverEffects();
        
        // Bind additional interactive elements
        this.bindInteractiveElements();
    }
    
    bindTouchEvents() {
        let touchStartX = 0;
        let touchStartY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            if (!touchStartX || !touchStartY) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            
            // Only trigger if horizontal swipe is dominant
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextSlide(); // Swipe left = next
                } else {
                    this.prevSlide(); // Swipe right = previous
                }
            }
            
            touchStartX = 0;
            touchStartY = 0;
        });
    }
    
    bindTimelineEvents() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'scale(1.02)';
                item.style.zIndex = '10';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'scale(1)';
                item.style.zIndex = 'auto';
            });
        });
    }
    
    bindStrategyHoverEffects() {
        const strategyPillars = document.querySelectorAll('.strategy-pillar');
        
        strategyPillars.forEach((pillar) => {
            pillar.addEventListener('mouseenter', () => {
                // Add subtle pulse animation to icon
                const icon = pillar.querySelector('.pillar-icon');
                if (icon) {
                    icon.style.animation = 'pulse 1s infinite';
                }
            });
            
            pillar.addEventListener('mouseleave', () => {
                const icon = pillar.querySelector('.pillar-icon');
                if (icon) {
                    icon.style.animation = 'none';
                }
            });
        });
    }
    
    bindInteractiveElements() {
        // Add hover effects to cards
        const cards = document.querySelectorAll('.summary-card, .kpi-card, .strategy-pillar');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
        
        // Add click effects to buttons
        const buttons = document.querySelectorAll('.btn, .nav-btn');
        
        buttons.forEach(button => {
            button.addEventListener('mousedown', () => {
                button.style.transform = 'scale(0.95)';
            });
            
            button.addEventListener('mouseup', () => {
                button.style.transform = 'scale(1)';
            });
        });
    }
    
    nextSlide() {
        if (this.isAnimating || this.currentSlide >= this.totalSlides) return;
        
        this.isAnimating = true;
        
        const currentSlideEl = document.querySelector('.slide.active');
        this.currentSlide++;
        const targetSlideEl = document.querySelector(`[data-slide="${this.currentSlide}"]`);
        
        this.transitionSlides(currentSlideEl, targetSlideEl, 'next');
    }
    
    prevSlide() {
        if (this.isAnimating || this.currentSlide <= 1) return;
        
        this.isAnimating = true;
        
        const currentSlideEl = document.querySelector('.slide.active');
        this.currentSlide--;
        const targetSlideEl = document.querySelector(`[data-slide="${this.currentSlide}"]`);
        
        this.transitionSlides(currentSlideEl, targetSlideEl, 'prev');
    }
    
    transitionSlides(currentSlide, targetSlide, direction) {
        if (!currentSlide || !targetSlide) {
            this.isAnimating = false;
            return;
        }
        
        // Set initial state for target slide
        targetSlide.style.transform = direction === 'next' ? 'translateX(100%)' : 'translateX(-100%)';
        targetSlide.style.opacity = '0';
        targetSlide.classList.add('active');
        
        // Force reflow
        targetSlide.offsetHeight;
        
        // Animate current slide out
        currentSlide.style.transform = direction === 'next' ? 'translateX(-100%)' : 'translateX(100%)';
        currentSlide.style.opacity = '0';
        
        // Animate target slide in
        targetSlide.style.transform = 'translateX(0)';
        targetSlide.style.opacity = '1';
        
        // Clean up after animation
        setTimeout(() => {
            currentSlide.classList.remove('active');
            currentSlide.style.transform = '';
            currentSlide.style.opacity = '';
            
            targetSlide.style.transform = '';
            targetSlide.style.opacity = '';
            
            this.isAnimating = false;
            
            // Update UI and trigger animations
            this.updateProgress();
            this.updateSlideCounter();
            this.updateNavigationButtons();
            this.triggerSlideAnimations(this.currentSlide);
            
        }, 600);
    }
    
    updateProgress() {
        const progressBar = document.getElementById('progressBar');
        const progress = (this.currentSlide / this.totalSlides) * 100;
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }
    
    updateSlideCounter() {
        const currentSlideSpan = document.getElementById('currentSlide');
        const totalSlidesSpan = document.getElementById('totalSlides');
        
        if (currentSlideSpan) currentSlideSpan.textContent = this.currentSlide;
        if (totalSlidesSpan) totalSlidesSpan.textContent = this.totalSlides;
    }
    
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentSlide <= 1;
            prevBtn.style.opacity = this.currentSlide <= 1 ? '0.5' : '1';
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentSlide >= this.totalSlides;
            nextBtn.style.opacity = this.currentSlide >= this.totalSlides ? '0.5' : '1';
        }
    }
    
    triggerSlideAnimations(slideNumber) {
        // Wait for slide transition to complete
        setTimeout(() => {
            switch (slideNumber) {
                case 1:
                    // Hero slide - animate stats
                    this.animateCounters('.hero-stats .stat-number');
                    break;
                case 8:
                    // Technical SEO - animate progress bars
                    this.animateProgressBars();
                    break;
                case 9:
                    // Timeline - stagger timeline items
                    this.animateTimeline();
                    break;
                case 10:
                    // Results - animate KPI counters and growth bars
                    this.animateCounters('.kpi-number .counter');
                    this.animateGrowthBars();
                    break;
            }
        }, 200);
    }
    
    animateCounters(selector) {
        const counters = document.querySelectorAll(selector);
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target')) || 0;
            let current = 0;
            const increment = target / 60; // 60 frames for 1 second at 60fps
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }
    
    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar-small');
        
        progressBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.opacity = '1';
                bar.style.transform = 'scaleX(1)';
            }, index * 200);
        });
    }
    
    animateTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-50px)';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
                item.style.transition = 'all 0.6s ease-out';
            }, index * 300);
        });
    }
    
    animateGrowthBars() {
        const growthBars = document.querySelectorAll('.growth-bar');
        
        growthBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.opacity = '1';
                bar.style.animationPlayState = 'running';
            }, index * 200);
        });
    }
    
    startCounters() {
        // Animate counters on hero slide immediately
        setTimeout(() => {
            this.animateCounters('.hero-stats .stat-number');
        }, 1500);
    }
    
    handleContact() {
        // Enhanced contact functionality with better UX
        const messages = [
            "Hi! Ready to discuss your SEO strategy?",
            "Let's talk about growing your B2B SaaS pipeline!",
            "Questions about our 6-pillar approach?",
            "Ready to see 3x pipeline growth?"
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        // Show animated notification instead of alert
        this.showNotification(`💬 ${randomMessage}\n\nChat widget would open here. Contact us to discuss your SEO needs!`, 'success');
        
        // Add visual feedback to FAB
        const fab = document.getElementById('contactFab');
        if (fab) {
            fab.style.transform = 'scale(0.9)';
            setTimeout(() => {
                fab.style.transform = 'scale(1)';
            }, 150);
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(34, 197, 94, 0.95)' : 'rgba(59, 130, 246, 0.95)'};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            max-width: 350px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
        
        // Allow manual dismissal
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }
    
    // Add method to go to specific slide
    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides || slideNumber === this.currentSlide) return;
        
        if (this.isAnimating) return;
        
        const currentSlideEl = document.querySelector('.slide.active');
        const targetSlideEl = document.querySelector(`[data-slide="${slideNumber}"]`);
        const direction = slideNumber > this.currentSlide ? 'next' : 'prev';
        
        this.currentSlide = slideNumber;
        this.transitionSlides(currentSlideEl, targetSlideEl, direction);
    }
    
    // Utility method to add typing animation effect
    typeWriter(element, text, speed = 100) {
        if (!element) return;
        
        let i = 0;
        element.textContent = '';
        
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, speed);
    }
    
    // Add intersection observer for scroll-based animations
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements that should animate on scroll
        document.querySelectorAll('.summary-card, .strategy-pillar, .kpi-card').forEach(el => {
            observer.observe(el);
        });
    }
    
    // Add keyboard shortcuts info
    showKeyboardShortcuts() {
        const shortcuts = `
🎯 Keyboard Shortcuts:
• Arrow Keys: Navigate slides
• Space: Next slide
• ESC: Show this help

🖱️ Mouse Controls:
• Click navigation arrows
• Click buttons and cards
• Swipe on mobile devices

💡 Tips:
• Hover over cards for animations
• All buttons are interactive
• Progress bar shows current position
        `;
        
        this.showNotification(shortcuts, 'info');
    }
}

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const presentation = new PresentationApp();
    
    // Make presentation available globally for debugging
    window.presentation = presentation;
    
    // Add CSS animations dynamically
    const style = document.createElement('style');
    style.textContent = `
        /* Enhanced slide transitions */
        .slide {
            will-change: transform, opacity;
            transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease;
        }
        
        .slide.active .slide-content {
            animation: slideContentIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        @keyframes slideContentIn {
            0% {
                opacity: 0;
                transform: translateY(30px) scale(0.98);
            }
            100% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        /* Enhanced hover effects */
        .summary-card, .kpi-card, .strategy-pillar {
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .summary-card:hover .card-icon {
            transform: scale(1.2) rotate(10deg);
            transition: transform 0.3s ease;
        }
        
        .strategy-pillar:hover .pillar-icon {
            transform: scale(1.1);
            filter: brightness(1.2);
            transition: all 0.3s ease;
        }
        
        /* Button animations */
        .btn, .nav-btn {
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        /* Timeline animations */
        .timeline-item {
            transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .timeline-item:hover {
            transform: translateX(10px) scale(1.02);
        }
        
        /* Progress bar animations */
        .progress-bar-small {
            transform-origin: left center;
            transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        /* Enhanced floating contact button */
        .contact-fab {
            animation: float 3s ease-in-out infinite;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        @keyframes float {
            0%, 100% { 
                transform: translateY(0px); 
            }
            50% { 
                transform: translateY(-8px); 
            }
        }
        
        .contact-fab:hover {
            animation-play-state: paused;
            transform: translateY(-5px) scale(1.1);
        }
        
        /* Growth bar animations */
        .growth-bar {
            animation-fill-mode: both;
        }
        
        /* Notification styles */
        .notification {
            font-size: 14px;
            line-height: 1.5;
            white-space: pre-line;
            cursor: pointer;
        }
        
        /* Responsive animations */
        @media (max-width: 768px) {
            .slide.active .slide-content {
                animation: slideContentInMobile 0.6s ease-out;
            }
            
            @keyframes slideContentInMobile {
                0% {
                    opacity: 0;
                    transform: translateY(20px);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .timeline-item:hover {
                transform: none;
            }
            
            .summary-card:hover,
            .kpi-card:hover,
            .strategy-pillar:hover {
                transform: translateY(-2px);
            }
        }
        
        /* Loading states */
        .btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none !important;
        }
        
        /* Focus states for accessibility */
        .btn:focus-visible,
        .nav-btn:focus-visible {
            outline: 2px solid rgba(59, 130, 246, 0.8);
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize scroll animations
    presentation.initScrollAnimations();
    
    // Add ESC key handler for help
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            presentation.showKeyboardShortcuts();
        }
    });
    
    // Add smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Performance optimization: preload next slide content
    const preloadSlides = () => {
        for (let i = 1; i <= presentation.totalSlides; i++) {
            const slide = document.querySelector(`[data-slide="${i}"]`);
            if (slide) {
                // Force render to improve performance
                slide.style.willChange = 'transform, opacity';
            }
        }
    };
    
    setTimeout(preloadSlides, 1000);
    
    console.log('🚀 SEO Proposal Presentation Ready!');
    console.log('✨ Features:');
    console.log('  • Use arrow keys or navigation buttons');
    console.log('  • Interactive hover effects on cards');
    console.log('  • Animated counters and progress bars');
    console.log('  • Touch/swipe support on mobile');
    console.log('  • Press ESC for keyboard shortcuts');
    console.log('  • All buttons are fully functional');
});