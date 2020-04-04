#!/usr/bin/env node

const opn = require('opn');
const path = require('path');
const { exec } = require('child_process');
const { Asker, setFileKeySync } = require('./utils');

const TEMPLATE_DOC_URL = 'https://docs.google.com/document/d/1JV2fVhKWMo1MHIJqL3oq10mRSOrWPO_iRnRkmD92N5g/edit';

const googleDocsRegex = /docs\.google\.com\/document(\/u\/\d)?\/d\/[-\w]{25,}/;

function init() {
  const asker = new Asker();
  asker.question(`Enter a slug`, path.basename(process.cwd()))
    .then(line => {
      setFileKeySync('package.json', 'name', line);
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
      return asker.retry(
        () => asker.question(
          'Enter the Google Docs URL',
          null,
          googleDocsRegex.test.bind(googleDocsRegex),
          { o: () => opn(TEMPLATE_DOC_URL) },
        ),
      );
    })
    .then(line => setFileKeySync('config.json', 'DOC_URL', line))
    .catch(console.error)
    .finally(() => asker.close());
};

init();
