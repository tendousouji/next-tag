'use strict';

import inflection from 'inflection';
import _ from 'lodash';

var walkSubstack = function (stack, req, res, next) {
  if (typeof stack === 'function') {
    stack = [stack];
  }

  var walkStack = function (i, err) {
    if (err) { return next(err); }

    if (i >= stack.length) {
      return next();
    }

    stack[i](req, res, walkStack.bind(null, i + 1));
  };

  walkStack(0);
};

class Restify {
  /**
   * [constructor description]
   * @param  {[type]} app    [description]
   * @param  {[type]} config
   * {
   *   prefix: '/api/v1', //default or load from config
   *   model: 'ModelName'
   * }
   * @return {[type]}        [description]
   */
  constructor(kernel, modelName, options) {
    //create CURD base config
    if (!modelName) {
      throw new Error('Model is required for restify module');
    }

    this.options = Object.assign({
      middleware: {},
      enableListing: true,
      enableCreate: true,
      enableUpdate: true,
      enableDelete: true
    }, (options || {}));
    let restName = inflection.pluralize(modelName.toLowerCase());

    this.kernel = kernel;
    this.modelName = modelName;

    if (this.options.enableListing) {
      let listingUrl = `${kernel.config.REST_PREFIX}${restName}`;
      kernel.app.get(listingUrl, this.list.bind(this));
    }

    if (this.options.enableCreate) {
      let createUrl = `${kernel.config.REST_PREFIX}${restName}`;
      kernel.app.post(createUrl, this.create.bind(this));
    }

    if (this.options.enableUpdate) {
      let updateUrl = `${kernel.config.REST_PREFIX}${restName}/:id`;
      kernel.app.put(updateUrl, this.update.bind(this));
    }

    if (this.options.enableDelete) {
      let updateUrl = `${kernel.config.REST_PREFIX}${restName}/:id`;
      kernel.app.delete(updateUrl, this.delete.bind(this));
    }
  }

  /**
   * list all model objects by query string
   */
  list(req, res, next) {
    /* jshint ignore:start */
    function mainFunc() {
      //TODO - get query string for paging, sort...
      let params = {};
      this.kernel.model[this.modelName].find(params)
      .then(resp => {
        res.status(200).json(resp);
      })
      .catch(err => {
        //TODO - handle error
        res.status(422).json(this.kernel.errorsHandler.parseError(err));
      });
    }

    let middlewares = [mainFunc.bind(this)];
    if (this.options.middleware.listing && Array.isArray(this.options.middleware.listing)) {
      middlewares = this.options.middleware.listing.concat(middlewares);
    }
    walkSubstack(middlewares, req, res, next);
    /* jshint ignore:end */
  }

  /**
   * create new object
   */
  create(req, res, next) {
    /* jshint ignore:start */
    function mainFunc() {
      let model = new this.kernel.model[this.modelName](req.body);
      model.save().then(created => {
        let eventName = this.modelName.toUpperCase() + '_CREATED';
        this.kernel.emit(eventName, created);

        res.status(200).json(created);
      })
      .catch(err => {
        res.status(422).json(this.kernel.errorsHandler.parseError(err));
      });
    }

    let middlewares = [mainFunc.bind(this)];
    if (this.options.middleware.create && Array.isArray(this.options.middleware.create)) {
      middlewares = this.options.middleware.listing.concat(middlewares);
    }
    walkSubstack(middlewares, req, res, next);
    /* jshint ignore:end */
  }

  /**
   * create new object
   */
  update(req, res, next) {
    /* jshint ignore:start */
    function mainFunc() {
      this.kernel.model[this.modelName].findById(req.params.id)
      .then(model => {
        if (!model) {
          return res.status(404).end();
        }

        if (req.body._id) {
          delete req.body._id;
        }

        let updated = _.merge(model, req.body);
        return updated.save()
        .then(updatedData => {
          let eventName = this.modelName.toUpperCase() + '_UPDATED';
          this.kernel.emit(eventName, updatedData);

          res.status(200).json(updatedData);
        });
      })
      .catch(err => {
        //TODO - handle error
        res.status(422).json(this.kernel.errorsHandler.parseError(err));
      });
    }

    let middlewares = [mainFunc.bind(this)];
    if (this.options.middleware.update && Array.isArray(this.options.middleware.update)) {
      middlewares = this.options.middleware.listing.concat(middlewares);
    }
    walkSubstack(middlewares, req, res, next);
    /* jshint ignore:end */
  }

  /**
   * delete a single record
   */
  delete(req, res, next) {
    /* jshint ignore:start */
    function mainFunc() {
      this.kernel.model[this.modelName].findById(req.params.id)
      .then(model => {
        if (!model) {
          return res.status(404).end();
        }

        return model.remove()
        .then(() => {
          let eventName = this.modelName.toUpperCase() + '_DELETED';
          this.kernel.emit(eventName, model);

          res.status(200).end();
        });
      })
      .catch(err => {
        //TODO - handle error
        res.status(422).json(this.kernel.errorsHandler.parseError(err));
      });
    }
    let middlewares = [mainFunc.bind(this)];
    if (this.options.middleware.delete && Array.isArray(this.options.middleware.delete)) {
      middlewares = this.options.middleware.delete.concat(middlewares);
    }
    walkSubstack(middlewares, req, res, next);
    /* jshint ignore:end */
  }
}

exports.config = {
  //have to have / at the end
  REST_PREFIX: '/api/v1/'
};

exports.core = (kernel) => {
  kernel.restify = (modelName, options) => {
    return new Restify(kernel, modelName, options);
  };
};