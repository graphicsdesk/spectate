const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');

function update() {
  // Fetch origin/master
  execSync('git fetch', { stdio: 'ignore' });

  // If SHA1 hashes for HEAD and FETCH_HEAD are equal, no need to merge
  // with origin/master
  const [headHash, upstreamHash] = execSync(
    'echo $(git rev-parse HEAD) $(git rev-parse @{u})',
  )
    .toString()
    .trim()
    .split(' ');
  if (headHash === upstreamHash) {
    console.log('Spectate is already up to date.');
    return;
  }

  // Check if package.json has changed
  const shouldReinstall = execSync(
    'git diff --name-only origin/master package.json',
  )
    .toString()
    .includes('package.json');

  // Merge local repository with FETCH_HEAD, the remote repo we just fetched
  console.log();
  console.log('Spectate has updated. Merging with origin/master.');
  execSync('git merge FETCH_HEAD', { stdio: 'inherit' });

  // If package.json changed, npm install again
  if (shouldReinstall) {
    console.log();
    console.log(
      `Re-installing dependencies with ${chalk.bold(
        'npm install',
      )} because package.json updated.`,
    );
    execSync('npm install', { stdio: 'inherit' });
  }
}

module.exports = function () {
  // Store current directory and go to Spectate directory
  const oldWorkingDir = process.cwd();
  process.chdir(path.join(__dirname, '..'));

  // Execute main update function
  update();

  // Go back to old directory
  process.chdir(oldWorkingDir);
};
