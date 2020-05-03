const fs = require('fs-extra');
const { Asker, getRepoName } = require('./utils');

const { S3_WEBSITE_BASE } = require('./constants');

// Create new isntance of a readline asker
const asker = new Asker();

async function prepublish() {
  const packageJSON = JSON.parse(await fs.readFile('package.json'));
  const { scripts: { build } } = packageJSON;

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
  console.log('Successfully set public URL to', publicUrl);
  console.log(
    `\nDon't forget to uncomment an Arc stylesheet before publication!`,
  );
}

prepublish()
  .catch(console.error)
  .finally(() => asker.close());
