
'use strict';

process.env.DEBUG = 'actions-on-google:*';

const ActionsSdkApp = require('actions-on-google').ActionsSdkApp;
const functions = require('firebase-functions');
const axios = require('axios')
const statusUrl = functions.config().dryer.url

const http = require('http');

var instance = axios.create({
  baseURL: statusUrl,
});
const requestConfig = {
  method: 'get',
  url: '/status',
  httpAgent: new http.Agent({ keepAlive: true }),
};

exports.sayDryer = functions.https.onRequest((request, response) => {
  const app = new ActionsSdkApp({ request, response });

  function responseHandler(app) {
    // intent contains the name of the intent you defined in `initialTriggers`
    let intent = app.getIntent();
    switch (intent) {
      case app.StandardIntents.MAIN:
        app.ask('Welcome! ask me about that dryer of yours.');
        break;

      case app.StandardIntents.TEXT:
        instance.request(requestConfig)
          .then((resp) => {
            const isVibrating = resp.data.isVibrating
            const text = isVibrating ? "I'm shakin' baby" : "I'm not running at all"
            app.tell(text);
          })
          .catch((err) => {
            console.error(err)
            app.tell('oh no there was an error')
          })

        break;
      default:
        app.tell("whatever dude")
        break;
    }
  }
  // you can add the function name instead of an action map
  app.handleRequest(responseHandler);
});