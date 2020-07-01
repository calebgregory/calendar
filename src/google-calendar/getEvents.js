const fs = require('fs');
const path = require('path');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.resolve(__dirname, '../..', 'token.json');

const CREDENTIALS_PATH = path.resolve(__dirname, '../..', 'credentials.json');

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  return new Promise((resolve, reject) => {
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) {
        reject(new Error('Use `node quickstart/index.js` to authorize App for first time'));
      }

      oAuth2Client.setCredentials(JSON.parse(token));

      resolve(oAuth2Client);
    });
  });
}

const defaultListEventsOptions = {
  calendarId: 'primary',
  timeMin: (new Date()).toISOString(),
  maxResults: 10,
  singleEvents: true,
  orderBy: 'startTime',
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(options, auth) {
  const calendar = google.calendar({version: 'v3', auth});

  const eventsListOptions = Object.assign(defaultListEventsOptions, options)

  return new Promise((resolve, reject) => {
    calendar.events.list(eventsListOptions, (err, res) => {
      if (err) {
        return reject(err)
      }
      const events = res.data.items;
      resolve(events);
    });
  })
}

module.exports = function getEvents(options) {
  return new Promise((resolve, reject) => {
    // Load client secrets from a local file.
    fs.readFile(CREDENTIALS_PATH, (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Calendar API.
      authorize(JSON.parse(content))
        .then((authClient) => {
          return listEvents(options, authClient);
        })
        .then((events) => {
          resolve(events);
        })
        .catch((err) => {
          reject(err);
        })
    });
  })
}
