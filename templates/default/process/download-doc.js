// Default locals values
const DEFAULT_LOCALS = {
  top: {},
  body: {},
};

// Default PostHTML config
const PH_CONFIG = {
  plugins: {
    'posthtml-include': {
      root: './src',
    },
    'posthtml-expressions': {
      root: './src/partials',
    },
  },
};

const fs = require('fs').promises;
const path = require('path');
const { google } = require('googleapis');
const { docToArchieML } = require('@newswire/doc-to-archieml');

// TODO: Centralize these path values (they are used in spectate config-docs as well)
const CREDENTIALS_PATH = '/keys/credentials.json';
const TOKEN_PATH = '/keys/token.json';

// Gets value of the --spectate-root flag (spectate download provides this)
function getSpectateRoot() {
  const pattern = /(?<=--spectate-root=).*?(?=\s|$)/;
  for (const arg of process.argv.slice(2)) {
    const match = arg.match(pattern);
    if (match) return match[0];
  }
}

// Authorizes user with OAuth2 and downloads the Google Doc
async function authorizeAndDownload(config) {
  const spectateRoot = getSpectateRoot();

  // Load client secrets from a local file
  const credentials = JSON.parse(
    await fs.readFile(spectateRoot + CREDENTIALS_PATH),
  );

  // Create OAuth2 client
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0],
  );
  try {
    const token = JSON.parse(await fs.readFile(spectateRoot + TOKEN_PATH));
    oAuth2Client.setCredentials(token);
  } catch (e) {
    // Token file does not exist.
    console.error(
      'Could not find token. Run spectate config-docs to generate it.',
    );
    console.error(e.message);
    return;
  }

  // Download the doc
  await retrieveDoc(config, oAuth2Client);
}

// Download and store doc data
async function retrieveDoc(config, auth) {
  const client = google.docs({ version: 'v1', auth });
  const doc = await docToArchieML({
    client,
    documentId: config.DOC_URL.match(/[-\w]{25,}/)[0],
  });

  // Set local variables for HTML
  PH_CONFIG.plugins['posthtml-expressions'].locals = {
    ...DEFAULT_LOCALS,
    ...doc,
    ...config,
  };

  // Write new config to .posthtmlrc, which triggers hot module replacement
  await writePostHTMLConfig(PH_CONFIG);

  // Write doc data again to data/doc.json. (Example use case: accessing
  // information in the doc in client-side JavaScript).
  await writeDataDoc(doc);
}

// Writes a config to .posthtmlrc
async function writePostHTMLConfig(config) {
  await fs.writeFile(
    path.join(process.cwd(), '.posthtmlrc'),
    JSON.stringify(config, null, 2),
  );
  console.log('[download-doc] Successfully wrote .posthtmlrc');
}

// Writes doc data to data/doc.json
async function writeDataDoc(doc) {
  await fs.writeFile(
    path.join(process.cwd(), './data/doc.json'),
    JSON.stringify(doc, null, 2),
  );
  console.log('[download-doc] Successfully wrote ./data/doc.json');
}

async function init() {
  // Read in local config file
  const packageContent = await fs.readFile(process.cwd() + '/package.json');
  const { spectate: config } = JSON.parse(packageContent);

  if (config && config.DOC_URL) {
    return authorizeAndDownload(config);
  }

  // If DOC_URL is not set, write the default .posthtmlrc
  PH_CONFIG.plugins['posthtml-expressions'].locals = {
    ...DEFAULT_LOCALS,
    ...config,
  };
  await writePostHTMLConfig(PH_CONFIG);
  await writeDataDoc({});
}

init().catch(console.error);
