#!/usr/bin/env node

if (process.argv.length <= 2) {
  console.log(`usage: spectate <command>

These are common Spectate commands:
  create        Create a Spectate project
  init          Set remote links for a newly created project
  clone         Clone an existing Spectate project
  download      Download the Google Doc
  build         Clear the contents of dist/ and npm run build
  prepublish    Configure public S3 URL
  publish       Build and upload assets
  gh-publish    Publish and push to a gh-pages branch
  update        Update the Spectate repository itself`);
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
      require('./create');
      break;
    case 'init':
      require('./init');
      break;
    case 'clone':
      require('./clone');
      break;
    case 'update':
      update();
      break;
    case 'prepublish':
      require('./prepublish');
      break;
    case 'publish':
      await require('./publish')();
      break;
    case 'gh-publish':
      require('./gh-publish');
      break;
    case 'upload-assets':
      await require('./upload-assets')();
      break;
    case 'download':
      await require('./download-doc')();
      break;
    default:
      console.error('Unknown command:', command);
      return;
  }
}
