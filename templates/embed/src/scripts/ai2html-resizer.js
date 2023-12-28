/**
 * Resizer script to toggle multiple artboards for responsiveness. Adapted from:
 * https://github.com/newsdev/ai2html/blob/gh-pages/_includes/resizer-script.html
 */

function resizer() {
  const elements = document.querySelectorAll('.g-artboard[data-min-width]');
  const widthById = {};

  elements.forEach(el => {
    const parent = el.parentNode;
    const width = widthById[parent.id] || parent.getBoundingClientRect().width;
    const minwidth = el.getAttribute('data-min-width');
    const maxwidth = el.getAttribute('data-max-width');

    widthById[parent.id] = width;
    if (+minwidth <= width && (+maxwidth >= width || maxwidth === null)) {
      el.style.display = 'block';
    } else {
      el.style.display = 'none';
    }
  });
}

// Export ai2html resizer initialization to page.js
export default function () {
  // only want one resizer on the page
  if (document.documentElement.classList.contains('g-resizer-v3-init')) return;
  document.documentElement.classList.add('g-resizer-v3-init');

  resizer();
  window.addEventListener('resize', throttle(resizer, 200));
}

/**
 * Throttle function adapted from underscore.js.
 *
 * Copyright (c) 2009-2020 Jeremy Ashkenas, DocumentCloud and Investigative
 * Reporters & Editors
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * Terms
 */

function throttle(func, wait, options = {}) {
  let timeout, context, args, result;
  let previous = 0;

  const now = Date.now || (() => new Date().getTime());

  const later = function () {
    previous = options.leading === false ? 0 : now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  const throttled = function () {
    const _now = now();
    if (!previous && options.leading === false) previous = _now;
    const remaining = wait - (_now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = _now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  return throttled;
}
