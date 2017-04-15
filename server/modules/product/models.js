module.exports = {
  Product(kernel) {
    let Schema = kernel.mongoose.Schema;
    let productSchema = new Schema({
      productId: { type: String, required: true },
      productLink: { type: String, required: true },
      productName: { type: String, required: true },
      price: { type: String, required: true },
      discount: { type: String, required: true },
      originPrice: { type: String, required: true },
      image: { type: String, required: true },
      website: { type: String, required: true },
      categoryId: kernel.mongoose.Schema.Types.ObjectId
    });

    productSchema.plugin(kernel.schema.timestamp);

    return productSchema;
  }
}
