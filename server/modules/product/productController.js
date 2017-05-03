class ProductController {
  constructor(kernel) {
    this.kernel = kernel;

    this.search = this.search.bind(this);
  }

  search(req, res) {

    var seachWord = req.body.search;
    console.log(seachWord);

    let query = {
      query: {
        term: {
          productName: seachWord
        }
      }
    }

    this.kernel.ES.search(query, 'products', (err, resp) => {
      if(err) { 
        console.log(err);
        return res.status(500).json(err);
      }
      // console.log(resp);
      return res.status(200).json(resp);
    })

  }


}

module.exports = ProductController;
