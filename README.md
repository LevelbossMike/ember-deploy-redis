# Ember-deploy-redis [![Build Status](https://travis-ci.org/LevelbossMike/ember-deploy-redis.svg?branch=master)](https://travis-ci.org/LevelbossMike/ember-deploy-redis)

This is the redis-adapter implementation to use [Redis](http://redis.io) with
[ember-deploy](https://github.com/levelbossmike/ember-deploy).

## Securely deploying your app

If your redis instance is isolated in a local intranet for security purposes, there is an option to open a SSH tunnel to the redis instance. To configure your ssh tunnel, provide the configuration in your environment.

### Deploying to a local machine

```javascript
module.exports = {
  development: {
    buildEnv: 'production',
    store: {
      type: 'redis',
      host: '10.12.0.0',
      port: 6379
    }
  }
};
```

### Deploying to external machine (reachable through ssh)

The ssh object will pass directly to [tunnel-ssh](https://github.com/Finanzchef24-GmbH/tunnel-ssh) so you can add any options to configure the tunnel destination host (dstHost) and port (dstPort), useful for instances where the default localhost isn't where your redis lives.

```javascript
module.exports = {
  development: {
    buildEnv: 'production',
    store: {
      type: 'redis',
      ssh: {
        host: 'ember-deploy-redis.com',
        username: 'deploy',
        privateKey: '~/.ssh/id_rsa',
        dstPort: 6379, // redis port
        dstHost: 'localhost' // redis host
      }
    }
  }
};
```
Note that the `privateKey` is a path to the SSH private key to access the machine that your redis instance is on, not a full blown key.
