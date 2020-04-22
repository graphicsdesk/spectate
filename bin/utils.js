const fs = require('fs').promises;
const readline = require('readline');
const chalk = require('chalk');
const { execSync } = require('child_process');

class Asker {
  constructor() {
    this.rl = readline.createInterface(process.stdin, process.stdout);
  }

  // Prompts a question and validates answer
  question(message, defaultAnswer, validate = nonEmpty, options) {
    return new Promise((resolve, reject) => {
      if (options) { // Options to perform certain actions
        message += ` [${Object.keys(options).join('|')}]`;
      }
      if (!['?', ')'].includes(message.charAt(message.length - 1))) {
        message += ':';
      }
      message += ' ';
      if (defaultAnswer) { // Leaving line empty will default this answer
        message += `(${defaultAnswer}) `;
      }

      this.rl.question(chalk.cyan(message), line => {
        if (options && line in options) {
          options[line]();
          return resolve(null);
        }
        if (defaultAnswer && line.length === 0) {
          return resolve(defaultAnswer);
        }
        const validation = validate(line);
        if (validation.success) return resolve(line);
        return reject(validation.error);
      });
    });
  }

  async askForSlug() {
    let slug;
    while (!slug) {
      try {
        slug = await this.question(
          'Enter a slug',
          null,
          isValidRepoName,
        );
      } catch (err) {
        console.error(err)
      }
    }
    return slug;
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
    fileRoot = file.spectate;
  }
  fileRoot[key] = value;
  await fs.writeFile(filename, JSON.stringify(file, null, 2));
}

function nonEmpty(s) {
  if (s.length > 0) return { success: true };
  return { error: 'User gave empty string.' };
}

function getRepoName() {
  return execSync(
    'basename -s .git `git config --get remote.origin.url`'
  ).toString().trim();
}

function isValidRepoName(s) {
  if (s.match(/^[A-Za-z0-9_.-]+$/)) return { success: true };
  return { error: 'Invalid GitHub repository name: ' + s };
}

module.exports = { Asker, setPackageKey, getRepoName };
