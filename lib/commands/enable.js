var logger = require('pomelo-logger').getLogger(__filename);
var util = require('../util');
var consts = require('../consts');
var cliff = require('cliff');

module.exports = function(opts) {
	return new Command(opts);
};

module.exports.commandId = 'enable';

var Command = function(opt){

}

Command.prototype.handle = function(agent, comd, argv, rl, client, msg){
	if (!comd) {
		util.errorHandle(argv, rl);
		return;
	}

	var argvs = util.argsFilter(argv);
	
	if (argvs.length > 2) {
		util.errorHandle(argv, rl);
		return;
	}

	client.command(module.exports.commandId, comd, null , function(err, data) {
		if (err) util.log(consts.COMANDS_ENABLE_ERROR);
		else util.formatOutput(comd, data);
		rl.prompt();
	});
}