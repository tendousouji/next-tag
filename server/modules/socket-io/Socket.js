import async from 'async';

module.exports = (kernel, socketIo, cb) => {
  let store = kernel.redisClient;
  let config = {
    socketsStorageDb: 'socketDB',
    appName: 'meanstack'
  };

  //TODO - select storage DB
  //store.select(config.socketsStorageDb);
  store.on('error', function (err) {
    console.error('Redis error: ' + err);
  });

  /**
   * listen process exit event and flush redisDB
   */
  process.on('exit', function(code) {
    console.log('Exit with code:', code);
    store.flushdb();
  });


  function removeSocket(id, callback) {
    store.del(id, function(err, affected) {
      if (err || !affected) {
        console.log('Socket connection key was not removed due to error or not found');
        console.log(err);
      } else {
        affected && console.log('Socket key ' + id + ' successfully removed');
      }

      callback(err);
    });
  }

  function emitToUsers(userIds, event, data) {
    if (!Array.isArray(userIds)) {
     userIds = [userIds];
    }
    userIds.forEach(function(userId) {
      var id = userId.toString();
      store.smembers(id, function(err, rooms) {
        if (err) {
          return console.error(err);
        }

        if (rooms && rooms.length) {
          rooms.forEach(function(room) {
            console.info('Emitting event ' + event + ' to ' + id + ' user. Room is - ' + room);
            socketIo.to(room).emit(event, data);
          });
        }
      });
    });
  }

  function emitToRoom (name, event, data) {
    var self = this;
    store.smembers(name, function(err, userIds) {
      if (err) {
        return console.error(err);
      }

      emitToUsers(userIds, event, data);
    });
  }

  //Socket prototype
  //TODO - convert to class in ES6?
  function Socket() {}

  Socket.appId = config.appName;
  Socket.room = 'room_' + Socket.appId;

  Socket.on = function(event, callback) {
    var listenerCount = kernel.listeners(event).length;
    if (listenerCount) {
      console.log('Leak issue: ' + event + '. Count: ' + listenerCount);
      kernel.removeAllListeners(event);
    }

    if (callback.length === 2) {
      console.log('callback.length');
      //kernel.onSeries(event, callback);
    } else {
      kernel.on(event, callback);
    }

    store.sadd('socketHandlers', event);
  }

  Socket.removeAllListeners = function(socketId, callback) {
    store.smembers('socketHandlers', function(err, events) {
      events.forEach(function(event) {
        /* jshint ignore:start */
        if (~event.indexOf(socketId)) {
          kernel.removeAllListeners(event);
        }
        /* jshint ignore:end */
      });

      callback();
    });
  }

  Socket.getUser = function(socketId, callback) {
    store.hgetall(socketId, function(err, data) {
      callback(err, data);
    });
  }

  Socket.emitToUsers = emitToUsers;
  Socket.emitToRoom = emitToRoom;

  function run(socketIo, callback) {
    socketIo.on('connection', function(socket) {
      //create variables for socket
      socket.address = socket.request.connection.remoteAddress + ':' + socket.request.connection.remotePort;
      socket.connectedAt = new Date();
      //debug function
      socket.log = function(...data) {
        console.log(`SocketIO ${socket.nsp.name} [${socket.address}]`, ...data);
      };
      //TODO - remove me
      console.log(`SocketIO ${socket.nsp.name} [${socket.address}] connected!`);

      callback({
        socket : socket,
        emitToUsers: emitToUsers,
        emitToRoom: emitToRoom
      });

      socket.on('context', function(data) {
        var userId = data._id;

        //Set a hashtable for each client so we can look up
        //the user and channel when they disconnect
        store.hmset(socket.id, { userId : userId, appId : Socket.appId });

        // connect socket to app room
        socket.join(Socket.room);
        store.sadd(Socket.room, userId);

        store.smembers(userId, function(err, members) {
          if (err) {
            return console.error(err);
          }

          async.each(members, function(member, next) {
            // check do we have non-active socket connection for current user and remove it if so
            if (!socket.adapter.sids[member]) {
              store.srem(userId, member, function(err, isRemoved) {
                next(err);
              });
            } else {
              next();
            }
          }, function(err) {
            if (err) {
              return console.error(err);
            }

            store.sadd(userId, socket.id);
          });
        });
      });

      socket.on('disconnect', function() {
        Socket.removeAllListeners(socket.id, function() {
          store.hgetall(socket.id, function(err, data) {
            if (err) {
              return console.error(err);
            }

            if (data && data.userId && data.appId) {
              // remove socket ID from user socket IDs collection
              store.srem(data.userId, socket.id, function(err, affected) {
                if (err || !affected) {
                  console.log('No user connections removed or error');
                  return console.error(err);
                }

                // remove socket id key
                removeSocket(socket.id, function() {

                  // check does user have more connections
                  store.scard(data.userId, function(err, connections) {
                    if (connections) {
                      return console.log('User ' + data.userId + ' still has connections');
                    }

                    // remove user id from application
                    store.srem('room_' + data.appId, data.userId, function(err, affected) {
                      if (err || !affected) {
                        console.log('User was not removed from redis application set');
                        return console.error(err);
                      }
                    });
                  });
                });
              });
            } else {
              removeSocket(socket.id, function(err) {
                console.warn('User (socket ID: ' + socket.id + ') disconnected');
              });
            }
          });
        });
      });
    });
  }

  run(socketIo, cb);
  //export socket component
  return Socket;
};