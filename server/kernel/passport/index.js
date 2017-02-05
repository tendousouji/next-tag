'use strict';

import compose from 'composable-middleware';
import expressJwt from 'express-jwt';

exports.core = (kernel) => {
  // Passport Configuration
  // TODO - check config to load stageries
  require('./local/passport').setup(kernel.model.User, kernel.config);
  require('./facebook/passport').setup(kernel.model.User, kernel.config);
  require('./google/passport').setup(kernel.model.User, kernel.config);
  require('./twitter/passport').setup(kernel.model.User, kernel.config);
};

exports.routes = (kernel) => {
  kernel.app.use('/api/auth/local', require('./local').default);
  kernel.app.use('/api/auth/facebook', require('./facebook').default);
  kernel.app.use('/api/auth/twitter', require('./twitter').default);
  kernel.app.use('/api/auth/google', require('./google').default);
};

exports.config = {
  USER_ROLES: ['admin', 'member'],
  FACEBOOK: {
    clientID: 'id',
    clientSecret: 'secret',
    callbackURL: 'url'
  },
  GOOGLE: {
    clientID: 'id',
    clientSecret: 'secret',
    callbackURL: 'url'
  },
  TWITTER: {
    clientID: 'id',
    clientSecret: 'secret',
    callbackURL: 'url'
  }
};

exports.middleware = (kernel) => {
  var validateJwt = expressJwt({
    secret: kernel.config.SECRETS.session
  });

  function isAuthenticated() {
    return compose()
      // Validate jwt
      .use(function(req, res, next) {
        // allow access_token to be passed through query parameter as well
        if (req.query && req.query.hasOwnProperty('access_token')) {
          req.headers.authorization = 'Bearer ' + req.query.access_token;
        }
        validateJwt(req, res, next);
      })
      // Attach user to request
      .use(function(req, res, next) {
        kernel.model.User.findById(req.user._id).exec()
          .then(user => {
            if (!user) {
              return res.status(401).end();
            }
            req.user = user;
            next();
          })
          .catch(err => next(err));
      });
  }

  return {
    isAuthenticated: isAuthenticated,

    /**
     * Checks if the user role meets the minimum requirements of the route
     */
    hasRole: (roleRequired) => {
      if (!roleRequired) {
        throw new Error('Required role needs to be set');
      }

      return compose()
        .use(isAuthenticated())
        .use(function meetsRequirements(req, res, next) {
          if (kernel.USER_ROLES.indexOf(req.user.role) >=
              kernel.USER_ROLES.indexOf(roleRequired)) {
            next();
          } else {
            res.status(403).send('Forbidden');
          }
        });
    }
  };
};