var logger = require('pomelo-logger').getLogger(__filename);
var util = require('../../util');
var consts = require('../../consts');
var cliff = require('cliff');
var fs = require('fs');

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

	if(argvs.length >2){
		agent.handle(module.exports.helpCommand, msg, rl, client);
		return;
	}

	var file = null;
	if(comd[0] !== '/'){
		comd = process.cwd() + '/' + comd;
	}

	try{
		file = fs.readFileSync(comd).toString();
	}catch(e){
		util.log(consts.COMANDS_EXEC_ERROR);
		rl.prompt();
		return;
	}

	var getResult = function(){
		var key = consts.REDIS_RES_PREFIX + msg.env + ':' + Context;
		client.get(key, function(err, res) {
		    if(!!err) {
				logger.error('run %s err %j', comd, err);
				rl.prompt();
				return;
		    }

		    if(!!res) {
				util.formatOutput(module.exports.commandId, res);
				client.del(key, function(err) {
					if(err) {
						logger.error('del command err %j', err);
					}
				    rl.prompt();
				});
		    }
	    });
	};

	var cmd = {command: module.exports.commandId, serverId: Context, script: file};
	var key = consts.REDIS_PREFIX + msg.env + ':' + Context;
	client.set(key, JSON.stringify(cmd), function(err){
		if(!!err) {
			util.log('get command with error: %j', err.stack);
			rl.prompt();
			return;
		}
		setTimeout(getResult, consts.REDIS_PERIOD);
	});
}
