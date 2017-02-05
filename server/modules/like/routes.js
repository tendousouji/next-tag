import Joi from 'joi';
import async from 'async';
import moduleConfig from './moduleconfig';

module.exports = function(kernel) {
  /**
   * Toggle like / unlike
   */
  kernel.app.post('/api/v1/likes', kernel.middleware.isAuthenticated(), (req, res) => {
    //check valid object name & id
    let schema = Joi.object().keys({
      objectId: Joi.string().required(),
      objectName: Joi.string().required()
    });

    let result = Joi.validate(req.body, schema);
    if (result.error) {
      return res.status(422).json(kernel.errorsHandler.parseError(result.error));
    }

    //get model which is supported
    let supportedModel = moduleConfig.getAcceptObject();
    if (!supportedModel[req.body.objectName]) {
      return res.status(422).end();
    }

    //find object, check acl
    supportedModel[req.body.objectName].findById(req.body.objectId)
    .then(obj => {
      if (!obj) {
        return res.status(404).end();
      }

      //toggle like/unlike by find like model and insert or delete
      kernel.model.Like.findOne({
        ownerId: req.user._id,
        objectName: req.body.objectName,
        objectId: req.body.objectI
      }).then(like => {
        if (like) {
          return like.remove().then(() => {
            res.status(200).json({ liked: false });
          });
        }

        let model = new kernel.model.Like({
          objectName: req.params.objectName,
          objectId: req.params.objectId,
          ownerId: req.user._id
        });
        model.save().then(() => {
          res.status(200).json({ liked: true });
        });
      });
    })
    .catch(() => { return res.status(500).end(); });
  });

  /**
   * Get list like parameter objectId, objectName
   */
  kernel.app.get('/api/v1/likes/:objectId/:objectName', (req, res) => {
    var page = req.query.page || 1;
    var pageSize = req.query.pagesize || kernel.config.LIKE_PAGE_SIZE;
    var total = 0;
    var usersLike = [];

    kernel.model.Like.find({objectId:req.params.objectId,objectName:req.params.objectName})
    .limit(pageSize)
    .skip(pageSize * (page-1))
    .then(likes => {
      async.parallel({
          fn_count: function(callback){
            kernel.model.Like.count({objectId:req.params.objectId,objectName:req.params.objectName})
            .then(count => {
              callback(null,count);
            });
          },
          fn_users: function(callback){
            let userIds = likes.map((item) => { return item.ownerId; });
            kernel.model.User.find({_id: {$in: userIds}}).then(users => {
              callback(null,users);
            });
          }
      }, function(err, results) {
          // optional callback
          total = results.fn_count;
          usersLike = results.fn_users;
          res.status(200).json({
            users: usersLike,
            page: page,
            pages: Math.ceil(total / pageSize)
          });
      })
    })
    .catch(err => {
      res.status(500).end();
    });
  });

  /**
   * Delete like parameter id
   */
  kernel.app.delete('/api/v1/likes/:id', kernel.middleware.isAuthenticated(), (req, res) => {
    var conditions = { _id: req.params.id};
    kernel.model.Like.find(conditions)
    .then(like =>{
      if (like.ownerId === req.user._id || req.user.role === 'admin'){
        like.remove().exec()
        .then(deleted =>{
          res.status(200).json(deleted);
        })
      }
      res.status(403).end();
    })
    .catch(err => {
      res.status(500).end();
    });
  });
};