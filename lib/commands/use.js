var logger = require('pomelo-logger').getLogger(__filename);
var util = require('../util');
var consts = require('../consts');
var cliff = require('cliff');

module.exports = function(opts) {
	return new Command(opts);
};

module.exports.commandId = 'use';

var Command = function(opt){

}

Command.prototype.handle = function(agent, comd, argv, rl, client, msg){
	if (!comd) {
		util.errorHandle(argv, rl);
		return;
	}

	var Context = agent.getContext();
	var argvs = util.argsFilter(argv);

	if (argvs.length > 2) {
		util.errorHandle(argv, rl);
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

	client.request('watchServer', {
		comd: 'servers',
		context: Context
	}, function(err, data) {
		if (err) util.log(consts.COMANDS_USE_ERROR);
		var _msg = data['msg'];
		if (_msg[comd]) {
			util.log('\nswitch to server: ' + comd + '\n');
			Context = comd;
			agent.setContext(Context);
			var PROMPT = user + consts.PROMPT + Context + '>';
			rl.setPrompt(PROMPT);
		} else {
			util.log('\ncommand \'use ' + comd + '\' error for serverId ' + comd + ' not in pomelo clusters\n');
		}
		rl.prompt();
	});
}