// Sign-up page logic: email/password registration, Google sign-in, and profile persistence
// Assumes firebase-init.js exports app, auth, db, googleProvider

import { auth, db, googleProvider } from './firebase-init.js';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';
import { doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';

function $(sel) { return document.querySelector(sel); }

function setButtonLoading(loading, button, textIdle, textBusy) {
  if (!button) return;
  if (loading) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = textBusy || 'Processing...';
    button.style.opacity = '0.8';
  } else {
    button.disabled = false;
    button.textContent = textIdle || button.dataset.originalText || 'Submit';
    button.style.opacity = '1';
  }
}

async function createUserProfile(uid, data) {
  const ref = doc(db, 'users', uid);
  await setDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

function getFormData() {
  const form = $('#signupForm');
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  data.terms = !!$('#terms')?.checked;
  data.newsletter = !!$('#newsletter')?.checked;
  // Normalize age to number
  if (data.age) data.age = Number(data.age);
  return data;
}

async function handleEmailSignUp(e) {
  e.preventDefault();
  const button = $('#signupForm .btn-primary');
  setButtonLoading(true, button, 'Create My Inclove Profile', 'Creating your profile...');
  try {
    const data = getFormData();
    if (!data.email || !data.password) throw new Error('Email and password are required');

    // Create account
    const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);

    // Update display name if provided
    const displayName = [data.firstName, data.lastName].filter(Boolean).join(' ').trim();
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }

    // Save profile to Firestore
    const profile = {
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email,
      age: data.age || null,
      gender: data.gender || '',
      location: data.location || '',
      interests: data.interests || '',
      newsletter: !!data.newsletter,
      termsAccepted: !!data.terms,
      provider: 'password'
    };
    await createUserProfile(cred.user.uid, profile);

    // UX feedback and redirect
    button.textContent = '✓ Welcome to Inclove!';
    button.style.background = 'linear-gradient(135deg, #059669, #047857)';
    setTimeout(() => {
      window.location.href = 'explore.html';
    }, 800);
  } catch (err) {
    console.error(err);
    alert(err?.message || 'Sign up failed. Please try again.');
  } finally {
    setButtonLoading(false, button, 'Create My Inclove Profile');
  }
}

async function handleGoogleSignIn(e) {
  e.preventDefault();
  const btn = e.currentTarget;
  setButtonLoading(true, btn, 'Google', 'Opening Google...');
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const nameParts = (user.displayName || '').split(' ');
    const firstName = nameParts.slice(0, -1).join(' ') || user.displayName || '';
    const lastName = nameParts.slice(-1).join(' ') || '';
    await createUserProfile(user.uid, {
      firstName,
      lastName,
      email: user.email || '',
      age: null,
      gender: '',
      location: '',
      interests: '',
      newsletter: false,
      termsAccepted: false,
      provider: 'google'
    });
    window.location.href = 'explore.html';
  } catch (err) {
    console.error(err);
    alert(err?.message || 'Google sign-in failed.');
  } finally {
    setButtonLoading(false, btn, 'Google');
  }
}

function init() {
  const form = $('#signupForm');
  if (form) form.addEventListener('submit', handleEmailSignUp);

  // Wire the Google button by label text or DOM structure in sign up page
  const socialButtons = document.querySelectorAll('.social-btn');
  socialButtons.forEach(btn => {
    if (btn.textContent && btn.textContent.toLowerCase().includes('google')) {
      btn.addEventListener('click', handleGoogleSignIn);
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
