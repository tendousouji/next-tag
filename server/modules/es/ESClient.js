//all document see here https://github.com/elastic/elasticsearch-js
import elasticsearch from 'elasticsearch';

class ESClient {
  constructor(options) {
    this.options = options || {};
    this.client = new elasticsearch.Client(options);
  }

  safeCb (cb) {
    cb = typeof cb === 'function' ? cb : (() => {});
    return cb;
  }

  exists(index, cb) {
    return this.client.indices.exists({index: index}, this.safeCb(cb));
  }

  createIndice(name, settings, cb) {
    settings = settings || {};
    return this.client.indices.create({ index: name, body: settings }, this.safeCb(cb));
  }

  deleteInice(name, cb) {
    return this.client.indices.delete({ index: name }, this.safeCb(cb));
  }

  putMapping (index, options, cb) {
    options = options || {};
    return this.client.indices.putMapping({ index: index, type: options.type, body: options.mapping }, this.safeCb(cb));
  }

  create(index, options, cb) {
    options = options || {};
    return this.client.create({ index: index, type: options.type, id: options.id, body: options.data }, this.safeCb(cb));
  }

  update(index, options, cb) {
    options = options || {};
    return this.client.update({ index: index, type: options.type, id: options.id, body: { doc: options.data } }, this.safeCb(cb));
  }

  delete(index, options, cb) {
    options = options || {};
    return this.client.delete({ index: index, type: options.type, id: options.id }, this.safeCb(cb));
  }

  search(index, query, type, cb) {
    let params = {index: index, body: query};
    if(type) params.type = type;
    return this.client.search(params, this.safeCb(cb));
  }
}

module.exports = ESClient;