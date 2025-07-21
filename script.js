// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const cartIcon = document.querySelector('.fa-shopping-bag');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCart = document.getElementById('close-cart');
const cartCount = document.querySelector('.cart-count');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const quickViewButtons = document.querySelectorAll('.quick-view');
const ctaButton = document.querySelector('.cta-button');
const newsletterButton = document.querySelector('.newsletter-button');
const newsletterInput = document.querySelector('.newsletter-input');

// Navigation State
let isMenuOpen = false;
let cartItems = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Initialize text animation
    const textRow = document.querySelector('.text-row');
    const text = "WEAR YOUR CONFIDENCE "; // Space at the end for better separation
    let repeatedText = text.repeat(8); // Repeat the text to ensure coverage
    
    // Create span elements for the text
    textRow.innerHTML = repeatedText.split(' ').map(word => `<span>${word}</span>`).join(' ');
    
    // Add scroll event listener
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset || document.documentElement.scrollTop;
        const speed = 0.8; // Increased speed from 0.3 to 0.8
        const movement = scrolled * speed;
        
        // Move text based on scroll position
        textRow.style.transform = `translateX(-${movement}px)`;
    });

    initializeEventListeners();
    initializeAnimations();
    updateCartDisplay();
    initializeScrollEffect();
    // Baseline animation for hero components
    const animatedElements = document.querySelectorAll('.hero-content .baseline-animate');
    animatedElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, 200 * (index + 1));
    });
});

function initializeScrollEffect() {
    const textRow = document.querySelector('.text-row');
    let initialX = 0;

    window.addEventListener('scroll', () => {
        // Get scroll position
        const scrolled = window.pageYOffset || document.documentElement.scrollTop;
        
        // Calculate new position (adjust the division factor to control speed)
        const newX = initialX + (scrolled * 0.8); // Increased speed multiplier
        
        // Apply the transform
        textRow.style.transform = `translateX(-${newX}px)`;
    });
}

// Hero Animations
function initializeHeroAnimations() {
    const backgroundText = document.querySelector('.background-text');
    const modelImage = document.querySelector('.model-image');
    
    // Intersection Observer for triggering animations when hero section is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    if (modelImage) {
        observer.observe(modelImage);
    }

    // Create dynamic background text animation
    if (backgroundText) {
        const words = ['Fashion', 'Elegance', 'Confidence', 'Style', 'Grace'];
        let currentIndex = 0;

        setInterval(() => {
            const spans = backgroundText.querySelectorAll('span');
            spans.forEach((span, index) => {
                const targetWord = words[(currentIndex + index) % words.length];
                if (span.textContent !== targetWord) {
                    span.style.opacity = '0';
                    setTimeout(() => {
                        span.textContent = targetWord;
                        span.style.opacity = '0.1';
                    }, 500);
                }
            });
            currentIndex = (currentIndex + 1) % words.length;
        }, 3000);
    }
}

// Event Listeners
function initializeEventListeners() {
    // Mobile Navigation
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    // Cart Functionality
    if (cartIcon) {
        cartIcon.addEventListener('click', openCart);
    }
    if (closeCart) {
        closeCart.addEventListener('click', closeCartSidebar);
    }
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartSidebar);
    }
    // Product Actions
    if (addToCartButtons && addToCartButtons.length) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', handleAddToCart);
        });
    }
    if (quickViewButtons && quickViewButtons.length) {
        quickViewButtons.forEach(button => {
            button.addEventListener('click', handleQuickView);
        });
    }
    // CTA Button
    if (ctaButton) {
        ctaButton.addEventListener('click', scrollToCollection);
    }
    // Newsletter
    if (newsletterButton) {
        newsletterButton.addEventListener('click', handleNewsletterSignup);
    }
    if (newsletterInput) {
        newsletterInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleNewsletterSignup();
            }
        });
    }
    // Smooth scrolling for navigation links
    var navLinks = document.querySelectorAll('.nav-link');
    if (navLinks && navLinks.length) {
        navLinks.forEach(link => {
            link.addEventListener('click', handleSmoothScroll);
        });
        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }
    // Window resize handler
    window.addEventListener('resize', handleWindowResize);
    // Scroll effects
    window.addEventListener('scroll', handleScroll);
}

// Mobile Navigation
function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
}

