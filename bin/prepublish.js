const fs = require('fs-extra');
const chalk = require('chalk');
const { log, getRepoName } = require('./utils');
const { S3_WEBSITE_BASE } = require('./constants');

module.exports = async function () {
  const packageJSON = JSON.parse(await fs.readFile('package.json'));
  const {
    scripts: { build },
  } = packageJSON;

  // Requires repo name to be slug.
  const slug = getRepoName();
  if (!slug) {
    return;
  }
  console.log(`Using repository name ${chalk.bold(slug)} as S3 slug.`);

  // Rewrite current build script with the S3 public URL
  const publicUrl = S3_WEBSITE_BASE + '/' + slug;
  packageJSON.scripts.build = build.replace(
    /(?<=--public-url )\.(?=\s|$)/,
    publicUrl,
  );
  await fs.writeFile(
    'package.json',
    JSON.stringify(packageJSON, null, 2) + '\n',
  );
  log.success('Set public URL to ' + publicUrl);

  console.log();
  console.log("Don't forget to uncomment an Arc stylesheet!");
};
