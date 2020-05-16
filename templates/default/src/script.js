import textBalancer from 'text-balancer';
import initiatePage from './scripts/page';

import { spectate as spectateConfig } from '../package.json';
const { USE_NEWS_NAV, USE_EYE_NAV, USE_COVER_HED } = spectateConfig;

// Main page initiation

initiatePage();

// Fade in navbar at scroll trigger

const navbar = document.getElementById('navbar');

if (USE_NEWS_NAV || USE_EYE_NAV || USE_COVER_HED) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      const {
        isIntersecting,
        boundingClientRect: { top },
      } = entry;
      if (!isIntersecting && top < 0) {
        // Enter headline on the top
        navbar.classList.remove('only-eye-logo');
        navbar.classList.remove('hide-news-navbar');
      } else if (isIntersecting && top < window.innerHeight / 2) {
        // Exit headline from the top
        navbar.classList.remove('show-nav-links');
        navbar.classList.add('only-eye-logo');
        navbar.classList.add('hide-news-navbar');
      }
    },
    { threshold: 1 },
  );
  observer.observe(document.getElementById('headline'));
}

// Mobile navbar hamburger trigger

export function hamburgerTrigger() {
  navbar.classList.toggle('show-nav-links');
}

// Text balance headline, deck, and image captions

if (window.innerWidth <= 460) {
  textBalancer.balanceText('#headline, .deck, .image-caption-text');
}
