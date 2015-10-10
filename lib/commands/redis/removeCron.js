var logger = require('pomelo-logger').getLogger(__filename);
var util = require('../../util');
var consts = require('../../consts');
var countDownLatch = require('../../countDownLatch');

module.exports = function(opts) {
	return new Command(opts);
};

module.exports.commandId = 'removeCron';
module.exports.helpCommand = 'help removeCron';

var Command = function(opt) {

}

Command.prototype.handle = function(agent, comd, argv, rl, client, msg) {
	if (!comd) {
		agent.handle(module.exports.helpCommand, msg, rl, client);
		return;
	}

	var args = util.argsFilter(argv).slice(1);
	var key = consts.REDIS_PREFIX + msg.env;
	var fails = [];
	var cron_arg = {};
	var cmd = {command: 4, cron: cron_arg};

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


				if(util.startsWith(item, 'id')) {
					var id = item.split('=')[1];
					cron_arg.id = id;
				}
				if(util.startsWith(item, 'time')) {
					var time = item.split('=')[1];
					cron_arg.time = time;
				}
				if(util.startsWith(item, 'action')) {
					var action = item.split('=')[1];
					cron_arg.action = action;
				}
			});

			if(flag) {
				var setKey = key + ':' + serverId;
				client.set(setKey, JSON.stringify(cmd), function(err){
					if(!!err) {
						util.log('removeCron failed with serverId: ' + serverId);
					} else {
						util.log('removeCron successfully with serverId: ' + serverId);
					}
					rl.prompt();
				});
			}
			else {
				var query_args = [key, Date.now(), '+inf'];
				client.zrangebyscore(query_args, function(err, res) {
					if(err) {
			        	console.error('zrangebyscore %j err: %j', query_args, err);
			        	return;
			      	}

			      	if(!res.length) {
			      		console.log('no server exist');
			      		rl.prompt();
			      	}else{
			      		var latch = countDownLatch.createCountDownLatch(res.length, {timeout: 10 * 1000}, function() {
			      			if(!fails.length) {
								console.log('removeCron servers successfully for serverType: ' + serverType);
							} else {
								console.log('removeCron failed with servers: %j', fails);
							}
							rl.prompt();
				 		});

				 		for(var i=0; i<res.length; i++) {
							(function(index) {
								if(res[index].indexOf(serverType) != -1){
									var server = JSON.parse(res[i]);
									var setKey = key + ':' + server.id;
									client.set(setKey, JSON.stringify(cmd), function(err){
										if(!!err){
											console.log('send command with error: %j', err.stack);
											fails.push(server.id);
										}
										latch.done();
									});
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