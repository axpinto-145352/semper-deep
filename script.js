// Semper Deep Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    initializeBackground();
    initializeNavigation();
    initializeScheduleDrawer();
    initializeFAQ();
    initializeRevealAnimations();
    initializeActiveTrackingCampaign();
});

// Animated Neural Network Background
function initializeBackground() {
    const background = document.querySelector('.animated-background');
    if (!background) return;

    // Create neural network container
    const neuralNetwork = document.createElement('div');
    neuralNetwork.className = 'neural-network';
    background.appendChild(neuralNetwork);

    // Create floating nodes
    for (let i = 0; i < 20; i++) {
        createFloatingNode(neuralNetwork);
    }

    // Create connections
    for (let i = 0; i < 10; i++) {
        createConnection(neuralNetwork);
    }

    // Create radar sweep
    const radar = document.createElement('div');
    radar.className = 'radar-sweep';
    neuralNetwork.appendChild(radar);

    // Animate nodes periodically
    setInterval(() => {
        createFloatingNode(neuralNetwork);
        setTimeout(() => {
            if (neuralNetwork.children.length > 50) {
                neuralNetwork.removeChild(neuralNetwork.firstChild);
            }
        }, 6000);
    }, 2000);
}

function createFloatingNode(container) {
    const node = document.createElement('div');
    node.className = 'node';
    
    // Random position
    node.style.left = Math.random() * 100 + '%';
    node.style.top = Math.random() * 100 + '%';
    
    // Random animation delay
    node.style.animationDelay = Math.random() * 3 + 's';
    
    container.appendChild(node);
    
    // Remove after animation
    setTimeout(() => {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }, 6000);
}

function createConnection(container) {
    const connection = document.createElement('div');
    connection.className = 'connection';
    
    // Random position and size
    connection.style.left = Math.random() * 80 + '%';
    connection.style.top = Math.random() * 80 + '%';
    connection.style.width = Math.random() * 200 + 50 + 'px';
    connection.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
    
    // Random animation delay
    connection.style.animationDelay = Math.random() * 2 + 's';
    
    container.appendChild(connection);
    
    // Remove after animation
    setTimeout(() => {
        if (connection.parentNode) {
            connection.parentNode.removeChild(connection);
        }
    }, 4000);
}

// Navigation Management
function initializeNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
        
        link.addEventListener('click', function(e) {
            // Add loading state
            this.classList.add('loading');
        });
    });

    // Sticky header effect
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScrollY = window.scrollY;
    });
}

// Schedule Drawer Functionality
function initializeScheduleDrawer() {
    const scheduleBtn = document.querySelector('.schedule-btn');
    const drawer = document.querySelector('.schedule-drawer');
    const drawerClose = document.querySelector('.drawer-close');

    if (scheduleBtn && drawer) {
        scheduleBtn.addEventListener('click', () => {
            drawer.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }

    if (drawerClose && drawer) {
        drawerClose.addEventListener('click', () => {
            drawer.classList.remove('open');
            document.body.style.overflow = 'auto';
        });
    }

    // Close on outside click
    if (drawer) {
        drawer.addEventListener('click', (e) => {
            if (e.target === drawer) {
                drawer.classList.remove('open');
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// FAQ Accordion Functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Reveal Animations on Scroll
function initializeRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        observer.observe(el);
    });
}

// ActiveCampaign Integration
function initializeActiveTrackingCampaign() {
    // Newsletter form tracking
    const newsletterForm = document.querySelector('.newsletter-form form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            // Track newsletter signup
            trackEvent('newsletter_signup', {
                page: window.location.pathname,
                timestamp: new Date().toISOString()
            });
        });
    }

    // Page view tracking
    trackEvent('page_view', {
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent
    });

    // Schedule button tracking
    const scheduleBtn = document.querySelector('.schedule-btn');
    if (scheduleBtn) {
        scheduleBtn.addEventListener('click', function() {
            trackEvent('schedule_clicked', {
                page: window.location.pathname,
                timestamp: new Date().toISOString()
            });
        });
    }
}

function trackEvent(eventName, data) {
    // This would integrate with ActiveCampaign's tracking API
    // For now, we'll use console.log for demonstration
    console.log('ActiveCampaign Event:', eventName, data);
    
    // In production, this would be:
    // if (window.ActiveCampaign) {
    //     window.ActiveCampaign.track(eventName, data);
    // }
}

// Form Enhancements
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const submitBtn = form.querySelector('.btn-primary');
        
        form.addEventListener('submit', function(e) {
            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';
                submitBtn.disabled = true;
                
                // Reset after 3 seconds (in real implementation, this would be after actual submission)
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    });
});

// Mobile Navigation (for smaller screens)
function initializeMobileNavigation() {
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const nav = document.querySelector('nav');
    
    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', () => {
            nav.classList.toggle('mobile-open');
        });
    }
}