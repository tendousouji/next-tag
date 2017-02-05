'use strict';

class Mapping {
  constructor(config) {
    this.config = config;
    this.mapping = {};
    this.mapping[this.config.mapping.userType] = this.userMapping();
    this.mapping[this.config.mapping.eventType] = this.eventMapping();
    this.mapping[this.config.mapping.commentType] = this.commentMapping();
  }

  userMapping() {
    let mapping = {};
    mapping[this.config.mapping.userType] = {
      properties: {
        // put mapping for user properties here
      }
    };

    return mapping;
  }

  eventMapping() {
    let mapping = {};
    mapping[this.config.mapping.eventType] = {
      properties: {
        name: {
          type: "string",
          index_analyzer: "autocomplete_term",
          search_analyzer: "autocomplete_search"
        },
        location: {
          type: 'object',
          properties: {
            coordinates: {
              type: 'geo_point'
            }
          }
        },
        createdAt: {
          type: 'date'
        }
        // put mapping for event properties here
      }
    };

    return mapping;
  }

  commentMapping() {
    let mapping = {};
    mapping[this.config.mapping.commentType] = {
      properties: {
        // put mapping for comment properties here
      }
    };

    return mapping;
  }

  // add more mapping
}
module.exports = Mapping;
