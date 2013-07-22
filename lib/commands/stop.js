var logger = require('pomelo-logger').getLogger(__filename);
var util = require('../util');
var consts = require('../consts');
var cliff = require('cliff');

module.exports = function(opts) {
	return new Command(opts);
};

module.exports.commandId = 'stop';

var Command = function(opt){

}

Command.prototype.handle = function(agent, comd, argv, rl, client, msg){
	if (!comd) {
		util.errorHandle(argv, rl);
		return;
	}

	var Context = agent.getContext();
	var argvs = util.argsFilter(argv);

	var ids = [];
	if (comd !== 'all') {
		ids = argvs.slice(1);
	}
	
	client.request(consts.CONSOLE_MODULE, {
		signal: "stop",
		ids: ids
	}, function(err, data) {
		if (err) util.log(consts.COMANDS_STOP_ERROR);
		else util.formatOutput(comd, data);
		rl.prompt();
	});
}