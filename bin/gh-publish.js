const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const { DIST_DIR } = require('./constants');

module.exports = async function () {
  // Create worktree if none exists
  if (!execSync('git worktree list').toString().includes('gh-pages')) {
    console.log('Creating worktree for gh-pages...');
    console.log();

    // Clear dist directory and create worktree
    await fs.remove(DIST_DIR);
    execSync(`git worktree add ${DIST_DIR} -B gh-pages`, { stdio: 'inherit' });

    // Dist is now a branch of master. Clear all contents inside dist again.
    (await fs.readdir(DIST_DIR)).forEach(
      fname => fname !== '.git' && fs.remove(path.join(DIST_DIR, fname)),
    );
  }

  // Publish the build
  await require('./publish')(true);

  // Push to gh-pages
  process.chdir(DIST_DIR);
  execSync('git add .', { stdio: 'ignore' });

  // Check if we actually staged anything
  if (execSync('git diff-index --cached HEAD').toString().length > 0) {
    execSync(
      `git commit -m 'Deploy to gh-pages' && git push origin gh-pages -f`,
      { stdio: 'inherit' },
    );
  } else {
    console.log('Nothing new to commit.');
  }
  process.chdir('..');
};
