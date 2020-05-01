/**
 * Adapted from https://github.com/rdmurphy/doc-to-archieml
 * 
 * MIT License
 
 * Copyright (c) 2019 Ryan Murphy
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const { load } = require('archieml');
const { google: googleApisInstance } = require('googleapis');

function defaultFormatter(textRun) {
  // sometimes the content isn't there, and if so, make it an empty string
  let content = textRun.content || '';

  // step through optional text styles to check for an associated URL
  if (!textRun.textStyle) return content;

  // add inline style tags
  if (textRun.textStyle.italic) {
    content = content.replace(/([^\n]+)(\n)?/,'<i>$1</i>$2');
  }
  if (textRun.textStyle.bold) {
    content = content.replace(/([^\n]+)(\n)?/,'<b>$1</b>$2');
  }
  return content;
}

function readParagraphElement(element, formatter) {
  // pull out the text
  const textRun = element.textRun;

  // sometimes it's not there, skip this all if so
  if (textRun) {
    const content = formatter(textRun);
    
    if (!textRun.textStyle.link) return content;
    if (!textRun.textStyle.link.url) return content;

    // if we got this far there's a URL key, grab it...
    const url = textRun.textStyle.link.url;

    // ...but sometimes that's empty too
    if (url) {
      return `<a href="${url}">${content}</a>`;
    } else {
      return content;
    }
  } else {
    return '';
  }
}

function readElements(document, formatter) {
  // prepare the text holder
  let text = '';

  // check if the body key and content key exists, and give up if not
  if (!document.body) return text;
  if (!document.body.content) return text;

  // loop through each content element in the body
  document.body.content.forEach(element => {
    if (element.paragraph) {
      // get the paragraph within the element
      const paragraph = element.paragraph;

      // this is a list
      const needsBullet = paragraph.bullet != null;

      if (paragraph.elements) {
        // all values in the element
        const values = paragraph.elements;

        values.forEach((value, idx) => {
          // we only need to add a bullet to the first value, so we check
          const isFirstValue = idx === 0;

          // prepend an asterisk if this is a list item
          const prefix = needsBullet && isFirstValue ? '* ' : '';

          // concat the text
          text += `${prefix}${readParagraphElement(value, formatter)}`;
        });
      }
    }
  });

  return text;
}

async function docToArchieML({
  auth,
  client,
  documentId,
  formatter = defaultFormatter,
  google = googleApisInstance,
}) {
  // create docs client if not provided
  if (!client) {
    client = google.docs({
      version: 'v1',
      auth,
    });
  }

  // pull the data out of the doc
  const { data } = await client.documents.get({
    documentId,
  });

  // convert the doc's content to text ArchieML will understand
  const text = readElements(data, formatter);

  // pass text to ArchieML and return results
  return load(text);
}

module.exports = { docToArchieML };
