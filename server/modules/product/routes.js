import ProductController from './productController';

module.exports = (kernel) => {
  let productController = new ProductController(kernel);

  kernel.app.post('/api/v1/product_search', productController.search);

}
