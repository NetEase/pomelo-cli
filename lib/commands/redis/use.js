var logger = require('pomelo-logger').getLogger(__filename);
var util = require('../../util');
var consts = require('../../consts');
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

	var key = consts.REDIS_PREFIX + msg.env;
	var query_args = [key, Date.now(), '+inf'];

	client.zrangebyscore(query_args, function(err, res) {
		if(err) {
	    	console.error('zrangebyscore %j err: %j', query_args, err);
	    	return;
	  	}

	  	if(!res.length) {
	  		console.log('no server exist');
	  		rl.prompt();
	  	}else{
	 		for(var i=0; i<res.length; i++) {
				var server = JSON.parse(res[i]);
				if(server.id === comd){
					util.log('\nswitch to server: ' + comd + '\n');
					Context = comd;
					agent.setContext(Context);
					var PROMPT = user + consts.PROMPT + Context + '>';
					rl.setPrompt(PROMPT);
					break;
				}
			}			
		}
		rl.prompt();
	});
}