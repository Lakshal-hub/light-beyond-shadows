// Set active navigation link
document.addEventListener('DOMContentLoaded', function() {
    const currentLocation = location.pathname;
    const menuItems = document.querySelectorAll('nav a');
    
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        if (currentLocation.includes(href) || (currentLocation.endsWith('/') && href === 'index.html')) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
});

// Scroll animation for elements with staggered effect
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Stagger animation delay based on card index
            const delay = index * 0.1;
            entry.target.style.animation = `fadeInUp 0.6s ease-out ${delay}s forwards`;
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe profile cards and list items
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.profile-card, .analysis-text li');
    cards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
});

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add hover animation to profile cards
const profileCards = document.querySelectorAll('.profile-card');
profileCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});
