const path = require('path');
const fs = require('fs-extra');
const { authorizeClient } = require('./authorize-docs');
const { docToArchieML } = require('./doc-to-archieml');
const { log } = require('./utils');

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

module.exports = async function () {
  // Read in local Spectate config
  const packageContent = await fs.readFile(
    path.join(process.cwd(), '/package.json'),
  );
  const { spectate: config } = JSON.parse(packageContent);
  const { DOC_URL } = config;

  // Read in possible config for ArchieML, store default locals and formatter
  const docConfigPath = path.join(process.cwd(), '/docs.config.js');
  const { defaultLocals, formatter } = fs.pathExistsSync(docConfigPath)
    ? require(docConfigPath)
    : {};

  // If a doc URL exists, authorize a Docs client, and then download and parse
  // the text.
  let data = {};
  if (DOC_URL) {
    data = await docToArchieML({
      client: await authorizeClient(),
      documentId: DOC_URL.match(/[-\w]{25,}/)[0],
      formatter,
    });

    // Google Docs may automatically add a link to an image, even when we don't want
    // it to. This code removes it from sections and fields that may be affected.
    if (data.cover_asset && data.cover_asset.includes('<a href=')) {
      data.cover_asset = data.cover_asset.match(/">(.*)<\//)[1];
    }
    ['top', 'body'].forEach(section =>
      section in data && data[section].forEach(({ type, value }, i) => {
        if (type === 'image' && value.asset.includes('<a href=')) {
          data[section][i].value.asset = value.asset.match(/">(.*)<\//)[1];
        }
      }),
    );
  }

  // Set locals for PostHTML expressions. Some default locals should always exist
  PH_CONFIG.plugins['posthtml-expressions'].locals = {
    top: [],
    body: [],
    ...defaultLocals,
    ...data,
    ...config,
  };

  // Write config to .posthtmlrc, the only config file that triggers live reload
  await writeLocalFile('.posthtmlrc', PH_CONFIG);
};

/* Writes data to a file in the Spectate project */
async function writeLocalFile(filename, data) {
  await fs.writeFile(
    path.join(process.cwd(), filename),
    JSON.stringify(data, null, 2),
  );
  log.success('Wrote', filename);
}
