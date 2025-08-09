
// Create floating particles
function createParticles() {
  const particleContainer = document.getElementById('particles');
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
    particleContainer.appendChild(particle);
  }
}

// Button interactions
const profileCard = document.getElementById('profileCard');
const dislikeBtn = document.getElementById('dislikeBtn');
const messageBtn = document.getElementById('messageBtn');
const likeBtn = document.getElementById('likeBtn');

dislikeBtn.addEventListener('click', () => {
  profileCard.classList.add('shake-animation');
  setTimeout(() => {
    profileCard.classList.remove('shake-animation');
    nextProfile();
  }, 500);
});

messageBtn.addEventListener('click', () => {
  profileCard.classList.add('bounce-animation');
  setTimeout(() => {
    profileCard.classList.remove('bounce-animation');
  }, 600);
  // Add message functionality here
  alert('Opening chat... 💬');
});

likeBtn.addEventListener('click', () => {
  profileCard.classList.add('heart-animation');
  createHearts();
  setTimeout(() => {
    profileCard.classList.remove('heart-animation');
    nextProfile();
  }, 800);
});

// Create heart animation
function createHearts() {
  for (let i = 0; i < 6; i++) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.top = '50%';
    heart.style.fontSize = '2rem';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1000';
    heart.style.animation = `heartFloat 2s ease-out forwards`;
    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 2000);
  }
}

// Add heart float animation
const style = document.createElement('style');
style.textContent = `
      @keyframes heartFloat {
        0% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        100% {
          opacity: 0;
          transform: translateY(-200px) scale(0.3);
        }
      }
    `;
document.head.appendChild(style);

// Sample profiles for demonstration
const profiles = [
  {
    name: 'Emma',
    age: 24,
    bio: 'Adventure seeker who loves painting sunsets, hiking mountain trails, and having deep conversations over coffee. Always up for trying new cuisines! ✨',
    image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    interests: ['🎨 Art', '🏔️ Hiking', '☕ Coffee', '📸 Photography', '🌅 Travel']
  },
  {
    name: 'Alex',
    age: 27,
    bio: 'Tech enthusiast and weekend warrior. Love coding by day and rock climbing by night. Always down for a good movie marathon! 🚀',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    interests: ['💻 Tech', '🧗 Climbing', '🎬 Movies', '🎮 Gaming', '🍕 Food']
  },
  {
    name: 'Maya',
    age: 25,
    bio: 'Yoga instructor and mindfulness advocate. Passionate about sustainable living and exploring hidden gems around the city. 🧘‍♀️',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    interests: ['🧘 Yoga', '🌱 Sustainability', '🏙️ Exploring', '📚 Reading', '🥗 Health']
  }
];

let currentProfileIndex = 0;

function nextProfile() {
  currentProfileIndex = (currentProfileIndex + 1) % profiles.length;
  const profile = profiles[currentProfileIndex];

  // Animate card out
  profileCard.style.transform = 'translateX(100%) rotate(15deg)';
  profileCard.style.opacity = '0';

  setTimeout(() => {
    // Update content
    document.getElementById('profileName').textContent = profile.name;
    document.querySelector('.profile-age').textContent = profile.age;
    document.getElementById('profileBio').textContent = profile.bio;
    document.getElementById('profileImage').src = profile.image;

    // Update interests
    const interestsContainer = document.querySelector('.interests');
    interestsContainer.innerHTML = '';
    profile.interests.forEach((interest, index) => {
      const tag = document.createElement('span');
      tag.className = 'interest-tag';
      tag.style.setProperty('--delay', (index * 0.2) + 's');
      tag.textContent = interest;
      interestsContainer.appendChild(tag);
    });

    // Animate card back in
    profileCard.style.transform = 'translateX(-100%) rotate(-15deg)';
    setTimeout(() => {
      profileCard.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      profileCard.style.transform = 'translateX(0) rotate(0deg)';
      profileCard.style.opacity = '1';
    }, 50);
  }, 300);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') dislikeBtn.click();
  if (e.key === 'ArrowUp') messageBtn.click();
  if (e.key === 'ArrowRight') likeBtn.click();
});

// Initialize
createParticles();

// Add smooth scrolling and other enhancements
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
