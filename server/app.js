'use strict';

import KernelFactory from './kernel';
import path from 'path';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
let config = require('./config/environment');
let kernel = new KernelFactory(config);

//load custom module
kernel.loadModule(require('./modules/mailer'));
kernel.loadModule(require('./modules/socket-io'));
kernel.loadModule(require('./modules/user'));
kernel.loadModule(require('./modules/like'));
kernel.loadModule(require('./modules/comments'));
kernel.loadModule(require('./modules/thing'));
kernel.loadModule(require('./modules/es'));
// kernel.loadModule(require('./modules/crawler'));
kernel.loadModule(require('./modules/TikiData'));
kernel.loadModule(require('./modules/LazadaData'));
kernel.loadModule(require('./modules/HotDealData'));
kernel.loadModule(require('./modules/product'));
kernel.loadModule(require('./modules/category'));
// kernel.loadModule(require('./modules/crawler'));
//co0mpose then start server
kernel.compose();

//custom app path
//TODO - can move to kernel?
// All undefined asset or api routes should return a 404
kernel.app.route('/:url(api|auth|components|app|bower_components|assets|lib|styles)/*')
 .get((req, res) => { res.status(404).send('Not found!'); });

// All other routes should redirect to the index.html
kernel.app.route('/*')
  .get((req, res) => {
    //TODO - get app path base on env
    res.sendFile(path.resolve('client/index.html'));
  });

kernel.startHttpServer();

// Expose kernel
exports = module.exports = kernel;