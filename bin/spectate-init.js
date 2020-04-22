#!/usr/bin/env node

const opn = require('opn');
const path = require('path');
const { execSync } = require('child_process');
const { Asker, setPackageKey } = require('./utils');

const TEMPLATE_DOC_URL =
  'https://docs.google.com/document/d/1JV2fVhKWMo1MHIJqL3oq10mRSOrWPO_iRnRkmD92N5g/edit';

const asker = new Asker();

async function init() {

  // Use repository name as default slug
  let slug = path.basename(process.cwd());
  const confirmation = await asker.question(`Use "${slug}" as slug? (y/n)`);
  if (confirmation !== 'y') {
    slug = await asker.askForSlug();
  }

  // Set name in package.json to slug
  await setPackageKey('name', slug);

  // Check if repository exists
  let repositoryExists;
  try {
    execSync(`git ls-remote git@github.com:graphicsdesk/${slug}.git`, {
      stdio: 'ignore',
    });
    repositoryExists = true;
  } catch (err) {
    console.log(`Repository graphicsdesk/${slug} doesn't exist.`);
  }

  // Add remote origin if repository exists
  if (repositoryExists) {
    try {
      execSync(
        `git remote add origin git@github.com:graphicsdesk/${slug}.git`,
        { stdio: 'ignore' },
      );
      console.log(
        `Added remote origin git@github.com:graphicsdesk/${slug}.git`,
      );
    } catch (e) {
      console.log(
        'A remote origin already exists:',
        execSync('git remote get-url origin').toString().trim(),
      );
    }
  }

  console.log();

  // Ask for Google Doc
  let url;
  let numTries = 3;
  while (!url && numTries > 0) {
    try {
      url = await asker.question(
        'Enter the Google Docs URL',
        null,
        isValidGoogleDocsURL,
        { o: () => opn(TEMPLATE_DOC_URL) },
      );
    } catch (err) {
      console.error(err, --numTries, 'tries left');
    }
  }

  // Set google doc url in config
  if (url) {
    await setPackageKey('DOC_URL', url, true);
    console.log(
      'Successfully set DOC_URL in the "spectate" key in package.json.',
    );
  }

}

init()
  .catch(console.error)
  .finally(() => asker.close());

function isValidGoogleDocsURL(s) {
  if (/docs\.google\.com\/document(\/u\/\d)?\/d\/[-\w]{25,}/.test(s))
    return { success: true };
  return { error: 'Invalid Google Docs link.' };
}
