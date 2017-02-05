import { EventEmitter } from 'events';
import _ from 'lodash';
import modelLoader from './core/model-loader';
import helpers from './helpers';
import errorsHandler from './errorsHandler';

/**
 * main kernel of the app
 */
class Kernel extends EventEmitter {
  constructor(config) {
    super();

    //private attr
    this._mongoosePlugins = {};
    this._modelSchemas = {};
    this._routes = [];
    this._modules = {};

    this.config = config || {};
    this.errorsHandler = errorsHandler;
    //express app
    this.app = null;
    this.model = {};
    this.helpers = helpers;
    this.middleware = {};
    this.module = {};
  }

  /**
   * Composes all plugins together and freezes the app, you cannot install more plugins after composing.
   */
  compose() {
    if (!!this._isComposed) {
      throw new Error('Can not compose twice');
    }

    modelLoader(this);

    //LOAD passport at the last because passport need to be loaded after model
    this.loadModule(require('./passport'));
    //init routes
    this._routes.forEach(route => {
      route(this);
    });

    //export modules
    for (let name in this._modules) {
      this.module[name] = typeof this._modules[name] === 'function' ? this._modules[name](this) : this._modules[name];
    }
  }

  startHttpServer() {
    //TODO - load me from config
    this.app.meanStack = this.httpServer.listen(this.config.HTTP_PORT, null, () => {
      //TODO - load env from config
      console.log('Express server listening on %d, in %s mode', this.config.HTTP_PORT, 'development');
    });
  }

  loadModule(module) {
    if (!!module.config) {
      this.config = _.defaults(this.config, module.config);
    }

    //load core module
    if (!!module.core) {
      module.core(this);
    }

    //models
    if (!!module.model) {
      for (let modelName in module.model) {
        //export model schema
        this._modelSchemas[modelName] = module.model[modelName];
      }
    }

    //load mongoose plugin
    if (!!module.mongoosePlugins) {
      for (let modelName in module.mongoosePlugins) {
        if (!this._mongoosePlugins[modelName]) {
          this._mongoosePlugins[modelName] = [];
        }

        this._mongoosePlugins[modelName].push(module.mongoosePlugins[modelName]);
      }
    }

    if (!!module.middleware) {
      let middlewares = module.middleware(this);
      for (let name in middlewares) {
        this.middleware[name] = middlewares[name];
      }
    }

    //extend routes
    if (!!module.routes) {
      this._routes.push(module.routes);
    }

    //export module
    if (!!module.module) {
      if (!module.name) {
        console.warn('Module name is required to export module');
      } else {
        this._modules[module.name] = module.module;
      }
    }

    if (typeof module === 'function') {
      module(this);
    }

    //TODO - extend more feature
  }
}

function kernelFactory(config) {
  var kernel = new Kernel(config);

  //use core module
  //NOTE: please careful, dont change position if you dont understand
  kernel.loadModule(require('./core/mongoose'));
  kernel.loadModule(require('./core/redis-client'));
  kernel.loadModule(require('./core/queue'));
  kernel.loadModule(require('./core/schema'));
  kernel.loadModule(require('./core/models/user'));
  kernel.loadModule(require('./core/class'));
  kernel.loadModule(require('./core/app'));
  kernel.loadModule(require('./core/restify'));

  return kernel;
}

//export singleton
//TODO - load config
module.exports = kernelFactory;
