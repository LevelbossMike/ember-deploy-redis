# Ember-deploy-redis [![Build Status](https://travis-ci.org/LevelbossMike/ember-deploy-redis.svg?branch=master)](https://travis-ci.org/LevelbossMike/ember-deploy-redis)

This is the redis-adapter implementation to use [Redis](http://redis.io) with
[ember-deploy](https://github.com/levelbossmike/ember-deploy).

## Securely deploying your app

If your redis instance is isolated in a local intranet for security purposes, there is an option to open a SSH tunnel to the redis instance. To configure your ssh tunnel, provide the configuration in your environment:

```javascript
module.exports = {
  development: {
    buildEnv: 'production',
    store: {
      type: 'redis',
      host: '10.12.0.0',
      port: 6379,
      ssh: {
        username: 'deploy',
        privateKey: '<my-private-key>'
      }
    }
  }
};
```
