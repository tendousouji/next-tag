module.exports = exports = function(kernel) {

  /**
   * @ngdoc function
   * @name schema.thing
   * @description
   * Mongoose Plugin helper to add schema.org's Thing properties
   * @param {object} schema the schema which will be added with the Thing properties
   * @param {object} options the option object (indexName)
   */
  var thing = function (schema, options) {
    schema.defaults({
      additionalType: String,
      alternateName: String,
      description: String,
      image: String,
      name: String,
      sameAs: String,
      url: String
    });

    if (options && options.indexName) {
      schema.path('name').index(options.indexName);
    }
  };

  return thing;
};
