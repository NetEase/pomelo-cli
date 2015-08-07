var logger = require('pomelo-logger').getLogger(__filename);
var util = require('../util');
var consts = require('../consts');
var cliff = require('cliff');

module.exports = function(opts) {
	return new Command(opts);
};

module.exports.commandId = 'kill';
module.exports.helpCommand = 'help kill';

var Command = function(opt){

}

Command.prototype.handle = function(agent, comd, argv, rl, client, msg) {
	if (!comd) {
		agent.handle(module.exports.helpCommand, msg, rl, client);
		return;
	}
	
	var argvs = util.argsFilter(argv);

	var ids = [];
	if (comd !== 'all') {
		ids = argvs.slice(1);
	}

	rl.question(consts.KILL_QUESTION_INFO, function(answer){
		if(answer === 'yes') {
			var path = client.path + '/cmd::' + ids[0];
			console.log('path: ' + path);
			var rs = {command: 2};
			client.setData(path, rs, function(err, res) {
				console.log('res: %j', res);
				rl.prompt();
			});
		} else {
			rl.prompt();
		}
	});
}