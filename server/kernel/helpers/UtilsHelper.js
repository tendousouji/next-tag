import _ from 'lodash';

class UtilsHelper {
  /**
   * replace empty string, undefined... with new value
   *
   * @param  {Object} obj   Input
   * @param  {Mixed} value replaced data
   * @return {void}
   */
  static replaceEmptyAttributes(obj, value) {
    for (let i in obj) {
      if (!obj[i]) {
        obj[i] = value;
      }
    }
  }

  /**
   * replace empty string, undefined... with new value
   *
   * @param  {Object} obj   Input
   * @return {void}
   */
  static removeEmptyAttributes(obj) {
    return _(obj).omitBy(_.isUndefined).omitBy(_.isNull).omitBy(_.isEmpty).value();
  }

  /**
   * populate response data from
   * @param  {Object} result ES result
   * @return {Object}
   */
  static populateSearchResults(result) {
    return {
      totalItem: result.hits.total,
      items: result.hits.hits.map((hit) => {
        return hit._source;
      })
    };
  }

  /**
   * populate response data from
   * @param  {Object} result ES result
   * @return {Object}
   */
  static populateSearchResult(result) {
    return result._source || null;
  }
}

module.exports = UtilsHelper;