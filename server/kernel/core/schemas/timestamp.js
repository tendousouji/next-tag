module.exports = function() {
  return function timestamp(schema) {
    schema.defaults({
      createdAt: {
        type: Date,
        default: Date.now,
        required: true,
        index: true
      },
      updatedAt: {
        type: Date,
        default: Date.now,
        required: true,
        index: true
      }
    });

    // Update timestamps
    schema.pre('save', function(next) {
      var now = Date.now();
      this.set('updatedAt', now);

      if(this.isNew){
        this.set('createdAt', now);
      }
      next();
    });
  };
};
