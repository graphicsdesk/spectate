/* Scripts that should be on every Spectate page */

const isOnSpectatorPage = window.location.host === 'www.columbiaspectator.com';
const isOnContributorPage = isOnSpectatorPage &&
  window.location.pathname.indexOf('/contributors') === 0;

/**
 * Disable stylesheets on contributor page. Stylesheets are included in the
 * server-side render and styles in files like news-ellipsis.scss
 * still override the site.
 */

if (isOnContributorPage) {
  // Disable stylesheets
  document.querySelectorAll('.story-summary > .twolines > link').forEach(link => link.disabled = true);
  // Add styles to hide content preview
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = '.story-summary > .twolines { display: none; }';
  document.head.appendChild(styleSheet);
}

/**
 * Replace the section#main node with the article content
 */

const SECTION_MAIN_SELECTOR = 'section#main';
const ARTICLE_SELECTOR = '.pb-f-article-article-body > .row > .col-xs-12 > .ab-article-body > .ab-article-content > article';

// Replaces section#main with article
function hoistArticle() {
  // Hoist article
  const sectionMain = document.querySelector(SECTION_MAIN_SELECTOR);
  const article = document.querySelector(ARTICLE_SELECTOR);
  sectionMain.parentNode.replaceChild(article, sectionMain);

  // Links and meta tags are SSR'd into this first paragraph,
  // and it takes up unwanted space thanks to Arc's CSS
  const suspectParagraph = article.firstElementChild;
  if ([ ...suspectParagraph.children ].some(el => [ 'META', 'LINK' ].includes(el.tagName))) {
    // If the paragraph includes <meta> or <link> tags, it's probably our SSR'd <head>
    suspectParagraph.style.margin = 0;
  }
}

// Runs hoistArticle() and stops RAF when necessary elements exist.
// Stops after 5 seconds of trying.
let start = null;
function ready(timestamp) {
  if (!start)
    start = timestamp;
  if (document.body && document.querySelector(SECTION_MAIN_SELECTOR)) {
    hoistArticle();
    return;
  }
  if (timestamp - start < 5000) {
    // If the body element isn't found, run ready() again at the next frame
    window.requestAnimationFrame(ready);
  } else {
    // After 5 seconds, stop requesting frames and just use window.onload
    console.log(
      'Gave up on hoisting article to' +
      SECTION_MAIN_SELECTOR +
      '. Using window.onload event.'
    );
    window.onload = hoistArticle;
  }
}

// Initialize our ready() function.
if (isOnSpectatorPage)
  window.requestAnimationFrame(ready);
