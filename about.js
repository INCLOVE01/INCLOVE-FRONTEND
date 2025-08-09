
// Create floating hearts animation
function createHeart() {
    const hearts = ['💖', '💕', '💗', '💓', '💝', '❤️', '🌟', '✨', '🤝', '🌈', '💌', '🥰', '😍', '💘'];
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = Math.random() * 8 + 8 + 's';
    heart.style.fontSize = Math.random() * 12 + 18 + 'px';
    document.querySelector('.hearts-container').appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 16000);
}

// Create hearts periodically
setInterval(createHeart, 2000);

// Initial hearts
for (let i = 0; i < 12; i++) {
    setTimeout(createHeart, i * 1000);
}

// Scroll reveal animation
function revealOnScroll() {
    const reveals = document.querySelectorAll('.scroll-reveal');

    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('revealed');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Initial check

// Add some interactive elements
document.addEventListener('DOMContentLoaded', function () {
    // Add hover effect to timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            this.style.transform = 'translateX(10px)';
            this.style.background = 'rgba(102, 126, 234, 0.1)';
        });

        item.addEventListener('mouseleave', function () {
            this.style.transform = 'translateX(0)';
            this.style.background = 'rgba(102, 126, 234, 0.05)';
        });
    });

    // Add typing effect to the hero tagline
    const tagline = document.querySelector('.hero-tagline');
    const text = tagline.textContent;
    tagline.textContent = '';

    let i = 0;
    const typeTimer = setInterval(() => {
        if (i < text.length) {
            tagline.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typeTimer);
        }
    }, 50);
});
