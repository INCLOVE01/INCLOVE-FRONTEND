
// Hearts Animation
function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '💖';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    document.getElementById('heartsContainer').appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 8000);
}

// Create hearts periodically
setInterval(createHeart, 2000);

// Modal functionality
const donateBtn = document.getElementById('donateBtn');
const modal = document.getElementById('donationModal');
const closeBtn = document.getElementById('closeModal');

donateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('active');
    // Initialize PayPal when modal opens
    if (!document.querySelector('#paypal-container-FGDE63LJ4YF4N iframe')) {
        paypal.HostedButtons({
            hostedButtonId: "FGDE63LJ4YF4N",
        }).render("#paypal-container-FGDE63LJ4YF4N");
    }
});

closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

// Keyboard accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
    }
});

// Smooth color transitions on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    document.body.style.backgroundPosition = `0 ${rate}px`;
});

// Add some interactive elements
document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-3px) scale(1.05)';
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0) scale(1)';
    });
});

