'use strict';

import express from 'express';
import http from 'http';
import morgan from 'morgan';
import compression from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import path from 'path';

exports.name = 'kernel-app';

exports.config = {
  PUBLIC_PATHS: [
    path.resolve('./client')
  ]
};

// Expose app
exports.core = (kernel) => {
  kernel.app = express();
  kernel.app.use(morgan('dev'));
  kernel.app.use(compression());
  kernel.app.use(bodyParser.urlencoded({ extended: false }));
  kernel.app.use(bodyParser.json());
  kernel.app.use(methodOverride());
  kernel.app.use(cookieParser());
  //public folders
  let publicFolders = typeof kernel.config.PUBLIC_PATHS === 'string' ? [kernel.config.PUBLIC_PATHS] : kernel.config.PUBLIC_PATHS;
  kernel.config.PUBLIC_PATHS.forEach(folderPath => {
    kernel.app.use(express.static(folderPath));
  });
  //TODO - support https
  kernel.httpServer = http.createServer(kernel.app);
};
