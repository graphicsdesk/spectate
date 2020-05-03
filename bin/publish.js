const fs = require('fs-extra');
const readline = require('readline');
const chalk = require('chalk');
const { execSync } = require('child_process');

console.log('Creating a production build...')
execSync('npm run build', { stdio: 'inherit' });
console.log();

require('./upload-assets')().catch(console.error);