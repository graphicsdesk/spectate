const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');
const { log } = require('./utils');

if (process.argv.length <= 3) {
  console.log('Please specify the repository name:');
  log.command('spectate clone', null, '<repository-name>');
  console.log();
  console.log('For example:');
  log.command('spectate clone', null, 'ivy-coronavirus-response');
  console.log();
  process.exit(1);
}

module.exports = function () {
  // Check if the repository exists
  const repoName = process.argv[3];
  const url = `git@github.com:graphicsdesk/${repoName}.git`;
  try {
    execSync(`git ls-remote ${url}`, { stdio: 'ignore' });
  } catch (err) {
    log.error(`Repository ${url} does not exist.`);
    process.exit(1);
  }

  // Clone the repository
  console.log();
  execSync(`git clone ${url}`, { stdio: 'inherit' });
  console.log();

  // Install packages
  console.log(
    `Installing packages with ${chalk.bold(
      'npm install',
    )}. This might take a minute.`,
  );
  execSync(`npm --prefix ${repoName} install ${repoName}`, {
    stdio: 'inherit',
  });

  // Print success message and further instructions
  const repoLocation = path.join(process.cwd(), repoName);
  console.log(`Success! Cloned ${repoName} at ${repoLocation}`);
  console.log('Inside that directory, you can run several commands:');
  console.log();
  log.command('npm start', 'Starts the development server.');
  console.log();
  log.command(
    'spectate download',
    'Downloads the Google Doc, updating the PostHTML configuration.',
  );

  console.log();
  console.log('We suggest that you begin by typing:');
  console.log();
  log.command(`cd ${repoName}`);
  log.command(`npm start`);
  console.log();
  console.log('Check out the Spectate README to see all available commands.');
};
