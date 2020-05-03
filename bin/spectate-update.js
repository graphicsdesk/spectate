const path = require('path');
const chalk = require('chalk');
const execSync = require('child_process').execSync;
const { log } = require('./utils');

const oldWorkingDir = process.cwd();
process.chdir(path.join(__dirname, '..'));

execSync('git fetch origin master');

const shouldReinstall = execSync('git diff --name-only origin/master package.json').toString().includes('package.json');

execSync('git pull', { stdio: 'inherit' });
console.log();

if (shouldReinstall) {
  log.info('Re-installing dependencies because package.json updated.');
  console.log(chalk.bold('npm install'));
  execSync('npm install', { stdio: 'inherit' });
}

process.chdir(oldWorkingDir);

/*
# Updating spectate is just git pulling in the spectate repo
spectate_update() {
  log "Updating the spectate repository..."

  (
    cd "$SPECTATE_ROOT" || exit
    git fetch origin master

    # $? returns the exit value of the previous statement. If the following
    # condition is successful (exit status = 0), SHOULD_REINSTALL becomes 0.
    # FYI: Breaks if spectate's origin/master or package.json does not exist
    [[ $(git diff --name-only origin/master package.json) == *package.json* ]]
    SHOULD_REINSTALL=$?

    git pull
    if [ $SHOULD_REINSTALL -eq 0 ]; then
      log "Re-installing dependencies because package.json changed..."
      npm install
    fi
  )
}
*/