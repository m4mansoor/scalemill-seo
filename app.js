class PresentationApp {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 11;
        this.isAnimating = false;
        this.carousels = {};
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateProgress();
        this.updateSlideCounter();
        this.updateNavigationButtons();
        this.startCounters();
        this.initCarousels();
    }

    // Initialize all carousels
    initCarousels() {
        this.initSummaryCarousel();
        this.initICPCarousel(); 
        this.initStrategyCarousel();
        this.initKPICarousel();
    }

    initSummaryCarousel() {
        const carousel = document.querySelector('.summary-grid-carousel');
        if (!carousel) return;
        
        this.carousels.summary = {
            currentIndex: 0,
            track: carousel.querySelector('.carousel-track'),
            dots: carousel.querySelectorAll('.carousel-dot'),
            totalItems: 2
        };
        
        this.bindCarouselEvents('summary');
    }

    initICPCarousel() {
        const carousel = document.querySelector('.icp-carousel');
        if (!carousel) return;
        
        this.carousels.icp = {
            currentIndex: 0,
            track: carousel.querySelector('.carousel-track'),
            dots: carousel.querySelectorAll('.carousel-dot'),
            totalItems: 3
        };
        
        this.bindCarouselEvents('icp');
    }

    initStrategyCarousel() {
        const carousel = document.querySelector('.strategy-carousel');
        if (!carousel) return;
        
        this.carousels.strategy = {
            currentIndex: 0,
            track: carousel.querySelector('.carousel-track'),
            dots: carousel.querySelectorAll('.carousel-dot'),
            totalItems: 2
        };
        
        this.bindCarouselEvents('strategy');
    }

    initKPICarousel() {
        const carousel = document.querySelector('.kpi-carousel');
        if (!carousel) return;
        
        this.carousels.kpi = {
            currentIndex: 0,
            track: carousel.querySelector('.carousel-track'),
            dots: carousel.querySelectorAll('.carousel-dot'),
            totalItems: 2
        };
        
        this.bindCarouselEvents('kpi');
    }

    bindCarouselEvents(carouselName) {
        const carousel = this.carousels[carouselName];
        if (!carousel || !carousel.dots) return;
        
        carousel.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToCarouselItem(carouselName, index);
            });
        });
        
        // Add touch/swipe support
        if (carousel.track) {
            this.bindCarouselTouchEvents(carouselName);
        }
    }

    bindCarouselTouchEvents(carouselName) {
        const carousel = this.carousels[carouselName];
        let startX = 0;
        
        carousel.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        carousel.track.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextCarouselItem(carouselName);
                } else {
                    this.prevCarouselItem(carouselName);
                }
            }
        });
    }

    goToCarouselItem(carouselName, index) {
        const carousel = this.carousels[carouselName];
        if (!carousel || index < 0 || index >= carousel.totalItems) return;
        
        carousel.currentIndex = index;
        const translateX = -carousel.currentIndex * 100;
        carousel.track.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        carousel.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    nextCarouselItem(carouselName) {
        const carousel = this.carousels[carouselName];
        if (!carousel) return;
        
        const nextIndex = (carousel.currentIndex + 1) % carousel.totalItems;
        this.goToCarouselItem(carouselName, nextIndex);
    }

    prevCarouselItem(carouselName) {
        const carousel = this.carousels[carouselName];
        if (!carousel) return;
        
        const prevIndex = carousel.currentIndex === 0 
            ? carousel.totalItems - 1 
            : carousel.currentIndex - 1;
        this.goToCarouselItem(carouselName, prevIndex);
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

        // Touch/swipe navigation for slides
        this.bindTouchEvents();
    }

    bindTouchEvents() {
        let touchStartX = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });
        
        document.addEventListener('touchend', (e) => {
            if (!touchStartX) return;
            const touchEndX = e.changedTouches[0].clientX;
            const diffX = touchStartX - touchEndX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            touchStartX = 0;
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

        targetSlide.style.transform = direction === 'next' ? 'translateX(100%)' : 'translateX(-100%)';
        targetSlide.style.opacity = '0';
        targetSlide.classList.add('active');

        targetSlide.offsetHeight; // Force reflow

        currentSlide.style.transform = direction === 'next' ? 'translateX(-100%)' : 'translateX(100%)';
        currentSlide.style.opacity = '0';
        targetSlide.style.transform = 'translateX(0)';
        targetSlide.style.opacity = '1';

        setTimeout(() => {
            currentSlide.classList.remove('active');
            currentSlide.style.transform = '';
            currentSlide.style.opacity = '';
            targetSlide.style.transform = '';
            targetSlide.style.opacity = '';
            this.isAnimating = false;

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
        setTimeout(() => {
            switch (slideNumber) {
                case 1:
                    this.animateCounters('.hero-stats .stat-number');
                    break;
                case 2:
                    if (this.carousels.summary) {
                        this.goToCarouselItem('summary', 0);
                    }
                    break;
                case 3:
                    if (this.carousels.icp) {
                        this.goToCarouselItem('icp', 0);
                    }
                    break;
                case 10:
                    this.animateCounters('.kpi-number .counter');
                    if (this.carousels.kpi) {
                        this.goToCarouselItem('kpi', 0);
                    }
                    break;
            }
        }, 200);
    }

    animateCounters(selector) {
        const counters = document.querySelectorAll(selector);
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target')) || 0;
            let current = 0;
            const increment = target / 60;
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

    startCounters() {
        setTimeout(() => {
            this.animateCounters('.hero-stats .stat-number');
        }, 1500);
    }

    handleContact() {
        const messages = [
            "Hi! Ready to discuss your SEO strategy?",
            "Let's talk about growing your B2B SaaS pipeline!",
            "Questions about our 6-pillar approach?",
            "Ready to see 3x pipeline growth?"
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        alert(`💬 ${randomMessage}\n\nContact us to discuss your SEO needs!`);
    }
}

// Initialize the presentation
document.addEventListener('DOMContentLoaded', () => {
    const presentation = new PresentationApp();
    window.presentation = presentation; // Make available globally
    console.log('🚀 Enhanced SEO Proposal Presentation Ready!');
});

