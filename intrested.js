
let currentQuestion = 1;
const totalQuestions = 7;

// Create floating hearts animation
function createHeart() {
    const hearts = ['💖', '💕', '💗', '💓', '💝', '❤️', '🌟', '✨', '🤝', '🌈'];
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = Math.random() * 6 + 6 + 's';
    heart.style.fontSize = Math.random() * 10 + 20 + 'px';
    document.querySelector('.hearts-container').appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 12000);
}

// Create hearts periodically
setInterval(createHeart, 3000);

// Initial hearts
for (let i = 0; i < 8; i++) {
    setTimeout(createHeart, i * 1500);
}

function updateProgress() {
    const progress = (currentQuestion / totalQuestions) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = `Step ${currentQuestion} of ${totalQuestions}`;
}

function validateCurrentQuestion() {
    const currentSection = document.getElementById('q' + currentQuestion);
    const inputs = currentSection.querySelectorAll('input[required], select[required], textarea[required]');

    for (let input of inputs) {
        if (!input.value.trim()) {
            input.focus();
            input.style.borderColor = '#e53e3e';
            input.style.boxShadow = '0 0 0 3px rgba(229, 62, 62, 0.1)';

            setTimeout(() => {
                input.style.borderColor = '#e2e8f0';
                input.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            }, 2000);

            return false;
        }
    }
    return true;
}

function nextQuestion(current) {
    if (!validateCurrentQuestion()) {
        return;
    }

    const currentSection = document.getElementById("q" + current);
    const nextSection = document.getElementById("q" + (current + 1));
    const button = currentSection.querySelector('.btn-next');

    // Add loading state
    button.classList.add('btn-loading');
    button.disabled = true;

    setTimeout(() => {
        currentSection.classList.add("exiting");

        setTimeout(() => {
            currentSection.classList.remove("active", "exiting");
            nextSection.classList.add("active");
            currentQuestion = current + 1;
            updateProgress();

            // Remove loading state
            button.classList.remove('btn-loading');
            button.disabled = false;
        }, 300);
    }, 500);
}

function prevQuestion(current) {
    const currentSection = document.getElementById("q" + current);
    const prevSection = document.getElementById("q" + (current - 1));

    currentSection.classList.add("exiting");

    setTimeout(() => {
        currentSection.classList.remove("active", "exiting");
        prevSection.classList.add("active");
        currentQuestion = current - 1;
        updateProgress();
    }, 300);
}

// Add input animations
document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('.form-input');

    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.style.transform = 'scale(1.02)';
        });

        input.addEventListener('blur', function () {
            this.parentElement.style.transform = 'scale(1)';
        });

        // Real-time validation feedback
        input.addEventListener('input', function () {
            if (this.value.trim()) {
                this.style.borderColor = '#48bb78';
            } else {
                this.style.borderColor = '#e2e8f0';
            }
        });
    });
});

// Keyboard navigation
document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        const activeSection = document.querySelector('.question-section.active');
        const nextButton = activeSection.querySelector('.btn-next');
        if (nextButton && !nextButton.disabled) {
            e.preventDefault();
            nextButton.click();
        }
    }
});
