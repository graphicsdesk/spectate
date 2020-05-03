const fs = require('fs-extra');
const { log, getRepoName } = require('./utils');

const { S3_WEBSITE_BASE } = require('./constants');

async function prepublish() {
  const packageJSON = JSON.parse(await fs.readFile('package.json'));
  const {
    scripts: { build },
  } = packageJSON;

  // Requires repo name to be slug.
  const slug = getRepoName();
  console.log(`Using repo name "${slug}" as S3 slug...`);

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
}

prepublish().catch(console.error);
