import _ from 'lodash';

function parseJoiError(err) {
  let errors = {};
  _.map(err.details, e => {
    if(!errors[e.path]) {
      errors[e.path] = [];
    }

    errors[e.path].push({
      type: e.type,
      message: e.message
    });
  });

  return errors;
}

function parseMongooseError(err) {
  let errors = {};
  for (let field in err.errors) {
    if (!errors[field]) {
      errors[field] = [];
    }

    errors[field].push({
      type: err.errors[field].properties.type,
      message: err.errors[field].message
    });
  }

  return errors;
}

/**
 * check & parse all error to the same format
 * @param  {Error} err
 * @return {Object}
 */
function parseError(err) {
  if (typeof err === 'object') {
    //TODO - need to check & valid error type
    if (err.isJoi || err.details) {
      return parseJoiError(err);
    } else if (err.name === 'ValidationError') {
      //mongoose error
      return parseMongooseError(err);
    }
  } else {
    return err;
  }
}

/**
 * error handler for response message
 */
module.exports = {
  parseJoiError,
  parseMongooseError,
  parseError
};