function closeMobileMenu() {
    if (isMenuOpen) {
        isMenuOpen = false;
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Cart Functionality
function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('show');
    document.body.style.overflow = '';
}

function handleAddToCart(e) {
    e.preventDefault();
    
    const productCard = e.target.closest('.product-card');
    const productName = productCard.querySelector('.product-name').textContent;
    const productPrice = productCard.querySelector('.product-price').textContent;
    const productImage = productCard.querySelector('img').src;
    
    const product = {
        id: Date.now(),
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1
    };
    
    cartItems.push(product);
    updateCartDisplay();
    showNotification(`${productName} added to cart!`);
    
    // Add visual feedback
    e.target.style.background = '#632024';
    e.target.textContent = 'ADDED!';
    
    setTimeout(() => {
        e.target.style.background = '';
        e.target.textContent = 'ADD TO CART';
    }, 1500);
}

function updateCartDisplay() {
    const cartCountElement = document.querySelector('.cart-count');
    const cartContent = document.querySelector('.cart-content');
    
    if (cartItems.length > 0) {
        cartCountElement.textContent = cartItems.length;
        cartCountElement.classList.add('show');
        
        // Update cart content
        cartContent.innerHTML = `
            <div class="cart-items">
                ${cartItems.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px;">
                        <div>
                            <h4 style="font-size: 0.9rem; margin-bottom: 5px;">${item.name}</h4>
                            <p style="color: #d5b893;">${item.price}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        cartCountElement.classList.remove('show');
        cartContent.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    }
}

function handleQuickView(e) {
    e.preventDefault();
    const productCard = e.target.closest('.product-card');
    const productName = productCard.querySelector('.product-name').textContent;
    
    showNotification(`Quick view for ${productName} - Feature coming soon!`);
}

// Navigation
function handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    
    if (targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

function scrollToCollection() {
    const collectionSection = document.getElementById('collection');
    const offsetTop = collectionSection.offsetTop - 80;
    window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
    });
}

// Newsletter
function handleNewsletterSignup() {
    const email = newsletterInput.value.trim();
    
    if (email === '') {
        showNotification('Please enter your email address', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate newsletter signup
    newsletterButton.textContent = 'SUBSCRIBING...';
    newsletterButton.disabled = true;
    
    setTimeout(() => {
        showNotification('Welcome to the rebellion! Check your email for confirmation.', 'success');
        newsletterInput.value = '';
        newsletterButton.textContent = 'SUBSCRIBE';
        newsletterButton.disabled = false;
    }, 1500);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notifications
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#632024' : type === 'success' ? '#6f4d38' : '#d5b893'};
        color: ${type === 'info' ? '#000000' : '#ffffff'};
        padding: 15px 25px;
        border-radius: 5px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 0.9rem;
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Scroll Effects
function handleScroll() {
    const navbar = document.querySelector('.navbar');
    const scrollTop = window.pageYOffset;
    
    // Navbar background opacity based on scroll
    if (scrollTop > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.98)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
    }
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    const heroText = document.querySelector('.hero-text');
    const heroImage = document.querySelector('.hero-image');
    
    if (scrollTop < window.innerHeight) {
        const speed = scrollTop * 0.5;
        if (heroText) {
            heroText.style.transform = `translateY(${speed * 0.3}px)`;
        }
        if (heroImage) {
            heroImage.style.transform = `translateY(${speed * 0.15}px)`;
        }
    }
}

// Animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.product-card, .statement-content, .newsletter-content');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 0.8s ease';
        observer.observe(el);
    });
}

// Window Resize Handler
function handleWindowResize() {
    // Close mobile menu on desktop
    if (window.innerWidth > 768 && isMenuOpen) {
        closeMobileMenu();
    }
    
    // Close cart sidebar on very small screens
    if (window.innerWidth < 400 && cartSidebar.classList.contains('open')) {
        closeCartSidebar();
    }
}

// Keyboard Accessibility
document.addEventListener('keydown', function(e) {
    // Close cart with Escape key
    if (e.key === 'Escape') {
        if (cartSidebar.classList.contains('open')) {
            closeCartSidebar();
        }
        if (isMenuOpen) {
            closeMobileMenu();
        }
    }
});

// Performance Optimization
// Debounce scroll events
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

// Apply debounce to scroll handler
window.addEventListener('scroll', debounce(handleScroll, 16));

// Preload images for better performance
function preloadImages() {
    const imageUrls = [
        'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
        'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg',
        'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
        'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Initialize preloading
preloadImages();

// Add CSS for cart items
const cartItemStyles = `
<style>
.cart-items {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
}

.cart-item {
    display: flex;
    gap: 15px;
    align-items: center;
    padding: 15px;
    background: rgba(213, 184, 147, 0.05);
    border-radius: 8px;
    border: 1px solid rgba(213, 184, 147, 0.1);
}

.cart-item h4 {
    color: #ffffff;
    font-size: 0.9rem;
    margin-bottom: 5px;
    font-weight: 600;
}

.cart-item p {
    color: #d5b893;
    font-weight: 700;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', cartItemStyles);