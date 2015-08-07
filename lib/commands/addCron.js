var logger = require('pomelo-logger').getLogger(__filename);
var util = require('../util');
var consts = require('../consts');
var countDownLatch = require('../countDownLatch');

module.exports = function(opts) {
	return new Command(opts);
};

module.exports.commandId = 'addCron';
module.exports.helpCommand = 'help addCron';

var Command = function(opt) {

}

Command.prototype.handle = function(agent, comd, argv, rl, client, msg) {
	if (!comd) {
		agent.handle(module.exports.helpCommand, msg, rl, client);
		return;
	}

	var args = util.argsFilter(argv).slice(1);
	var cmd = {command: 3, cron: args};
	var serverId;
	var serverType;
	var fails = [];

	rl.question(consts.ADDCRON_QUESTION_INFO, function(answer) {
		if (answer === 'yes') {
			var flag = false;
			args.forEach(function(item) {
				if(util.startsWith(item, 'serverId')) {
					serverId = item.split('=')[1];
					flag = true;
				}
				if(util.startsWith(item, 'serverType')) {
					serverType = item.split('=')[1];
				}
			});

			if(flag) {
				var path = client.path + '/cmd::' + serverId;
				client.setData(path, cmd, function(err, res) {
					if(!!err) {
						util.log('addCron failed with serverId: ' + serverId);
					} else {
						util.log('addCron successfully with serverId: ' + serverId);
					}
					rl.prompt();
				});
			}	else {
				client.getChildren(function(err, rs) {
					if(!rs.length) {
						util.log('no server exist.');
						rl.prompt();
					}	else {
						var latch = countDownLatch.createCountDownLatch(rs.length, {timeout: 10 * 1000}, function() {
							if(!fails.length) {
								util.log('addCron servers successfully for serverType: ' + serverType);
							} else {
								util.log('addCron failed with servers: %j', fails);
							}
							rl.prompt();
						});
						for(var i=0; i<rs.length; i++) {
							(function(index) {
								if(rs[index].indexOf(serverType) != -1) {
									var serverId = rs[index].split('::')[1];
									client.setData(client.path + '/cmd::' + serverId, cmd, function(err, path) {
										if(!!err) {
											fails.push(serverId);
											util.log('send command with error: %j', err.stack);
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
			}
		} else {
			rl.prompt();
		}
	});
}