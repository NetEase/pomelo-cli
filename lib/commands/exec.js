var logger = require('pomelo-logger').getLogger(__filename);
var util = require('../util');
var consts = require('../consts');
var cliff = require('cliff');

module.exports = function(opts) {
	return new Command(opts);
};

module.exports.commandId = 'exec';
module.exports.helpCommand = 'help exec';

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

	if(argvs.length < 3 || (comd === 'cpu' && argvs.length < 4)){
		agent.handle(module.exports.helpCommand, msg, rl, client);
		return;
	}

	var param = {};

	if(comd === 'memory') {
		param = {
			filepath : argvs[2]
		}
	} else if(comd === 'cpu'){
		param = {
			filepath : argvs[2],
			times : argvs[3]
		}
	}

	client.request('scripts', {
		command: 'run',
		serverId: Context,
		script: scriptJs
	}, function(err, msg) {
		if (err) {
			alert(err);
			return;
		}
		Ext.getCmp('tesultTextId').setValue(msg);
	});
}