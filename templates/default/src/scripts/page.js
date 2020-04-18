/**
 * Put all initializer scripts into this init() function
 */

import initResizer from './ai2html-resizer';

function init() {
  initResizer();
}

/**
 * Replace the section#main node with the article content
 */

const isOnSpectatorPage = window.location.host === 'www.columbiaspectator.com';

const SECTION_MAIN_SELECTOR = 'section#main';
const ARTICLE_SELECTOR =
  '.pb-f-article-article-body > .row > .col-xs-12 > .ab-article-body > .ab-article-content > article';

// Replaces section#main with article
function hoistArticle() {
  // Replace section#main with article
  const sectionMain = document.querySelector(SECTION_MAIN_SELECTOR);
  const article = document.querySelector(ARTICLE_SELECTOR);
  sectionMain.parentNode.replaceChild(article, sectionMain);

  // Arc SSRs elements like links and meta tags in Spectate's index.html <head>
  // into a paragraph, which takes up unwanted space thanks to Arc's CSS
  const suspectParagraph = article.firstElementChild;
  if (
    [...suspectParagraph.children].some((el) =>
      ['META', 'LINK'].includes(el.tagName),
    )
  ) {
    suspectParagraph.style.margin = 0;
  }

  init();
}

// Runs hoistArticle() and stops RAF when necessary elements exist.
// Stops after 5 seconds of trying.
const TRY_TIME = 5000;
let start = null;
function ready(timestamp) {
  if (document.body && document.querySelector(SECTION_MAIN_SELECTOR)) {
    hoistArticle();
    return;
  }
  if (timestamp - (start || (start = timestamp)) < TRY_TIME) {
    // If the body element isn't found, run ready() again at the next frame
    window.requestAnimationFrame(ready);
  } else {
    // After 5 seconds, stop requesting frames and just use window.onload
    console.log(
      'Gave up replacing %s with article after %dms. Using window.onload.',
      SECTION_MAIN_SELECTOR,
      TRY_TIME,
    );
    window.onload = hoistArticle;
  }
}

// Initialize our ready() function.
if (isOnSpectatorPage) {
  window.requestAnimationFrame(ready);
} else {
  init();
}


/**
 * Disable stylesheets on contributor page. Stylesheets are included in the
 * server-side render and styles in files like news-ellipsis.scss
 * still override the site.
 */

const isOnContributorPage =
  isOnSpectatorPage && window.location.pathname.indexOf('/contributors') === 0;

if (isOnContributorPage) {
  // Disable stylesheets
  document
    .querySelectorAll('.story-summary > .twolines > link')
    .forEach((link) => (link.disabled = true));

  // Add styles to hide content preview
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = '.story-summary > .twolines { display: none; }';
  document.head.appendChild(styleSheet);
}
