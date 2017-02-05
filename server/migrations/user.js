/**
 * Populate DB with sample data on server start
 */

'use strict';
import async from 'async';

module.exports = (UserModel, cb) => {
  async.waterfall([
    (cb) => {
      UserModel.find({})
      .remove()
      .then(() => {
        UserModel.create({
          provider: 'local',
          name: 'Test User',
          email: 'test@example.com',
          password: 'test'
        }, {
          provider: 'local',
          role: 'admin',
          name: 'Admin',
          email: 'admin@example.com',
          password: 'admin'
        })
        .then(() => {
          console.log('finished populating users');
          cb();
        });
      });
    }
  ], () => {
    cb();
  });
};
