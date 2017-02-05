exports.name = 'Thing';
import mongoose from 'mongoose';

var movieSchema = new mongoose.Schema({
  title: { type: String },
  rating: String,
  releaseYear: Number,
  hasCreditCookie: Boolean
});

var Movie = mongoose.model('Movie', movieSchema);

exports.routes = (kernel) => {
  //test restify
  //GET api/v1/things
  //POST api/v1/things
  //PUT api/v1/things/:id
  //DELETE api/v1/things/:id

  kernel.restify('Thing', {
    middleware: {
      listing: [kernel.middleware.isAuthenticated()]
    }
  });

  kernel.app.get('/test-emit', (req, res) => {
    kernel.emit('SEND_MAIL', {
      template: 'welcome.html',
      subject: 'test',
      data: {
        name: 'Hello'
      },
      to: 'ranger.ht@gmail.com'
    });

    res.status(200).end();
  });

  kernel.app.get('/api/test-mongoose-plugin', (req, res) => {
    let test = kernel.model.Thing({
      text: 'This is test data',
      thing: { test: 'This is a extend field of mongoose plugin' }
    });

    test.save().then(data => {
      res.status(200).json(data);
    }, (err) => {
      res.status(500).json(err);
    });
  });

  kernel.app.get('/test', (req, res) => {});
};

exports.model = {
  Thing(kernel, config) {
    var Schema = kernel.mongoose.Schema;
    let thingSchema = new Schema({
      text: String
    });

    //demo add timestamp of kernel
    //see kernel > core > schemas
    thingSchema.plugin(kernel.schema.timestamp);

    return thingSchema;
  }
};

exports.mongoosePlugins = {
  //can change thing with any model
  Thing(kernel) {
    var Schema = kernel.mongoose.Schema;
    return function(schema, options) {
      schema.add({
        thing: {
          test: String
        }
      });
    }
  }
};

exports.module = function(kernel) {
  //attach like module
  if (!!kernel.module.Like) {
    kernel.module.Like.attachModel('Thing');
    kernel.module.Like.attachModel(Movie);
  }

  //test attach module Socketio
  kernel.module.Socket.handleEvent((socketComponent) => {
    socketComponent.socket.on('context', function(data) {
      console.log('data', data);
    });
  });
};