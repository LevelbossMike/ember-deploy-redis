var RSVP  = require('rsvp');
var redis = require('then-redis');
var SilentError = require('ember-cli/lib/errors/silent');
var tunnel = require('tunnel-ssh');

function error(message) {
  return RSVP.Promise.reject(new SilentError(message));
}

function wrap(methodName) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    return this._connection.then(function (client) {
      return client[methodName].apply(client, args);
    });
  };
}

function promisifyNodeCallback(target, method) {
  var args = Array.prototype.slice.call(arguments);
  return function () {
    return new RSVP.Promise(function (resolve, reject) {
      target[method](function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };
}

function RedisClient(config) {
  if (config.ssh) {
    var MAX_PORT_NUMBER = 65535;
    var MIN_PORT_NUMBER = 49151;
    var range = MAX_PORT_NUMBER - MIN_PORT_NUMBER + 1;

    var sshConfig = config.ssh;
    var localPort = sshConfig.localPort;
    if (localPort == null) {
      localPort = Math.floor(Math.random() * range) + MIN_PORT_NUMBER;
    }

    if (localPort > MAX_PORT_NUMBER ||
        localPort < MIN_PORT_NUMBER) {
      return error('Port ' + localPort + ' is not available to open a SSH connection on.\n' +
                   'Please choose a port between ' + MIN_PORT_NUMBER + ' and ' + MAX_PORT_NUMBER + '.');
    }
    sshConfig.localPort = localPort;
    sshConfig.host = config.host;
    sshConfig.dstPort = config.port;

    var client = this;
    this._connection = new RSVP.Promise(function (resolve, reject) {
      client._sshTunnel = tunnel(sshConfig, function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    }).then(function () {
      return redis.createClient(localPort, 'localhost');
    });
  } else {
    this._connection = RSVP.resolve(redis.createClient(this.config));
  }

  this.lpush = wrap('lpush');
  this.ltrim = wrap('ltrim');
  this.lrange = wrap('lrange');
  this.get = wrap('get');
  this.set = wrap('set');

  this.close = function () {
    var closeSSHTunnel = promisifyNodeCallback(this._sshTunnel, 'close');
    return this._connection.then(function (client) {
      return promisifyNodeCallback(client, 'quit')();
    }).then(closeSSHTunnel);
  }
}

module.exports = RedisClient;
