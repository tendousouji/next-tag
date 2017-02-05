/**
 * Socket.io configuration
 */
'use strict';

import redisSocket from 'socket.io-redis';
import Socket from './Socket';

let handlers = [];
exports.name = 'Socket';
exports.core = (kernel) => {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  // socketio.use(require('socketio-jwt').authorize({
  //   secret: config.secrets.session,
  //   handshake: true
  // }));
  var socketio = require('socket.io')(kernel.httpServer, {
    //TODO - load from env, in production we dont need to serve client
    serveClient: true,
    path: '/socket.io-client'
  });
  //TODO - config for pub/sub client
  //pubClient : redis.createClient(config.redis.port, config.redis.host, { detect_buffers : true, auth_pass : config.redis.pass }),
  //subClient : redis.createClient(config.redis.port, config.redis.host, { detect_buffers : true, auth_pass : config.redis.pass })
  socketio.adapter(redisSocket(kernel.config.REDIS));
  kernel.socket = new Socket(kernel, socketio, function(component) {
    //call handler function
    handlers.forEach((handler) => {
      handler(component);
    });
  });

  //use kernel.socket.emitToUsers(['123'], 'test', 'data');
  //TODO - define broadcast event
};

exports.module = function(kernel) {
  //publish method for listeners
  return {
    handleEvent(handler) {
      //just pick function
      //kernel will call this function with socket component
      if (typeof handler === 'function') {
        handlers.push(handler);
      }
    }
  };
};