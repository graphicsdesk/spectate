const fs = require('fs');
const readline = require('readline');

const RESET = '\x1b[0m';
const FGCYAN = '\x1b[36m';

class Asker {
  constructor() {
    this.rl = readline.createInterface(process.stdin, process.stdout);
  }

  // Prompts a question and validates answer
  question(message, defaultAnswer, validate = x => x.length > 0, options) {
    return new Promise((resolve, reject) => {
      message = FGCYAN + message;
      if (options) // Options to perform certain actions
        message += ` [${Object.keys(options).join('|')}]`;
      if (![ '?', ')' ].includes(message.charAt(message.length - 1)))
        message += ':';
      message += ' ';
      if (defaultAnswer) // Leaving line empty will default this answer
        message += `(${defaultAnswer}) `;
      this.rl.question(message + RESET, line => {
        if (options && line in options) {
          options[line]();
          return reject();
        }
        if (validate && validate(line)) {
          return resolve(line);
        }
        return defaultAnswer ? resolve(defaultAnswer) : reject();
      });
    });
  }

  // Allows retries with promise resolves
  retry(fn, retries = 4, err = 'Ran out of retries.') {
    return !retries ? Promise.reject(err) : fn().catch(err => this.retry(fn, (retries - 1), err));
  }

  close() {
    this.rl.close();
  }
}

// Rewrites a file with an updated key value pair
function setFileKeySync(filename, key, value) {
  const file = JSON.parse(fs.readFileSync(filename).toString());
  file[key] = value;
  fs.writeFileSync(filename, JSON.stringify(file, null, 2), err => {
    if (err)
      console.error(err);
  });
}

module.exports = { Asker, setFileKeySync };
