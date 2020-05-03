#!/usr/bin/env node

const fs = require('fs-extra');
const readline = require('readline');
const chalk = require('chalk');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json
const SCOPES = ['https://www.googleapis.com/auth/documents.readonly'];
const CREDENTIALS_PATH = __dirname + '/../keys/credentials.json';
const TOKEN_PATH = __dirname + '/../keys/token.json';

/**
 * Create an OAuth2 client with credentials, and then return the authorized
 * client.
 */
async function authorizeClient() {
  // Load client secrets from a local file
  const credentials = JSON.parse(await fs.readFile(CREDENTIALS_PATH));

  // Create OAuth2 client
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0],
  );

  let token;
  try {
    token = JSON.parse(await fs.readFile(TOKEN_PATH));
  } catch (e) {
    // Token file does not exist.
    token = await getNewToken(oAuth2Client);
  }
  oAuth2Client.setCredentials(token);

  return google.docs({ version: 'v1', auth: oAuth2Client });
}

module.exports = { authorizeClient };

/**
 * Get and store new token after prompting for user authorization.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
async function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log(
    chalk.cyan(
      `It seems like it's your first time downloading a Google Doc.\nAuthorize Spectate to do so by visiting this url:`,
    ),
    authUrl,
  );

  // Get token
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const token = await new Promise((resolve, reject) => {
    rl.question(chalk.cyan('Enter the code from that page here: '), code => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err)
          return reject('Error while trying to retrieve access token. ' + err);
        resolve(token);
      });
    });
  });

  // Store token
  await fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log(chalk.cyan('Token stored successfully.'), '\n');

  return token;
}
