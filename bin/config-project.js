const fs = require('fs-extra');
const { log } = require('./utils');

const flagToKey = {
  '--is-embed': 'IS_EMBED',
};

/**
 * Write to a Spectate project's config (as keys stored inside package.json in
 * the "spectate" key). Currently only supports --is-embed.
 */
module.exports = async function init() {
  if (process.argv.length < 4) {
    return;
  }

  const setting = process.argv[3];

  if (setting in flagToKey) {
    const key = flagToKey[setting];
    const packageJSON = require(process.cwd() + '/package.json');
    packageJSON.spectate[key] = true;
    await fs.writeFile(
      'package.json',
      JSON.stringify(packageJSON, null, 2) + '\n',
    );
    log.success('Set', key, 'to true in Spectate config.');
  }
};
