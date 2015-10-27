var logger = require('pomelo-logger').getLogger(__filename);
var util = require('../../util');
var consts = require('../../consts');
var cliff = require('cliff');
var countDownLatch = require('../../countDownLatch');

module.exports = function(opts) {
	return new Command(opts);
};

module.exports.commandId = 'get';
module.exports.helpCommand = 'help get';

var Command = function(opt){

}

Command.prototype.handle = function(agent, comd, argv, rl, client, msg){
	if (!comd) {
		agent.handle(module.exports.helpCommand, msg, rl, client);
		return;
	}

	var Context = agent.getContext();
	if (Context === 'all') {
		util.log('\n' + consts.COMANDS_CONTEXT_ERROR + '\n');
		rl.prompt();
		return;
	}

	var argvs = util.argsFilter(argv);

	if(argvs.length < 2){
		agent.handle(module.exports.helpCommand, msg, rl, client);
		return;
	}

	// client.request('watchServer', {
	// 	comd: module.exports.commandId,
	// 	param: comd,
	// 	context: Context
	// }, function(err, data) {
	// 	if (err) console.log(err);
	// 	else util.formatOutput(module.exports.commandId, data);
	// 	rl.prompt();
	// });
    
	var cmd = {command: module.exports.commandId, context: Context, param: comd};
	
	client.setData(client.path + '/cmd::' + Context, cmd, function(err, path) {
		if(!!err) {
			util.log('get command with error: %j', err.stack);
		}
		var result;
		
		var latch = countDownLatch.createCountDownLatch(1, {timeout: 10 * 1000}, function() {
			util.formatOutput(module.exports.commandId, result);
			rl.prompt();
		})
		var watcher = function(event) {
			if (event.type == 3) {
				client.getData(client.path + '/cmd::' + Context, function(err, value) {
					if(!!err) {
						util.log('get command with error: %j', err.stack);
					}
					result = value; 
					latch.done();
				});
			}
		};
		client.getDataAndWatch(client.path + '/cmd::' + Context, watcher, function(err, value) {
			if(!!err) {
				util.log('get command with error: %j', err.stack);
			}
		});

	});
}