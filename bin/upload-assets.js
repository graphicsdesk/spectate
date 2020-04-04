#!/usr/bin/env node

const fs = require('fs');
const AWS = require('aws-sdk');
const mime = require('mime-types');

const { S3_WEBSITE_BASE } = require('./constants');
DIST_DIR = './dist';

AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: 'spectate' });
const {
  name: Prefix,
  scripts: { build: buildScript },
} = JSON.parse(fs.readFileSync('package.json').toString());
const s3 = new AWS.S3();
const Bucket = 'spectator-static-assets';

const deleteObject = ({ Key }) =>
  new Promise((resolve, reject) => {
    s3.deleteObject({ Bucket, Key }, (err, data) => {
      if (err) reject(err);
      else {
        console.log('delete:', Key);
        resolve(data);
      }
    });
  });

const listObjects = () =>
  new Promise((resolve, reject) => {
    s3.listObjectsV2({ Bucket, Prefix }, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

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
        console.log('upload:', filename);
        resolve(data);
      }
    });
  });

async function uploadDir() {
  if (buildScript.indexOf(S3_WEBSITE_BASE) < 0) {
    console.log('Skipping S3 upload because build script does not use an public URL of the form:', S3_WEBSITE_BASE);
    return;
  }

  // Remove all objects in current prefix
  await listObjects()
    .then(({ Contents }) => Promise.all(Contents.map(deleteObject)));
  
  // Upload all objects in dist to prefix
  await Promise.all(fs.readdirSync('./dist').map(putObject));
};

uploadDir();
