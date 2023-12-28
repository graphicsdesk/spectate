const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');
const { Asker, log } = require('./utils');
const { TEMPLATES } = require('./constants');

const currentDir = process.cwd();

module.exports = async function () {
  console.log();
  // select a template to use for the project.
  const asker = new Asker();

  console.log();
  console.log("Please choose a template");

  const template = await asker.selectFromChoices(TEMPLATES);
  if (__dirname.includes(currentDir)) {
    console.log('Do not create projects in the Spectate directory. Press Control+C to abort.');
    return;
  }

  console.log(
    `Creating a new Spectate project in ${chalk.bold.magenta(currentDir)}.`,
  );

  // Copy selected templates to current directory
  await fs.remove(`${currentDir}/src`);
  if (template == "embed")
    await fs.copy(path.join(__dirname, '../templates/embed'), currentDir);
  else
    await fs.copy(path.join(__dirname, '../templates/default'), currentDir);
    if (template != "default")
      await fs.copy(path.join(__dirname, `../templates/${template}`), currentDir);
    
  // Write Spectate's version number into README
  await writeReadmeVersion();

  // Run config-project to capture flags (currently only supports --is-embed)
  await require('./config-project')();

  // Use npm to install node packages
  console.log();
  console.log(
    `Installing packages with ${chalk.bold(
      'npm install',
    )}. This might take a minute.`,
  );
  execSync('npm install', { stdio: 'inherit' });

  // Initialize git repository
  if (!isInGitRepository()) {
    execSync('git init', { stdio: 'ignore' });
    console.log('Initialized a git repository.');
    console.log();
  }

  // Run download-doc to generate default PostHTML config
  if (template != "embed")
    await require('./download-doc')();
    console.log();

  // Stage everything and create the first commit
  if (tryGitCommit()) {
    console.log('Created git commit.');
    console.log();
  }

  // Documentation messages and next steps
  console.log('Success! Inside this repository you can run several commands:');
  console.log();
  log.command('npm start', 'Starts the development server.');
  console.log();
  log.command(
    'spectate download',
    'Downloads the Google Doc and updates configuration files.',
  );
  console.log();
  log.command(
    'spectate init',
    'Configures remotes for GitHub and Google Docs.',
  );

  console.log();
  console.log('Please check the Spectate README for further instructions.');

  if(template == "embed")
    console.log(`Learn more about using Spectate embeds at this link: https://docs.google.com/document/d/1-X2lGdHIw3f4W4Lgxs0avtcZBoNwTsyobh-e94lhYUQ/edit?usp=sharing`);    
  // At the very end, close the asker
  asker.close();
};

/* Returns whether we're in a git repo */
function isInGitRepository() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

/* Tries to create an initial git commit */
function tryGitCommit() {
  try {
    execSync('git add -A', { stdio: 'ignore' });
    execSync('git commit -m "Create project with Spectate"', {
      stdio: 'ignore',
    });
    return true;
  } catch (e) {
    return false;
  }
}

/* Writes Spectate's current version into a new project's README */
async function writeReadmeVersion() {
  const { version } = require(path.join(__dirname, '../package.json'));
  const newContents = (await fs.readFile('README.md'))
    .toString()
    .replace('%VERSION%', version);
  await fs.writeFile('README.md', newContents);
}


