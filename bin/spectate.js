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
  process.exit(0);
}

spectate().catch(console.error);

async function spectate() {
  const command = process.argv[2];

  switch (command) {
    case 'create':
      require('./spectate-create');
      break;
    case 'init':
      require('./spectate-init');
      break;
    case 'update':
      require('./spectate-update');
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
