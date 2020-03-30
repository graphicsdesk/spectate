#!/usr/bin/env node

const fs = require('fs');
const opn = require('opn');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process');

const TEMPLATE_DOC_URL = 'https://docs.google.com/document/d/1JV2fVhKWMo1MHIJqL3oq10mRSOrWPO_iRnRkmD92N5g/edit';
const RESET = '\x1b[0m';
const FGCYAN = '\x1b[36m';

const rl = readline.createInterface(process.stdin, process.stdout);

// Prompts a question and validates answer
const question = (message, defaultAnswer, validate = x => x.length > 0, options) =>
  new Promise((resolve, reject) => {
    message = FGCYAN + message;
    if (defaultAnswer) // Leaving line empty will default this answer
      message += ` (${defaultAnswer})`;
    if (options) // Options to perform certain actions
      message += ` [${Object.keys(options).join('|')}]`;
    rl.question(message + ': ' + RESET, line => {
      if (options && line in options) {
        options[line]();
        reject();
      }
      if (validate && validate(line)) {
        return resolve(line);
      }
      return defaultAnswer ? resolve(defaultAnswer) : reject();
    });
  });

// Allows retries with promise resolves
const retry = (fn, retries = 4, err = 'Ran out of retries.') =>
  !retries ? Promise.reject(err) : fn().catch(err => retry(fn, (retries - 1), err));

const googleDocsRegex = /docs\.google\.com\/document(\/u\/\d)?\/d\/[-\w]{25,}/;

function main() {
  question(`Enter a slug`, path.basename(process.cwd()))
    .then(line => {
      setFileKey('package.json', 'name', line);
      return new Promise((resolve, reject) => {
        exec(`git ls-remote "git@github.com:spec-journalism/${line}"`, (err, stdout, stderr) => {
          if (err) {
            console.log(stderr);
            resolve(false);
          }
          resolve(line);
        });
      });
    })
    .then(line => {
      return new Promise((resolve, reject) => {
        if (line === false) return resolve(line);
        exec(`git remote add origin "git@github.com:spec-journalism/${line}.git"`, (err, stdout, stderr) => {
          if (err) {
            console.log(stderr);
            resolve(line);
          }
          resolve(stdout);
        });
      });
    })
    .then(line => {
      return new Promise((resolve, reject) => {
        if (line === false) return resolve(line);
        exec('git remote -v', (err, stdout, stderr) => {
          if (err) return reject(err);
          resolve(stdout);
        });
      });
    })
    .then(stdout => {
      if (stdout !== false) console.log(stdout);
      return retry(
        () => question(
          'Enter the Google Docs URL',
          null,
          googleDocsRegex.test.bind(googleDocsRegex),
          { o: () => opn(TEMPLATE_DOC_URL) },
        ),
      );
    })
    .then(line => setFileKey('config.json', 'DOC_URL', line))
    .catch(console.error)
    .finally(() => rl.close());
};

main();

function setFileKey(filename, key, value) {
  const file = JSON.parse(fs.readFileSync(filename).toString());
  file[key] = value;
  fs.writeFile(filename, JSON.stringify(file, null, 2), err => {
    if (err)
      console.error(err);
  });
}
