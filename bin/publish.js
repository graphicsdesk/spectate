const { execSync } = require('child_process');
const { log } = require('./utils');

async function publish() {
  try {
    // Create production build
    console.log('Creating a production build...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log();

    // Upload assets
    await require('./upload-assets')();
  } catch (e) {
    log.error(e);
  }
}

module.exports = publish;
