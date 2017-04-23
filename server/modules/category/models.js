module.exports = {
    Category(kernel) {
    let Schema = kernel.mongoose.Schema;
    let categorySchema = new Schema({
      name: { type: String, required: true },
      parentCategory: { type: kernel.mongoose.Schema.Types.ObjectId, default: null, ref: 'Category' },
      childCategories: [{ type: kernel.mongoose.Schema.Types.ObjectId, ref: 'Category' }]
    });

    categorySchema.plugin(kernel.schema.timestamp);

    return categorySchema;

  }
}
