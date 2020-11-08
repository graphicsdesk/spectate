#!/usr/bin/env node

const chalk = require('chalk');

const USAGE_TEXT = `
usage: spectate <command> [<args>]

These are common Spectate commands used in various situations:

starting on a project
  create        Create a Spectate project in the current directory
  init          Set remote links for GitHub and Google Docs
  clone         Clone an existing Spectate project

working with Google Docs
  download      Download the Google Doc and update the PostHTML config
  open-doc      Open the Google Doc attached to this project

publish a project
  prepublish    Set a project's URL in our static S3 server
  publish       Create a production build and upload static assets
  gh-publish    Publish and then push to GitHub pages

'spectate update' updates the Spectate repository itself.
`;

if (process.argv.length <= 2) {
  console.log(USAGE_TEXT);
  process.exit(1);
}

spectate().catch(console.error);

async function spectate() {
  const command = process.argv[2];

  const update = require('./update');
  if (['create', 'clone'].includes(command)) {
    update();
  }

  switch (command) {
    case 'create':
      await require('./create')();
      break;
    case 'init':
      await require('./init')();
      break;
    case 'clone':
      await require('./clone')();
      break;
    case 'download':
      await require('./download-doc')();
      break;
    case 'prepublish':
      await require('./prepublish')();
      break;
    case 'publish':
      await require('./publish')();
      break;
    case 'gh-publish':
      await require('./gh-publish')();
      break;
    case 'open-doc':
      require('./open-doc')();
      break;
    case 'update':
      update();
      break;
    default:
      console.error('Unknown command:', command);
      console.error(`Try running ${chalk.cyan('spectate update')}?`);
      return;
  }
}
