var logger = require('pomelo-logger').getLogger(__filename);
var util = require('../../util');
var consts = require('../../consts');
var countDownLatch = require('../../countDownLatch');
var cliff = require('cliff');

module.exports = function(opts) {
	return new Command(opts);
};

module.exports.commandId = 'use';
module.exports.helpCommand = 'help use';

var Command = function(opt) {

}

Command.prototype.handle = function(agent, comd, argv, rl, client, msg) {
	if (!comd) {
		agent.handle(module.exports.helpCommand, msg, rl, client);
		return;
	}

	var Context = agent.getContext();
	var argvs = util.argsFilter(argv);

	if (argvs.length > 2) {
		agent.handle(module.exports.helpCommand, msg, rl, client);
		return;
	}

	var user = msg['user'] || 'admin';

	if (comd === 'all') {
		util.log('\nswitch to server: ' + comd + '\n');
		Context = comd;
		agent.setContext(Context);
		var PROMPT = user + consts.PROMPT + Context + '>';
		rl.setPrompt(PROMPT);
		rl.prompt();
		return;
	}

	//check whether context comd is a valid serverid
	client.getChildren(function(err, rs) {
		if(!rs.length) {
			util.log('\nno serverId as context exist.\n');
			rl.prompt();
		}	else {
			var found = false;
			var latch = countDownLatch.createCountDownLatch(rs.length, {timeout: 10 * 1000}, function() {
				if (!found) {
					util.log('\ncommand \'use ' + comd + '\' error for \'' + comd + '\' is not a valid serverId\n');
				}
				rl.prompt();
			});
			rs.forEach(function(value) {
				if(value.indexOf('cmd::') === -1) {
						client.getData(client.path + '/' + value, function(err, data) {
							data = JSON.parse(data);
							if (data.serverInfo.id === comd) {
								Context = comd;
								var PROMPT = user + consts.PROMPT + Context + '>';
								rl.setPrompt(PROMPT);
								agent.setContext(Context);
								util.log('\nswitch to server: ' + Context + '\n');
								found = true;
							}
							latch.done();
						});
					} else {
						latch.done();
					}
			})			
		}
	});
}