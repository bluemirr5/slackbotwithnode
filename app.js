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
      const payload = request.payload;
      const text = payload.text;
      payload.pureText = text.replace(payload.trigger_word, "");
      const retText = weather(payload);
      const ret = {
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
