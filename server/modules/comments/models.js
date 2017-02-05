import moduleConfig from './moduleconfig';

module.exports = {
  Comment(kernel) {
    let Schema = kernel.mongoose.Schema;
    let commentSchema = new Schema({
      ownerId: kernel.mongoose.Schema.Types.ObjectId,
      objectId:  kernel.mongoose.Schema.Types.ObjectId,
      objectName: String,
      content: String,
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });

    //import timestamp for auto create updatedAt, createdAt field manually
    commentSchema.plugin(kernel.schema.timestamp);

    commentSchema.post('save', (doc) => {
      let attachModel = moduleConfig.getAcceptObject();
      if (!attachModel[doc.objectName]) {
        //do nothing
        return;
      }

      //otherwise increase totalcomment
      //TODO - fire event such as totalcomment added to all subscriber
      attachModel[doc.objectName].findByIdAndUpdate(doc.objectId, {$inc: {totalComment: 1}});
    });

    return commentSchema;
  }
};

