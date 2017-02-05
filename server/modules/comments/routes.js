import Joi from 'joi'
module.exports = function(kernel) {
  /**
   * Create new comment
   */
  kernel.app.post('/api/v1/comments', kernel.middleware.isAuthenticated(), (req, res) => {
    var schema = Joi.object().keys({ 
      objectId: Joi.string().required(),
      objectName: Joi.string().required(),
      content: Joi.string().min(kernel.config.COMMENT_VALIDATORS.minLength).required()
    });
    var result = Joi.validate(req.body, schema);
    if (result.error) {
      return res.status(422).json(kernel.errorsHandler.parseError(result.error));
    }
    
    var data = {
      objectName: req.params.objectName,
      objectId: req.params.objectId,
      ownerId: req.user._id
    };
    let model = new kernel.model.Comment(data);
    model.save().then(comment => {
      res.status(200).json(comment);
    })
    .catch(err => {
      res.status(500).end();
    });
  });
  
  /**
   * Get list comment parameter objectId, objectName
   */
  kernel.app.get('/api/v1/comments/:objectId/:objectName', (req, res) => {
    var page = req.query.page || 1;
    var pageSize = req.query.pagesize || kernel.config.COMMENT_PAGE_SIZE;
    kernel.model.Comment.find({objectId:req.params.objectId,objectName:req.params.objectName}) 
    .limit(pageSize)
    .skip(pageSize * (page-1))
    .then(comments => {
      return kernel.model.Comment.count({objectId:req.params.objectId,objectName:req.params.objectName})
      .then(count => {
        res.status(200).json({
            comments: comments, 
            page: page, 
            pages: Math.ceil(count / pageSize)
        });
      });
    })
    .catch(err => {
      res.status(500).end();
    });
  });
  
  /**
   * Update comment parameter id 
   */
  kernel.app.put('/api/v1/comments/:id/update', kernel.middleware.isAuthenticated(), (req, res) => {
    var conditions = { _id: req.params.id, ownerId: req.user._id}, 
    update = { $set: { content: req.body.content }}, 
    options = { new: true };
    kernel.model.Comment.findOneAndUpdate(conditions, update, options)
    .then(updated =>{
      res.status(200).json(updated);
    })
    .catch(err => {
      res.status(500).end();
    });
  });
  
  /**
   * Check user comment exists
   */
  kernel.app.get('/api/v1/comments/:objectId/:objectName/check', kernel.middleware.isAuthenticated(), (req, res) => {
    kernel.model.Comment.find({ objectId: req.params.objectId, objectName:req.params.objectName, ownerId: req.user._id}).limit(1)
    .then(comment =>{
      if (comment.length > 0){
        res.status(200).json({'exists':true});
      }else{
        res.status(200).json({'exists':false});
      }
    })
    .catch(err => {
      res.status(500).end();
    });
  });
  
  /**
   * Delete comment parameter id 
   */
  kernel.app.delete('/api/v1/comments/:id', kernel.middleware.isAuthenticated(), (req, res) => {
    var conditions = { _id: req.params.id};
    kernel.model.Comment.find(conditions)
    .then(comment =>{
      if (comment.ownerId === req.user._id || req.user.role === 'admin'){
        comment.remove().exec()
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
