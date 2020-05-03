const path = require('path');
const chalk = require('chalk');
const execSync = require('child_process').execSync;
const { log } = require('./utils');

module.exports = function () {
  // Go to Spectate directory
  const oldWorkingDir = process.cwd();
  process.chdir(path.join(__dirname, '..'));

  // Fetch origin/master, and then check if package.json is different
  execSync('git fetch origin master');
  const shouldReinstall = execSync(
    'git diff --name-only origin/master package.json',
  )
    .toString()
    .includes('package.json');

  // Merge local repository with origin/master
  execSync('git pull', { stdio: 'inherit' });
  console.log();

  // If package.json changed, npm install again
  if (shouldReinstall) {
    log.info('Re-installing dependencies because package.json updated.');
    console.log(chalk.bold('npm install'));
    execSync('npm install', { stdio: 'inherit' });
  }

  process.chdir(oldWorkingDir);
};
