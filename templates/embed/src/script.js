import textBalancer from 'text-balancer';
import initiatePage from './scripts/page';

import { spectate as spectateConfig } from '../package.json';

// Main page initiation

initiatePage();

// Fade in navbar at scroll trigger

const navbar = document.getElementById('navbar');


// Mobile navbar hamburger trigger

export function hamburgerTrigger() {
  navbar.classList.toggle('show-nav-links');
}

// Text balance headline, deck, and image captions

if (window.innerWidth <= 460) {
  textBalancer.balanceText('#headline, .deck, .image-caption-text');
}
