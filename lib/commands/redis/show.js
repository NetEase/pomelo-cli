var logger = require('pomelo-logger').getLogger(__filename);
var util = require('../../util');
var consts = require('../../consts');
var countDownLatch = require('../../countDownLatch');

module.exports = function(opts) {
    return new Command(opts);
};

module.exports.commandId = 'show';
module.exports.helpCommand = 'help show';

var Command = function(opt) {

}

Command.prototype.handle = function(agent, comd, argv, rl, client, msg) {
  if (!comd) {
    agent.handle(module.exports.helpCommand, msg, rl, client);
    return;
  }

  var Context = agent.getContext();
  var argvs = util.argsFilter(argv);
  var param = "";

  if (argvs.length > 2 && comd !== 'config') {
    agent.handle(module.exports.helpCommand, msg, rl, client);
    return;
  }

  if (argvs.length > 3 && comd === 'config') {
    agent.handle(module.exports.helpCommand, msg, rl, client);
    return;
  }

  if (argvs.length === 3 && comd === 'config') {
        param = argvs[2];
  }

  var user = msg['user'] || 'admin';

  if (Context === 'all' && consts.CONTEXT_COMMAND[comd]) {
    util.log('\n' + consts.COMANDS_CONTEXT_ERROR + '\n');
    rl.prompt();
    return;
  }

  if (!consts.SHOW_COMMAND[comd]) {
    agent.handle(module.exports.helpCommand, msg, rl, client);
    return;
  }


  if(comd === 'servers') {
    var key = consts.REDIS_PREFIX + msg.env;
    var query_args = [key, Date.now(), '+inf'];
    client.zrangebyscore(query_args, function(err, res) {
      if(err) {
        logger.error('zrangebyscore %j err: %j', query_args, err);
        return;
      }

      var msg = {};

      for (var i = res.length - 1; i >= 0; i--) {
        var server = JSON.parse(res[i]);
        msg[server.id] = {serverInfo : server};
      }
      util.formatOutput(comd, msg);
      rl.prompt();
    });
    return;
  }

  if(comd === '-f' || comd === 'force'){
      var key = consts.REDIS_PREFIX + msg.env;
      var query_args = [key, Date.now(), '+inf'];
      client.zrangebyscore(query_args, function(err, res) {

        if(!!err) {
          logger.error('zrangebyscore %j err: %j', query_args, err);
          return;
        }

        for (var i = res.length - 1; i >= 0; i--) {
          var server = JSON.parse(res[i]);
          var cmd = {command: module.exports.commandId, context: server.id, param: comd};
          var key = consts.REDIS_PREFIX + msg.env + ':' + server.id;
          client.set(key, JSON.stringify(cmd), function(err){
            if(!!err) {
              util.log('get command with error: %j', err);
            }
            rl.prompt();
            return;
          });
        }
      });
      
      return;
  }

  //show all connections of all servers
  if(comd === 'connections') {
    var key = consts.REDIS_PREFIX + msg.env;
    var query_args = [key, Date.now(), '+inf'];
    client.zrangebyscore(query_args, function(err, res) {
      if(err) {
        logger.error('zrangebyscore %j err: %j', query_args, err);
        return;
      }

      var serverList = [];
      var result = {};
      if (res.length <= 0) {
        util.log("\nno connections\n");
        rl.prompt();
        return;
      }
      var latch = countDownLatch.createCountDownLatch(res.length, {timeout: 10 * 1000}, function() {
        util.formatOutput(comd, result);
        rl.prompt();
      });

      for (var i = res.length - 1; i >= 0; i--) {
        var server = JSON.parse(res[i]);
        serverList.push(server.id);
        var key = consts.REDIS_RES_PREFIX + msg.env + ':' + server.id + ':' + module.exports.commandId;
        client.get(key, function(err, res) {
          if(!!err) {
            logger.error('get %s err %j', comd, err);
            latch.done();
            return;
          }

          if(!!res) {
            res = JSON.parse(res);
            result[res.connectionInfo.serverId] = res.connectionInfo;
          }

          latch.done();
        });
      }

    });
    return;
  }

  var key = consts.REDIS_RES_PREFIX + msg.env + ':' + Context + ':' + module.exports.commandId;
  client.get(key, function(err, res) {
    if(!!err) {
      logger.error('get %s err %j', comd, err);
      rl.prompt();
      return;
    }

    if(!!res) {
      res = JSON.parse(res);
      //util.formatOutput has been changed,so adapt to new interface
      /*
      if(comd === 'connections') {
        res = { id : res.connectionInfo};
      }
      */
      util.formatOutput(comd, res);
      rl.prompt();
    } else {
      rl.prompt();
    }
  });
}