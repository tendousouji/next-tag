let _acceptObject = {};

exports.getAcceptObject = function() {
  return _acceptObject;
};

exports.publishModule = function(kernel) {
  function totalComment(schema) {
    schema.defaults({
      totalComment: {
        type: Number,
        default: 0
      }
    })
  }

  return {
    /**
     * attach mongose model to config
     * @param  {Mixed} modelName model name of mongoose model
     * @param  {Object} options   Custom options for the config
     * @return {void}
     */
    attachModel(modelName, options) {
      //TODO - upgrate module with options
      options = options || {};
      if (typeof modelName === 'string') {
        if (!kernel.model[modelName]) {
          return console.warn(`${modelName} does not exist in kernel model!`);
        }
        
        //delete kernel.mongoose.connection.models[modelName];
        //attach mongoose plugin
        kernel.model[modelName].schema.plugin(totalComment);
        //kernel.model[modelName].initialize();
        //TODO - bind more option from config
        _acceptObject[modelName] = kernel.model[modelName];
      } else {
        //check mongoose model typeof
        if (modelName.schema && typeof modelName.schema === kernel.mongoose.Schema) {
        
        }
      }
    }
  };
};