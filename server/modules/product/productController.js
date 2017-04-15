class ProductController {
  constructor(kernel) {
    this.kernel = kernel;

    this.search = this.search.bind(this);
  }

  search(req, res) {

    

    return res.status(200).json({'data': 'Hello World'});
  }


}

module.exports = ProductController;
