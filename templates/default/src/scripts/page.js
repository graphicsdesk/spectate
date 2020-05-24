import { spectate as spectateConfig } from '../../package.json';

/**
 * Put all initializer scripts into this init() function
 */

function init() {
  // Your scripts here...

  // If an artboard is on the page, load the ai2html resizer
  if (document.querySelector('.g-artboard[data-min-width]')) {
    import('./ai2html-resizer').then(p => p.default());
  }
}

/**
 * Replace the section#main node with the article content
 */

const isOnSpectatorPage = window.location.host === 'www.columbiaspectator.com';
const isOnContributorPage =
  window.location.pathname.indexOf('/contributors') === 0;

const SECTION_MAIN_SELECTOR = 'section#main';
const ARTICLE_SELECTOR =
  '.pb-f-article-article-body > .row > .col-xs-12 > .ab-article-body > .ab-article-content > article';
const COMMENTS_SELECTOR = '.pb-f-article-disqus-new';

// Replaces section#main with article
function hoistArticle() {
  // Store nodes of interest
  const sectionMain = document.querySelector(SECTION_MAIN_SELECTOR);
  const article = document.querySelector(ARTICLE_SELECTOR);
  const comments = document.querySelector(COMMENTS_SELECTOR);

  // Replace section#main with article
  sectionMain.parentNode.replaceChild(article, sectionMain);

  // Append comment section after article
  article.parentNode.insertBefore(comments, article.nextSibling);

  // Arc SSRs elements like links and meta tags in Spectate's index.html <head>
  // into a paragraph, which takes up unwanted space thanks to Arc's CSS
  const suspectParagraph = article.firstElementChild;
  if (
    [...suspectParagraph.children].some(el =>
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
function prepareHoist(timestamp) {
  if (document.body && document.querySelector(SECTION_MAIN_SELECTOR)) {
    hoistArticle();
    return;
  }
  if (timestamp - (start || (start = timestamp)) < TRY_TIME) {
    // If the body element isn't found, run ready() again at the next frame
    window.requestAnimationFrame(prepareHoist);
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

export default function () {
  // If IntersectionObserver and IntersectionObserverEntry are not natively
  // supported, load the polyfill.
  if (
    !('IntersectionObserver' in window) ||
    !('IntersectionObserverEntry' in window) ||
    !('isIntersecting' in window.IntersectionObserverEntry.prototype)
  ) {
    import('intersection-observer').then();
  }

  // Replace main page section with this project if we are on a Spectator story
  // page and the project is not an embed
  if (isOnSpectatorPage && !isOnContributorPage && !spectateConfig.IS_EMBED) {
    window.requestAnimationFrame(prepareHoist);
  } else {
    init();
  }
}

/**
 * Disable stylesheets on contributor page. Stylesheets are included in the
 * server-side render and styles in files like news-ellipsis.scss
 * still override the site.
 */

if (isOnSpectatorPage && isOnContributorPage) {
  // Disable stylesheets
  document
    .querySelectorAll('.story-summary > .twolines > link')
    .forEach(link => (link.disabled = true));

  // Add styles to hide content preview
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = '.story-summary > .twolines { display: none; }';
  document.head.appendChild(styleSheet);
}
