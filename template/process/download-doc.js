const fs = require('fs');
const fsPromise = fs.promises;
const readline = require('readline');
const path = require('path');
const YAML = require('yaml');
const { google } = require('googleapis');
const { docToArchieML } = require('@newswire/doc-to-archieml');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/documents.readonly'];
const TOKEN_PATH = 'token.json';

const config = YAML.parse(fs.readFileSync(process.cwd() + '/config.yml').toString());
const documentId = config.DOC_URL.match(/[-\w]{25,}/)[0];

// Load client secrets from a local file.
fs.readFile(__dirname + '/credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), readDoc);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(__dirname + '/' + TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(__dirname + '/' + TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', __dirname + '/' + TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}


const LOCALS_FILLER_STR = 'BODY_LOCALS';
const PH_CONFIG = `{
  "plugins": {
    "posthtml-include": {
      "root": "./src"
    },
    "posthtml-expressions": {
      "root": "./src/partials",
      "locals": ${LOCALS_FILLER_STR}
    }
  }
}`;
/**
 * Read Doc.
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function readDoc(auth) {
  const client = google.docs({ version: 'v1', auth });
  const doc = await docToArchieML({ documentId, client });

  const phConfig = PH_CONFIG.replace(
    LOCALS_FILLER_STR,
    JSON.stringify({
      ...doc,
      DOC_URL: config.DOC_URL,
      USE_COVER_HED: config.USE_COVER_HED,
    }),
  );

  await fsPromise.writeFile(
    path.join(process.cwd(), '.posthtmlrc'),
    phConfig
  );
  console.log('[download-doc] Successfully wrote .posthtmlrc');
}
