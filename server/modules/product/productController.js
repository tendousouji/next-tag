class ProductController {
  constructor(kernel) {
    this.kernel = kernel;

    this.search = this.search.bind(this);
  }

  search(req, res) {
    var seachWord = req.body.search;
    console.log(seachWord);
    var page = parseInt(req.query.page) - 1;
    var limit = parseInt(req.query.limit);
    var startFrom = (page*limit) + 1;
    console.log(page);
    console.log(startFrom);

    let query = {
      from: startFrom,
      size: limit,
      query: {
        match_phrase: {
          productName: seachWord
        }
      }
    }

    this.kernel.ES.search(query, 'products', (err, resp) => {
      if(err) { 
        console.log(err);
        return res.status(500).json(err);
      }
      // console.log('Search Result: ' + resp.items.length);
      return res.status(200).json(resp);
    })
  }

}

module.exports = ProductController;
