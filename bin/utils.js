const fs = require('fs-extra');
const readline = require('readline');
const chalk = require('chalk');
const path = require('path');
const { execSync } = require('child_process');

const log = {
  error: (...msg) => console.error(chalk.red('error'), ...msg),
  success: (...msg) => console.log(chalk.green('success'), ...msg),
  info: (...msg) => console.log(chalk.blue('info'), ...msg),
  command: (command, note, args = '') => {
    console.log('  ' + chalk.cyan(command), chalk.green(args));
    note && console.log('    ' + note);
  },
};


class Asker {
  constructor() {
    this.rl = readline.createInterface(process.stdin, process.stdout);
  }

  // Prompts a question and validates answer
  question({ message, validate = nonEmpty, options, commands }) {
    return new Promise((resolve, reject) => {
      if (!['?', ')'].includes(message.charAt(message.length - 1))) {
        message += ':';
      }
      message = chalk.bold(message);
      if (options) {
        message += ' ' + chalk.gray(options);
      }
      if (commands) {
        const letters = Object.keys(commands);
        const descriptions = letters
          .map(ltr => `${ltr} = ${commands[ltr].description}`)
          .join(', ');
        message += ' ' + chalk.gray(`[${letters.join('/')} (${descriptions})]`);
      }

      this.rl.question(chalk.green('? ') + message + ' ', line => {
        if (commands && line in commands) {
          commands[line]['action']();
          return resolve();
        }
        const validation = validate(line);
        if (validation.success) return resolve(line);
        return reject(validation.error);
      });
    });
  }

  async selectFromChoices(selection) {
    askChoices(selection);
    const confirmation = await this.question({
      message: `Please input your selection`,
      options: '(Input a number)',
      validate: () => ({ success: true }),
    });
    if (validNum(confirmation, selection))
      return selection[confirmation - 1]
    const retry = await this.questionWithRetries({
      message: `Please input a number less than or equal to ${selection.length}`,
      validate: isValidNumberSelection,
    });
    return selection[retry - 1]
  }


  async confirmSlugOrAsk(defaultSlug) {
    const confirmation = await this.question({
      message: `Use "${defaultSlug}" as slug?`,
      options: '(y/n)',
      validate: () => ({ success: true }),
    });
    if (confirmation === 'y') {
      return defaultSlug;
    }
    return await this.questionWithRetries({
      message: 'Enter a slug',
      validate: isValidRepoName,
    });
  }

  async questionWithRetries(questionObj, numTries = 3) {
    let answer;
    while (!answer) {
      try {
        answer = await this.question(questionObj);
      } catch (err) {
        if (--numTries === 0) {
          throw err + ' No tries left.';
        }
        console.error(err, numTries, 'tries left.');
      }
    }
    return answer;
  }

  close() {
    this.rl.close();
  }
}

// Rewrites a file with an updated key value pair
// Can set key inside "spectate" key if isSpectateKey
async function setPackageKey(key, value, isSpectateKey) {
  const filename = 'package.json';
  const file = JSON.parse((await fs.readFile(filename)).toString());
  let fileRoot = file;
  if (isSpectateKey) {
    // Accommodating older Spectate projects that don't have a "spectate" key
    fileRoot = file.spectate || (file.spectate = {});
  }
  fileRoot[key] = value;
  await fs.writeFile(filename, JSON.stringify(file, null, 2) + '\n');
}

// Validator for whether a string is empty
function nonEmpty(s) {
  if (s.length > 0) return { success: true };
  return { error: 'User gave empty string.' };
}

// Getse repo name of a project
function getRepoName() {
  try {
    const remoteOrigin = execSync('git config --get remote.origin.url');
    return path.basename(remoteOrigin.toString().trim(), '.git');
  } catch (e) {
    log.error(
      `Remote origin is not set. Have you run ${chalk.cyan('spectate init')}?`,
    );
    return false;
  }
}

function getOrgName() {
  try {
    const remoteOrigin = execSync('git config --get remote.origin.url');
    return remoteOrigin.toString().split('/')[0].split(':')[1];
  } catch (e) {
    log.error(
      `Remote origin is not set. Have you run ${chalk.cyan('spectate init')}?`,
    );
    return false;
  }
}
// Validator for whether a string is a valid GitHub repository name
function isValidRepoName(s) {
  if (s.match(/^[A-Za-z0-9_.-]+$/)) return { success: true };
  return { error: 'Invalid GitHub repository name.' };
}

function askChoices(selection) {
  selection.forEach((item, index) => {
    console.log(`${index + 1}. ${item}`)
  })
}


function isValidNumberSelection(i) {
  if (validNum(i)) return { success: true };
  return { error: 'Invalid Template Selection.' };
}

function validNum(i, selection) {
  return (!isNaN(i) && i >= 1 && i <= selection.length);
}

module.exports = { Asker, setPackageKey, getRepoName, getOrgName, log };
