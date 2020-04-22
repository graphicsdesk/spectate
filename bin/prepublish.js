#!/usr/bin/env node

const fs = require('fs').promises;
const { Asker, getRepoName } = require('./utils');

const { S3_WEBSITE_BASE } = require('./constants');

// Create new isntance of a readline asker
const asker = new Asker();

async function prepublish() {

  // Check if build script already uses S3 public URL
  let packageJSON = await fs.readFile('package.json');
  packageJSON = JSON.parse(packageJSON.toString());
  const { scripts: { build } } = packageJSON;
  if (build.includes('--public-url ' + S3_WEBSITE_BASE)) {
    console.log('Build script already uses an S3 public URL.');
    return;
  }

  // Requires repo name to be slug.
  const slug = getRepoName();
  console.log(`Using repo name "${slug}" as S3 slug`);

  // Rewrite current build script with the S3 public URL
  const publicUrl = S3_WEBSITE_BASE + '/' + slug;
  packageJSON.scripts.build = build.replace(
    /(?<=--public-url )\.(?=\s|$)/,
    publicUrl,
  );
  await fs.writeFile('package.json', JSON.stringify(packageJSON, null, 2));
  console.log('Set public URL to', publicUrl);

}

prepublish()
  .catch(console.error)
  .finally(() => asker.close());
