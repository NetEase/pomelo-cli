var logger = require('pomelo-logger').getLogger(__filename);
var util = require('../../util');
var consts = require('../../consts');
var countDownLatch = require('../../countDownLatch');
var cliff = require('cliff');

module.exports = function(opts) {
	return new Command(opts);
};

module.exports.commandId = 'kill';
module.exports.helpCommand = 'help kill';

var Command = function(opt) {

}

Command.prototype.handle = function(agent, comd, argv, rl, client, msg) {
if (!comd) {
		agent.handle(module.exports.helpCommand, msg, rl, client);
		return;
	}

	var argvs = util.argsFilter(argv);
	ids = argvs.slice(1);
	var cmd = {command: module.exports.commandId};
	var fails = [];
	var key = consts.REDIS_PREFIX + msg.env;

	rl.question(consts.STOP_QUESTION_INFO, function(answer) {
		if (answer === 'yes') {
			if(comd == 'all') {
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
							console.log('all servers have been stopped.');
							rl.prompt();
				 		});


				 		for(var i=0; i<res.length; i++) {
							(function(index) {
								var server = JSON.parse(res[i]);
								var setKey = key + ':' + server.id;

								client.set(setKey, JSON.stringify(cmd), function(err){
									if(err){
										console.log('set kill %j, err: %j', setKey, err.stack);
									}
									latch.done();
								})
							})(i)
						}			
					}
				});
			}else if(comd.indexOf('serverType=') != -1) {
				var type = comd.split('=')[1];
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
								console.log('all servers of type %s has been stopped.', type);
							} else {
								console.log('kill failed with servers: %j', fails);
							}
							rl.prompt();
				 		});

				 		for(var i=0; i<res.length; i++) {
							(function(index) {
								if(res[index].indexOf(type) != -1){
									var server = JSON.parse(res[i]);
									var setKey = key + ':' + server.id;
									client.set(setKey, JSON.stringify(cmd), function(err){
										if(err){
											console.log('set kill %j, err: %j', setKey, err.stack);
											fails.push(server.id);
										}
										latch.done();
									});
								}
							})(i)
						}			
					}
				});
			} else {
				var latch = countDownLatch.createCountDownLatch(ids.length, {timeout: 10 * 1000}, function() {
					if(!fails.length) {
						console.log('server: %s has been stopped.', ids.join(','));
					} else {
						console.log('kill failed with servers: %j', fails);
					}
					rl.prompt();
				});
				for(var j=0; j<ids.length; j++) {
					(function(index) {
						var setKey = key + ':' + ids[j];
						client.set(setKey, JSON.stringify(cmd), function(err){
							if(err){
								console.log('set kill %j, err: %j', setKey, err.stack);
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