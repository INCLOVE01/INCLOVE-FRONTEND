// Sign-in page logic: Firebase email/password auth and UX wiring
// Assumes firebase-init.js exports auth (and has persistence configured)

import { auth } from './firebase-init.js';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';

function $(sel) { return document.querySelector(sel); }

function setButtonLoading(loading, button, textIdle, textBusy) {
  if (!button) return;
  if (loading) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = textBusy || 'Signing in...';
    button.style.opacity = '0.8';
  } else {
    button.disabled = false;
    button.textContent = textIdle || button.dataset.originalText || 'Sign In';
    button.style.opacity = '1';
  }
}

function showError(input, message) {
  const errorId = input.id + '-error';
  const errorElement = document.getElementById(errorId);
  if (errorElement) {
    errorElement.textContent = message || '';
    if (message) {
      errorElement.classList.remove('sr-only');
      errorElement.style.color = 'var(--error)';
      errorElement.style.fontSize = '0.85rem';
      errorElement.style.marginTop = '4px';
    } else {
      errorElement.classList.add('sr-only');
    }
  }
  if (message) {
    input.setAttribute('aria-invalid', 'true');
    input.style.borderColor = 'var(--error)';
  } else {
    input.setAttribute('aria-invalid', 'false');
    input.style.borderColor = 'var(--border)';
  }
}

function validEmail(value) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

async function handleSubmit(e) {
  e.preventDefault();
  const emailInput = $('#email');
  const passwordInput = $('#password');
  const remember = $('#remember');
  const button = $('#loginButton');
  const announcements = $('#announcements');

  // Basic validation
  let valid = true;
  if (!emailInput.value || !validEmail(emailInput.value)) {
    showError(emailInput, !emailInput.value ? 'Email address is required' : 'Please enter a valid email address');
    valid = false;
  } else {
    showError(emailInput, '');
  }
  if (!passwordInput.value || passwordInput.value.length < 8) {
    showError(passwordInput, !passwordInput.value ? 'Password is required' : 'Password must be at least 8 characters long');
    valid = false;
  } else {
    showError(passwordInput, '');
  }
  if (!valid) {
    if (announcements) announcements.textContent = 'Please correct the errors in the form';
    (emailInput.getAttribute('aria-invalid') === 'true' ? emailInput : passwordInput).focus();
    return;
  }

  try {
    setButtonLoading(true, button, 'Sign In to Your Journey', 'Signing you in...');
    if (announcements) announcements.textContent = 'Processing your login, please wait';

    // Set desired persistence based on remember checkbox
    const persistence = remember && remember.checked ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistence);

    // Sign in
    await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);

    // Success
    if (announcements) announcements.textContent = 'Login successful! Redirecting...';
    if (button) {
      button.textContent = 'Welcome to Inclove! ✨';
      button.style.background = 'var(--success)';
    }
    window.location.href = 'explore.html';
  } catch (err) {
    console.error(err);
    alert(err?.message || 'Failed to sign in. Please check your credentials and try again.');
  } finally {
    setButtonLoading(false, button, 'Sign In to Your Journey');
  }
}

function handleTogglePassword() {
  const passwordInput = $('#password');
  const togglePassword = $('#togglePassword');
  const announcements = $('#announcements');
  if (!passwordInput || !togglePassword) return;
  togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.textContent = type === 'password' ? 'Show' : 'Hide';
    this.setAttribute('aria-label', type === 'password' ? 'Show password' : 'Hide password');
    if (announcements) announcements.textContent = type === 'password' ? 'Password hidden' : 'Password visible';
  });
  togglePassword.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.click();
    }
  });
}

function handleForgotPassword() {
  const link = document.querySelector('.forgot-password');
  const emailInput = $('#email');
  if (!link) return;
  link.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = emailInput?.value?.trim();
    if (!email || !validEmail(email)) {
      alert('Enter your email in the email field to receive a password reset link.');
      emailInput?.focus();
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent. Please check your inbox.');
    } catch (err) {
      console.error(err);
      alert(err?.message || 'Failed to send password reset email.');
    }
  });
}

function wireSignupLink() {
  const signup = document.getElementById('signupLink');
  if (signup) {
    signup.setAttribute('href', 'sign up.html');
    signup.addEventListener('click', (e) => {
      // Allow normal navigation
    });
  }
}

function init() {
  const form = document.getElementById('loginForm');
  if (form) form.addEventListener('submit', handleSubmit);
  handleTogglePassword();
  handleForgotPassword();
  wireSignupLink();

  // Clear errors when user types
  ['email', 'password'].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', () => showError(input, ''));
    }
  });

  // Announce page load for screen readers
  const announcements = document.getElementById('announcements');
  if (announcements) {
    setTimeout(() => {
      announcements.textContent = 'Inclove login page loaded. Please enter your email and password to sign in.';
    }, 300);
  }
}

document.addEventListener('DOMContentLoaded', init);
