const path = require('path');
const open = require('open');
const chalk = require('chalk');
const { execSync } = require('child_process');
const { Asker, setPackageKey, logError, logSuccess } = require('./utils');

const TEMPLATE_DOC_URL =
  'https://docs.google.com/document/d/1JV2fVhKWMo1MHIJqL3oq10mRSOrWPO_iRnRkmD92N5g/edit';

const asker = new Asker();

async function init() {
  // Confirm repository name as default slug, or input a new one. Slug input
  // error should not be caught.
  const slug = await asker.confirmSlugOrAsk(path.basename(process.cwd()));

  // Set package name to slug
  await setPackageKey('name', slug);

  // Check if repository exists
  let repositoryExists;
  try {
    execSync(`git ls-remote git@github.com:graphicsdesk/${slug}.git`, {
      stdio: 'ignore',
    });
    repositoryExists = true;
  } catch (err) {
    logError(`Repository graphicsdesk/${slug} doesn't exist.`);
  }

  // Add remote origin if repository exists
  if (repositoryExists) {
    try {
      const remoteOrigin = `git@github.com:graphicsdesk/${slug}.git`;
      execSync('git remote add origin ' + remoteOrigin, { stdio: 'ignore' });
      console.log(chalk.green('success'), 'Added remote origin' + remoteOrigin);
    } catch (e) {
      logError(
        'A remote origin already exists: ' +
          execSync('git remote get-url origin').toString().trim(),
      );
    }
  }

  console.log();

  // Ask for Google Doc
  const url = await asker.questionWithRetries({
    message: 'Enter the Google Docs URL',
    validate: isValidGoogleDocsURL,
    commands: { o: async () => await open(TEMPLATE_DOC_URL) },
  });

  // Set google doc url in config
  if (url) {
    await setPackageKey('DOC_URL', url, true);
    logSuccess('Set DOC_URL in the "spectate" key in package.json.');
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
