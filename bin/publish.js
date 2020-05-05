const chalk = require('chalk');
const { execSync } = require('child_process');
const { log } = require('./utils');

/**
 * Creates production build and uploads assets. If we are publishing to GitHub,
 * we ignore the upload-assets S3 public URL error.
 *
 * @param {boolean} serverIsGithubPages - Whether we are publishing to GitHub.
 */
async function publish(serverIsGithubPages) {
  // Create production build
  console.log();
  console.log('Creating a production build...');
  execSync('npm run build', { stdio: 'inherit' });

  try {
    await require('./upload-assets')();
  } catch (e) {
    console.log();
    !serverIsGithubPages &&
      log.error(
        e,
        `Did you forget to run ${chalk.cyan('spectate prepublish')}?`,
      );
  }
}

module.exports = publish;
