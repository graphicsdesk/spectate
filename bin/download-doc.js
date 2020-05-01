const path = require('path');
const { promises: fs, existsSync } = require('fs');
const { authorizeClient } = require('./authorize-docs');
const { docToArchieML } = require('./doc-to-archieml');

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

  // Read in possible configuration for ArchieML output
  const docConfigPath = process.cwd() + '/docs.config.js';
  let docConfig = existsSync(docConfigPath) ? require(docConfigPath) : {};

  // Set default locals and doc-to-archieml formatter
  const defaultLocals = { top: [], body: [], ...docConfig.defaultLocals };
  const { formatter } = docConfig;

  // If a doc URL exists, authorize a Docs client, and then download and parse
  // the text.
  let data = {};
  if (DOC_URL) {
    data = await docToArchieML({
      client: await authorizeClient(),
      documentId: DOC_URL.match(/[-\w]{25,}/)[0],
      formatter,
    });
  }

  // Set locals for PostHTML expressions
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

/* Writes data to a file in the Spectate project */
async function writeLocalFile(filename, data) {
  await fs.writeFile(
    path.join(process.cwd(), filename),
    JSON.stringify(data, null, 2),
  );
  console.log('Successfully wrote ' + filename);
}

init().catch(console.error);
