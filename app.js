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
        // Navigation buttons
        document.addEventListener('click', (e) => {
            if (e.target.id === 'prevBtn' || e.target.closest('#prevBtn')) {
                e.preventDefault();
                this.prevSlide();
            } else if (e.target.id === 'nextBtn' || e.target.closest('#nextBtn')) {
                e.preventDefault();
                this.nextSlide();
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
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchStartX - touchEndX;
            const deltaY = touchStartY - touchEndY;
            
            // Only handle horizontal swipes that are more significant than vertical ones
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        }, { passive: true });
    }
    
    bindTimelineEvents() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('expanded');
            });
        });
    }
    
    bindStrategyHoverEffects() {
        const strategyPillars = document.querySelectorAll('.strategy-pillar');
        strategyPillars.forEach(pillar => {
            pillar.addEventListener('mouseenter', () => {
                pillar.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            pillar.addEventListener('mouseleave', () => {
                pillar.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    bindInteractiveElements() {
        // Add click effects to all cards
        const cards = document.querySelectorAll('.strategy-pillar, .result-card, .audience-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                this.addClickEffect(card);
            });
        });
        
        // Add hover effects to checklist items
        const checklistItems = document.querySelectorAll('.checklist-item');
        checklistItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const icon = item.querySelector('.checklist-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1)';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                const icon = item.querySelector('.checklist-icon');
                if (icon) {
                    icon.style.transform = 'scale(1)';
                }
            });
        });
    }
    
    addClickEffect(element) {
        element.style.transform = 'scale(0.98)';
        setTimeout(() => {
            element.style.transform = '';
        }, 150);
    }
    
    nextSlide() {
        if (this.isAnimating || this.currentSlide >= this.totalSlides) return;
        
        this.isAnimating = true;
        const currentSlideEl = document.querySelector('.slide.active');
        const nextSlideEl = document.querySelector(`[data-slide="${this.currentSlide + 1}"]`);
        
        if (currentSlideEl && nextSlideEl) {
            currentSlideEl.classList.remove('active');
            currentSlideEl.classList.add('prev');
            
            setTimeout(() => {
                currentSlideEl.classList.remove('prev');
            }, 400);
            
            nextSlideEl.classList.add('active');
            
            this.currentSlide++;
            this.updateProgress();
            this.updateSlideCounter();
            this.updateNavigationButtons();
            
            this.animateSlideContent(nextSlideEl);
        }
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 400);
    }
    
    prevSlide() {
        if (this.isAnimating || this.currentSlide <= 1) return;
        
        this.isAnimating = true;
        const currentSlideEl = document.querySelector('.slide.active');
        const prevSlideEl = document.querySelector(`[data-slide="${this.currentSlide - 1}"]`);
        
        if (currentSlideEl && prevSlideEl) {
            currentSlideEl.classList.remove('active');
            
            prevSlideEl.classList.add('active');
            
            this.currentSlide--;
            this.updateProgress();
            this.updateSlideCounter();
            this.updateNavigationButtons();
            
            this.animateSlideContent(prevSlideEl);
        }
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 400);
    }
    
    goToSlide(slideNumber) {
        if (this.isAnimating || slideNumber < 1 || slideNumber > this.totalSlides) return;
        
        this.isAnimating = true;
        const currentSlideEl = document.querySelector('.slide.active');
        const targetSlideEl = document.querySelector(`[data-slide="${slideNumber}"]`);
        
        if (currentSlideEl && targetSlideEl && slideNumber !== this.currentSlide) {
            currentSlideEl.classList.remove('active');
            targetSlideEl.classList.add('active');
            
            this.currentSlide = slideNumber;
            this.updateProgress();
            this.updateSlideCounter();
            this.updateNavigationButtons();
            
            this.animateSlideContent(targetSlideEl);
        }
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 400);
    }
    
    animateSlideContent(slideElement) {
        const animatableElements = slideElement.querySelectorAll(
            '.content-card, .strategy-pillar, .timeline-item, .result-card, .audience-card, .keyword-category, .checklist-item'
        );
        
        animatableElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    updateProgress() {
        const progress = (this.currentSlide / this.totalSlides) * 100;
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }
    
    updateSlideCounter() {
        const currentSlideSpan = document.getElementById('currentSlide');
        const totalSlidesSpan = document.getElementById('totalSlides');
        
        if (currentSlideSpan) {
            currentSlideSpan.textContent = this.currentSlide;
        }
        
        if (totalSlidesSpan) {
            totalSlidesSpan.textContent = this.totalSlides;
        }
    }
    
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentSlide <= 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentSlide >= this.totalSlides;
        }
    }
    
    startCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        const resultNumbers = document.querySelectorAll('.result-number');
        
        const animateCounter = (element, target, suffix = '') => {
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current) + suffix;
            }, 40);
        };
        
        // Animate stat numbers on hero slide
        statNumbers.forEach(element => {
            const target = parseInt(element.dataset.target);
            if (target) {
                setTimeout(() => {
                    animateCounter(element, target);
                }, 1000);
            }
        });
        
        // Animate result numbers when visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const text = element.textContent;
                    const match = text.match(/(\+?)(\d+)(%?)/);
                    
                    if (match) {
                        const prefix = match[1];
                        const target = parseInt(match[2]);
                        const suffix = match[3];
                        
                        animateCounter(element, target, prefix + '' + suffix);
                        observer.unobserve(element);
                    }
                }
            });
        });
        
        resultNumbers.forEach(element => {
            observer.observe(element);
        });
    }
}

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PresentationApp();
    
    // Add some additional interactive features
    document.addEventListener('mousemove', (e) => {
        // Subtle parallax effect for hero background
        const hero = document.querySelector('.hero-slide');
        if (hero && hero.closest('.slide').classList.contains('active')) {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            hero.style.transform = `translate(${x}px, ${y}px)`;
        }
    });
    
    // Add smooth scrolling for internal slide content
    const slideContents = document.querySelectorAll('.slide-content');
    slideContents.forEach(content => {
        content.addEventListener('wheel', (e) => {
            // Allow normal scrolling within slide content
            e.stopPropagation();
        });
    });
});

// Prevent accidental page refresh
window.addEventListener('beforeunload', (e) => {
    e.preventDefault();
    e.returnValue = '';
});

// Add keyboard shortcuts info
document.addEventListener('keydown', (e) => {
    if (e.key === 'h' || e.key === '?') {
        alert('Keyboard Shortcuts:\n\n' +
              'Arrow Keys / Space: Navigate slides\n' +
              'H or ?: Show this help\n' +
              'ESC: Close help');
    }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PresentationApp;
}
