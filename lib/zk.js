var zookeeper = require("node-zookeeper-client");
var EventEmitter = require('events').EventEmitter;
var CreateMode = zookeeper.CreateMode;
var util = require('util');
var utils = require('./util');

function ZKClient(options, cb) {
  var self = this;
  EventEmitter.call(this);

  this.path = options.path || '/pomelo-cluster';
  this.servers = options.servers;
  this.username = options.username || '';
  this.password = options.password || '';
  this.timeout = 5 * 1000;
  this.retries = 3;
  this.spinDelay = 1000;
  this.reconnectTimes = 10;
  this.authentication = this.username + ':' + this.password;

  this.client = zookeeper.createClient(this.servers, {sessionTimeout: this.timeout, retries: this.retries, spinDelay: this.spinDelay});

  var cbTimer = setTimeout(function() {
    cb(new Error('pomelo commander cannot connect to zookeeper.'));
  }, 10 * 1000);

  this.client.once('connected', function() {
    utils.log('pomelo commander connect zookeeper successfully.');
    self.client.addAuthInfo('digest', new Buffer(self.authentication));
    clearTimeout(cbTimer);
    cb();
  });

  this.client.on('disconnected', function() {
    utils.log('%s disconnect with zookeeper server.', self.app.serverId);
  });

  this.client.connect();
};

module.exports = ZKClient;

util.inherits(ZKClient, EventEmitter);

ZKClient.prototype.close = function() {
  this.client.close();
  this.client.emit('close');
  this.client.removeAllListeners();
  this.client = null;
};

ZKClient.prototype.getData = function(path, cb) {
  this.client.getData(path, function(err, data) {
    if(!!err) {
      cb(err);
      return;
    }
    cb(null, data.toString());
  });
};

ZKClient.prototype.getDataAndWatch = function(path, watcher, cb) {
  this.client.getData(path, watcher, function(err, data) {
    if (!!err) {
      cb(err);
      return;
    }
    cb(null, data.toString());
  })
}

ZKClient.prototype.setData = function(path, data, cb) {
  var buffer = new Buffer(JSON.stringify(data));
  var self = this;

  this.client.setData(path, buffer, function(err, result) {
    if(err) {
      console.error('set Data error with path %s', path);
      cb(err);
      return;
    }
    if(cb) {
      cb(err, result);
    }
  });
};

ZKClient.prototype.getChildren = function(cb) {
  var self = this;
  this.client.getChildren(this.path, function(err, children, stats) {
    if(!!err) {
      cb(err);
      return;
    }
    cb(null, children);
  });
};

