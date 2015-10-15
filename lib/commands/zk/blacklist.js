var logger = require('pomelo-logger').getLogger(__filename);
var util = require('../../util');
var countDownLatch = require('../../countDownLatch');
var consts = require('../../consts');

module.exports = function(opts) {
	return new Command(opts);
};

module.exports.commandId = 'blacklist';
module.exports.helpCommand = 'help blacklist';

var Command = function(opt) {

}

Command.prototype.handle = function(agent, comd, argv, rl, client, msg) {
	if (!comd) {
		agent.handle(module.exports.helpCommand, msg, rl, client);
		return;
	}
	var argvs = util.argsFilter(argv);

	// rl.question(consts.BLACKLIST_QUESTION_INFO, function(answer) {
	// 	if (answer === 'yes') {
	// 		client.request(consts.CONSOLE_MODULE, {
	// 			signal: 'blacklist',
	// 			args: argvs.slice(1)
	// 		}, function(err, data) {
	// 			if (err) console.log(err);
	// 			else util.formatOutput(comd, data);
	// 			rl.prompt();
	// 		});
	// 	} else {
	// 		rl.prompt();
	// 	}
	// });

	var cmd = {command: 5, blacklist: argvs.slice(1)};
	var fails = [];

	rl.question(consts.BLACKLIST_QUESTION_INFO, function(answer) {
		if (answer === 'yes') {
			client.getChildren(function(err,rs) {
				if (!rs.length) {
					util.log('\nno serverId as context exist.\n');
					rl.prompt();
				} else {
					var latch = countDownLatch.createCountDownLatch(rs.length, {timeout: 10 * 1000}, function(){
						rl.prompt();
					});
					rs.forEach(function(value) {
						if(value.indexOf('cmd::') != -1) {
							client.setData(client.path + '/' + value, cmd, function(err, path) {
								if(!!err) {
									console.log('send command with error: %j', err.stack);
								}
								latch.done();
							});
						} else {
							latch.done();
						}
					});
				}
			});
		} else {
			rl.prompt();
		}
	});
}