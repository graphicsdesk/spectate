/* Scripts that should be on every Spectate page */

// Disable stylesheets on contributor page. Stylesheets are included in the
// server-side render and styles in files like news-ellipsis.scss
// still override the site.

if (window.location.pathname.indexOf('/contributors') === 0) {
  // Disable stylesheets
  document.querySelectorAll('.story-summary > .twolines > link').forEach(link => link.disabled = true);
  // Add styles to hide content preview
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css"
  styleSheet.innerText = '.story-summary > .twolines { display: none; }';
  document.head.appendChild(styleSheet);
}
