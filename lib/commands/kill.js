var logger = require('pomelo-logger').getLogger(__filename);
var util = require('../util');
var consts = require('../consts');
var cliff = require('cliff');

module.exports = function(opts) {
	return new Command(opts);
};

module.exports.commandId = 'kill';

var Command = function(opt){

}

Command.prototype.handle = function(rl, client){
	client.request(consts.CONSOLE_MODULE, {
		signal: "kill"
	}, function(err, data) {
		if (err) util.log(consts.COMANDS_KILL_ERROR);
		rl.prompt();
	});
}