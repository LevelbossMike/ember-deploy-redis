/* jshint node: true */
'use strict';

var RedisAdapter = require('./lib/redis');

module.exports = {
  name: 'ember-deploy-redis',
  type: 'ember-deploy-addon',

  adapters: {
    index: {
      'redis': RedisAdapter
    }
  }
};
