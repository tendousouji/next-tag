import kernel from './';
import mongoose from 'mongoose';
var app = kernel.app;

after(function(done) {
  app.meanStack.on('close', () => done());
  mongoose.connection.close();
  app.meanStack.close();
});
