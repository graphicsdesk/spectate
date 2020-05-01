// CONFIGURE OUT: defaultLocals

const fs = require('fs').promises;
const path = require('path');
const { authorizeClient } = require('./authorize-docs');
const { docToArchieML } = require('./doc-to-archieml');

// Default locals values
const defaultLocals = {
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

async function init() {
  // Read in local Spectate config
  const packageContent = await fs.readFile(process.cwd() + '/package.json');
  const { spectate: config } = JSON.parse(packageContent);
  const { DOC_URL } = config;

  // If a doc URL exists, authorize a Docs client,
  // and then download and parse the text.
  let data = {};
  if (DOC_URL) {
    const client = await authorizeClient();
    data = await docToArchieML({
      client,
      documentId: DOC_URL.match(/[-\w]{25,}/)[0],
    });
  }

  // Set locals for PostHTML
  PH_CONFIG.plugins['posthtml-expressions'].locals = {
    ...defaultLocals,
    ...data,
    ...config,
  };

  // Write new config to .posthtmlrc, which triggers hot module replacement
  await writeLocalFile('.posthtmlrc', PH_CONFIG);

  // Write doc data again to data/doc.json. (Example use case: accessing
  // information in the doc in client-side JavaScript). Should probs remove.
  await writeLocalFile('./data/doc.json', data);
}

/* Writes data to a local file */
async function writeLocalFile(filename, data) {
  await fs.writeFile(
    path.join(process.cwd(), filename),
    JSON.stringify(data, null, 2),
  );
  console.log('[download-doc] Successfully wrote ' + filename);
}

init().catch(console.error);
