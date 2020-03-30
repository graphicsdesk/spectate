import enterView from 'enter-view';
import textBalancer from 'text-balancer';
import { USE_COVER_HED, USE_EYE_NAV } from '../config.json';
import './scripts/page.js';

// Fade in navbar at scroll trigger

const navbar = document.getElementById('navbar');

if (USE_COVER_HED || USE_EYE_NAV) {
  enterView({
    selector: USE_COVER_HED ? '.headline' : '.step-deck',
    offset: USE_COVER_HED ? 1 : 0.957,
    enter: () => {
      navbar.classList.remove('only-logo');
    },
    exit: () => {
      navbar.classList.remove('show-nav-links');
      navbar.classList.add('only-logo');
    },
  });
}

// Mobile navbar hamburger trigger

export function hamburgerTrigger() {
  navbar.classList.toggle('show-nav-links');
}

// Text balance headline, deck, and image captions

textBalancer.balanceText('.headline, .deck, .image-overlay .image-caption-text');
