exports.name = 'kernel-schema';

exports.core = (kernel) => {
  kernel.schema = {};
  kernel.schema.thing = require('./schemas/thing')(kernel);
  kernel.schema.event = require('./schemas/event')(kernel);
  kernel.schema.person = require('./schemas/person')(kernel);
  kernel.schema.timestamp = require('./schemas/timestamp')(kernel);
};
