#!/usr/bin/env node

const fs = require('fs-extra');
const AWS = require('aws-sdk');
const mime = require('mime-types');
const chalk = require('chalk');
const { log, getRepoName } = require('./utils');
const { S3_WEBSITE_BASE, DIST_DIR } = require('./constants');

/* Uploads the contents of dist/ to S3 */
async function uploadAssets() {
  // Configure bucket
  AWS.config.credentials = new AWS.SharedIniFileCredentials({
    profile: 'spectate',
  });
  const {
    scripts: { build },
  } = JSON.parse(await fs.readFile('package.json'));

  if (build.indexOf(S3_WEBSITE_BASE) < 0) {
    throw 'Build script does not have an S3 public URL.';
  }

  const s3 = new AWS.S3();
  const Bucket = 'spectator-static-assets';
  const Prefix = getRepoName();

  /* Deletes a bucket object */
  const deleteObject = ({ Key }) =>
    new Promise((resolve, reject) =>
      s3.deleteObject({ Bucket, Key }, (err, data) => {
        if (err) reject(err);
        else {
          console.log(chalk.green('delete'), chalk.strikethrough(Key));
          resolve(data);
        }
      }),
    );

  /* Lists all objects prefixed by the package.json "name" key */
  const listObjects = () =>
    new Promise((resolve, reject) =>
      s3.listObjectsV2({ Bucket, Prefix: Prefix + '/' }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      }),
    );

  /* Puts a file into a bucket */
  const putObject = filename =>
    new Promise((resolve, reject) => {
      const fileStream = fs.createReadStream(DIST_DIR + '/' + filename);
      fileStream.on('error', reject);

      filename = Prefix + '/' + filename;
      const params = {
        Bucket,
        ACL: 'public-read',
        ContentType: mime.lookup(filename) || 'application/octet-stream',
        Key: filename,
        Body: fileStream,
      };
      s3.putObject(params, (err, data) => {
        if (err) reject(err);
        else {
          console.log(chalk.green('upload'), filename);
          resolve(data);
        }
      });
    });

  try {
    console.log('Uploading build files to our static server...');
    console.log();

    // Remove all objects in current prefix
    await listObjects().then(({ Contents }) =>
      Promise.all(Contents.map(deleteObject)),
    );

    // Upload all objects in dist to prefix
    const distFiles = await fs.readdir(DIST_DIR);
    await Promise.all(distFiles.map(putObject));
  } catch (e) {
    log.error(e);
  }
}

module.exports = uploadAssets;
