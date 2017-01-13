/* jshint esversion: 6 */
'use strict';

const Hapi = require('hapi');
const weather = require('./weather-filter.js')

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 9007
});

// Add the route
server.route({
    method: 'POST',
    path:'/bot',
    handler: function (request, reply) {
      var payload = request.payload;
      var text = payload.text;
      var pureText = text.replace(payload.trigger_word, "");
      payload.pureText = pureText;
      var retText = weather(payload);
      var ret = {
        text: retText
      };
      return reply(ret);
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log("Server running at: ${server.info.uri}");
});
