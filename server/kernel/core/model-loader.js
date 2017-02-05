'use strict';
import _ from 'lodash';

module.exports = (kernel) => {
  kernel.mongoose.Schema.prototype.defaults = function(defaults){
    var _this = this;
    _.each(defaults, function(value, key){
      // if we already have this path in schema then skip it
      if(_this.path(key)){
        return;
      }
      _this.path(key, value);
    });
  };

  // jshint expr: true
  kernel.model || (kernel.model = {});

  Object.keys(kernel._modelSchemas).forEach(function(name) {
    var schema = kernel._modelSchemas[name](kernel);

    if(schema instanceof kernel.mongoose.Schema) {
      //TODO - apply mongoosePlugins
      if (kernel._mongoosePlugins[name] && Array.isArray(kernel._mongoosePlugins[name])) {
        kernel._mongoosePlugins[name].forEach(function(pluginFunctionFactory) {
          if (typeof pluginFunctionFactory === 'function') {
            schema.plugin(pluginFunctionFactory(kernel));
          } else {
            throw new Error('Plugin Function for ' + name + ' is not valid');
          }
        });
      }

      // TODO: maybe this should be done in the mongoose plugin
      // for now we just assume that mongoConnection is always present
      kernel.model[name] = kernel.mongoConnection.model(name, schema);
    } else {
      // assuming the only other type of model is group which already return a model
      kernel.model[name] = schema;
    }
  });
};
