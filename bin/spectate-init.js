#!/usr/bin/env node

const opn = require('opn');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');
const { Asker, setFileKey } = require('./utils');

const TEMPLATE_DOC_URL =
  'https://docs.google.com/document/d/1JV2fVhKWMo1MHIJqL3oq10mRSOrWPO_iRnRkmD92N5g/edit';

const googleDocsRegex = /docs\.google\.com\/document(\/u\/\d)?\/d\/[-\w]{25,}/;

const asker = new Asker();

async function init() {
  console.log();
  let slug;
  while (!slug) {
    try {
      slug = await asker.question(
        'Enter a slug',
        path.basename(process.cwd()),
        isValidRepoName,
      );
    } catch (err) {
      console.error(err);
    }
  }

  // Set name in package.json to slug
  await setFileKey('package.json', 'name', slug);

  // Check if repository exists
  let repositoryExists;
  try {
    execSync(`git ls-remote git@github.com:spec-journalism/${slug}.git`, {
      stdio: 'ignore',
    });
    repositoryExists = true;
  } catch (err) {
    console.log(`Repository spec-journalism/${slug} doesnt exist.`);
  }

  // Add remote origin if repository exists
  if (repositoryExists) {
    try {
      execSync(
        `git remote add origin git@github.com:spec-journalism/${slug}.git`,
        { stdio: 'ignore' },
      );
      console.log(
        `Added remote origin git@github.com:spec-journalism/${slug}.git`,
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
  let tries = 3;
  while (!url && tries > 0) {
    try {
      url = await asker.question('Enter the Google Docs URL', null, isValidGoogleDocsURL, { o: () => opn(TEMPLATE_DOC_URL) });
    } catch (err) {
      console.error(err, --tries, 'tries left');
    }
  }

  // Set google doc url in config
  if (url) {
    await setFileKey('config.json', 'DOC_URL', url);
    console.log('Successfully set DOC_URL in config.json.')
  }
}

init().catch(console.error).finally(() => asker.close());

function isValidRepoName(s) {
  if (s.match(/^[A-Za-z0-9_.-]+$/)) return { success: true };
  return { error: 'Invalid GitHub repository name: ' + s };
}

function isValidGoogleDocsURL(s) {
  if (googleDocsRegex.test(s)) return { success: true };
  return { error: 'Invalid Google Docs link.' };
}
