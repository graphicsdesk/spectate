const fs = require('fs-extra');
const path = require('path');
const execSync = require('child_process').execSync;
const { log } = require('./utils');

const DIST_DIR = path.join(process.cwd(), 'dist');

async function ghPublish() {
  // Create worktree if none exists
  if (!execSync('git worktree list').toString().includes('gh-pages')) {
    console.log('Creating worktree for gh-pages...');
    console.log();

    // Create worktree
    await fs.remove(DIST_DIR);
    execSync(`git worktree add ${DIST_DIR} -B gh-pages`, { stdio: 'inherit' });

    // Clear all contents inside dist
    (await fs.readdir(DIST_DIR)).forEach(
      fname => fname !== '.git' && fs.remove(path.join(DIST_DIR, fname)),
    );
  }

  // Publish the build
  await require('./publish')();
  console.log();

  // Push to gh-pages
  execSync(
    `cd dist && git add . && git commit -m 'Deploy to gh-pages' && git push origin gh-pages -f`,
    { stdio: 'inherit' },
  );
}

ghPublish().catch(console.error);
