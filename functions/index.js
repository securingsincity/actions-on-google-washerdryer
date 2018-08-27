
'use strict';

process.env.DEBUG = 'actions-on-google:*';

const { actionssdk } = require("actions-on-google");
const functions = require('firebase-functions');
const axios = require('axios')
const statusUrl = functions.config().dryer.url
// Create an app instance
const app = actionssdk()
const http = require('http');

var instance = axios.create({
  baseURL: statusUrl,
});
const requestConfig = {
  method: 'get',
  url: '/status',
  httpAgent: new http.Agent({ keepAlive: true }),
};

// Register handlers for Actions SDK intents

app.intent('actions.intent.MAIN', conv => {

  return instance.request(requestConfig)
    .then((resp) => {
      const isVibrating = resp.data.isVibrating
      const text = isVibrating ? "I'm shaking baby" : "I'm not running at all"
      conv.close(text);
    })
    .catch((err) => {
      console.error(err)
      conv.close("oh no there was an error");
    })
})

app.intent('actions.intent.TEXT', (conv, input) => {
  if (input === 'bye' || input === 'goodbye') {
    return conv.close('See you later!')
  }
  conv.ask(`I didn't understand. Can you tell me something else?`)
})

exports.sayDryer = functions.https.onRequest(app);