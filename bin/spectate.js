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
      await require('./spectate-create');
      break;
      case 'init':
        await require('./spectate-init');
        break;
      case 'update':
        await require('./spectate-update');
        break;
    case 'download':
      await require('./download-doc')();
      break;
    default:
      console.error('Unknown command:', command);
      return;
  }
}
