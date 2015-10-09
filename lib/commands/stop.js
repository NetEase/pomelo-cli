var logger = require('pomelo-logger').getLogger(__filename);
var util = require('../util');
var countDownLatch = require('../countDownLatch');
var consts = require('../consts');
var cliff = require('cliff');

module.exports = function(opts) {
	return new Command(opts);
};

module.exports.commandId = 'stop';
module.exports.helpCommand = 'help stop';

var Command = function(opt) {

}

Command.prototype.handle = function(agent, comd, argv, rl, client, msg) {
	if (!comd) {
		agent.handle(module.exports.helpCommand, msg, rl, client);
		return;
	}

	var argvs = util.argsFilter(argv);
	ids = argvs.slice(1);
	var cmd = {command: 1};
	var fails = [];

	rl.question(consts.STOP_QUESTION_INFO, function(answer) {
		if (answer === 'yes') {
			if(comd == 'all') {
				client.getChildren(function(err, rs) {
					if(!rs.length) {
						console.log('no server exist.');
						rl.prompt();
					}	else {
						var latch = countDownLatch.createCountDownLatch(rs.length, {timeout: 10 * 1000}, function() {
							rl.prompt();
						});
						for(var i=0; i<rs.length; i++) {
							(function(index) {
								if(rs[index].indexOf('cmd::') != -1) {
									client.setData(client.path + '/' + rs[index], cmd, function(err, path) {
										if(!!err) {
											console.log('send command with error: %j', err.stack);
										}
										latch.done();
									});
								} else {
									latch.done();
								}
							})(i)
						}			
					}
				});
			}	else if(comd.indexOf('serverType=') != -1) {
				var type = comd.split('=')[1];
				client.getChildren(function(err, rs) {
					if(!rs.length) {
						console.log('no server exist.');
						rl.prompt();
					}	else {
						var latch = countDownLatch.createCountDownLatch(rs.length, {timeout: 10 * 1000}, function() {
							if(!fails.length) {
								console.log('all servers has been stopped.');
							} else {
								console.log('stop failed with servers: %j', fails);
							}
							rl.prompt();
						});
						for(var i=0; i<rs.length; i++) {
							(function(index) {
								if(rs[index].indexOf(type) != -1) {
									var serverId = rs[index].split('::')[1];
									client.setData(client.path + '/cmd::' + serverId, cmd, function(err, path) {
										if(!!err) {
											fails.push(serverId);
											console.log('send command with error: %j', err.stack);
										}
										latch.done();
									});
								} else {
									latch.done();
								}
							})(i)
						}			
					}
				});
			} else {
				var latch = countDownLatch.createCountDownLatch(ids.length, {timeout: 10 * 1000}, function() {
					if(!fails.length) {
						console.log('all servers has been stopped.');
					} else {
						console.log('stop failed with servers: %j', fails);
					}
					rl.prompt();
				});
				for(var j=0; j<ids.length; j++) {
					(function(index) {
						var path = client.path + '/cmd::' + ids[index];
						client.setData(path, cmd, function(err, res) {
							if(!!err) {
								fails.push(ids[index]);
							}
							latch.done();
						});
					})(j)
				}
			}
		}
	});
}