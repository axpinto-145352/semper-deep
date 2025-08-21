// Neural Network Animation
class NeuralNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.animationId = null;
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        const nodeCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        this.nodes = [];
        this.connections = [];
        
        // Create nodes
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
        
        // Create connections
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const distance = this.getDistance(this.nodes[i], this.nodes[j]);
                if (distance < 150) {
                    this.connections.push({
                        nodeA: this.nodes[i],
                        nodeB: this.nodes[j],
                        opacity: Math.max(0, 0.3 - distance / 500)
                    });
                }
            }
        }
    }
    
    getDistance(nodeA, nodeB) {
        return Math.sqrt(Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2));
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw nodes
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            
            // Bounce off edges
            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;
            
            // Keep nodes in bounds
            node.x = Math.max(0, Math.min(this.canvas.width, node.x));
            node.y = Math.max(0, Math.min(this.canvas.height, node.y));
            
            // Draw node
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 212, 170, ${node.opacity})`;
            this.ctx.fill();
        });
        
        // Draw connections
        this.connections.forEach(connection => {
            const distance = this.getDistance(connection.nodeA, connection.nodeB);
            if (distance < 150) {
                this.ctx.beginPath();
                this.ctx.moveTo(connection.nodeA.x, connection.nodeA.y);
                this.ctx.lineTo(connection.nodeB.x, connection.nodeB.y);
                this.ctx.strokeStyle = `rgba(0, 212, 170, ${Math.max(0, 0.2 - distance / 750)})`;
                this.ctx.lineWidth = 0.5;
                this.ctx.stroke();
            }
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Schedule Drawer
class ScheduleDrawer {
    constructor() {
        this.drawer = document.getElementById('schedule-drawer');
        this.toggle = document.getElementById('schedule-toggle');
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        this.toggle.addEventListener('click', () => this.toggleDrawer());
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.drawer.contains(e.target)) {
                this.closeDrawer();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeDrawer();
            }
        });
    }
    
    toggleDrawer() {
        this.isOpen ? this.closeDrawer() : this.openDrawer();
    }
    
    openDrawer() {
        this.drawer.classList.add('open');
        this.isOpen = true;
        
        // Track event
        if (typeof vgo !== 'undefined') {
            vgo('track', 'Schedule Drawer Opened');
        }
    }
    
    closeDrawer() {
        this.drawer.classList.remove('open');
        this.isOpen = false;
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[class*="reveal-"]');
        this.init();
    }
    
    init() {
        this.observeElements();
        window.addEventListener('scroll', () => this.updateHeader());
    }
    
    observeElements() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, options);
        
        this.elements.forEach(element => {
            observer.observe(element);
        });
    }
    
    updateHeader() {
        const header = document.getElementById('header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}

// Statistics Counter
class StatsCounter {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        this.counters.forEach(counter => {
            observer.observe(counter);
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }
}

// Mobile Navigation
class MobileNavigation {
    constructor() {
        this.menuToggle = document.getElementById('menu-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        this.menuToggle.addEventListener('click', () => this.toggleMenu());
        
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Close menu on resize if open
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        this.navMenu.classList.toggle('open');
    }
    
    closeMenu() {
        this.navMenu.classList.remove('open');
    }
}

// Smooth Scrolling for Navigation Links
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    const headerHeight = document.getElementById('header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Contact Form Handler
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Track form submission
        if (typeof vgo !== 'undefined') {
            vgo('track', 'Contact Form Submitted', {
                interest: data.interest
            });
        }
        
        // Simulate form submission (replace with actual endpoint)
        try {
            // Replace this with your actual form submission logic
            await this.simulateSubmission(data);
            this.showSuccess();
        } catch (error) {
            this.showError();
        }
    }
    
    async simulateSubmission(data) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });
    }
    
    showSuccess() {
        const button = this.form.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        
        button.textContent = 'Message Sent!';
        button.style.background = 'var(--gradient-accent)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            this.form.reset();
        }, 3000);
    }
    
    showError() {
        const button = this.form.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        
        button.textContent = 'Error - Try Again';
        button.style.background = '#e74c3c';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 3000);
    }
}

// Performance Optimization
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // Lazy load images
        this.lazyLoadImages();
        
        // Preload critical resources
        this.preloadCriticalResources();
    }
    
    lazyLoadImages() {
        const images = document.querySelectorAll('img[src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '0';
                    img.addEventListener('load', () => {
                        img.style.transition = 'opacity 0.3s ease';
                        img.style.opacity = '1';
                    });
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    preloadCriticalResources() {
        const criticalImages = [
            'https://raw.githubusercontent.com/axpinto-145352/semper-deep/main/assets/v-logo.png',
            'https://raw.githubusercontent.com/axpinto-145352/semper-deep/main/assets/defense-tech.jpg'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize neural network background
    const canvas = document.getElementById('neural-network');
    if (canvas) {
        new NeuralNetwork(canvas);
    }
    
    // Initialize components
    new ScheduleDrawer();
    new ScrollAnimations();
    new StatsCounter();
    new MobileNavigation();
    new SmoothScroll();
    new ContactForm();
    new PerformanceOptimizer();
    
    // Add loading states
    document.body.classList.add('loaded');
    
    console.log('Semper Deep website initialized');
});

// Handle page visibility changes to optimize performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.classList.add('paused');
    } else {
        // Resume animations when tab becomes visible
        document.body.classList.remove('paused');
    }
});