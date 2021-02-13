import enterView from 'enter-view';
import textBalancer from 'text-balancer';
import initiatePage from './scripts/page';
import { intersectTop } from './scripts/utils';
import { spectate as spectateConfig } from '../package.json';

var USE_COVER_HED = true
// Main page initiation

initiatePage();


/* Fade in navbar at scroll trigger */

const navbar = document.getElementById('navbar');
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


// Mobile navbar hamburger trigger

export function hamburgerTrigger() {
  navbar.classList.toggle('show-nav-links');
}

// Text balance headline, deck, and image captions

if (window.innerWidth <= 460) {
  textBalancer.balanceText('#headline, .deck, .image-caption-text');
}

/* Highlight nav link */

const pageNum = parseInt(document.getElementById('body-page-container').getAttribute('data-page-num'));
document.getElementById('nav-link-' + pageNum).classList.add('nav-link-highlighted');
