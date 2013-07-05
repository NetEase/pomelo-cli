var util = require('./util');
var consts = require('./consts');
var cliff = require('cliff');
var command = {};

module.exports = command;

var Context = "";

function handle(argv, msg, rl, client) {
	var argvs = util.argsFilter(argv);
	var comd = argvs[0];
	var comd1 = argvs[1];

	if (!comd1) {
		util.errorHandle(argv, rl);
		return;
	}

	Context = Context || 'all';

	comd1 = comd1.trim();

	switch (comd) {
		case 'help':
			helpCommand(comd1, argv, rl);
			break;
		case 'add':
			addCommand(comd1);
			break;
		case 'show':
			showCommand(comd1, argv, rl, client, msg);
			break;
		case 'enable':
			enableCommand(comd1);
			break;
		case 'disable':
			disableCommand(comd1);
			break;
		case 'use':
			useCommand(comd1, argv, rl, client, msg);
			break;
		case 'stop':
			stopCommand(comd1);
			break;
		case 'restart':
			restartCommand(comd1);
			break;
		case 'kick':
			addCommand(comd1);
			break;
		default:
			util.errorHandle(argv, rl);
			break;
	}
}

function help() {
	var HELP_INFO_1 = consts.HELP_INFO_1;
	for (var i = 0; i < HELP_INFO_1.length; i++) {
		util.log(HELP_INFO_1[i]);
	}

	var COMANDS_ALL = consts.COMANDS_ALL;
	util.log(cliff.stringifyRows(COMANDS_ALL));

	var HELP_INFO_2 = consts.HELP_INFO_2;
	for (var i = 0; i < HELP_INFO_2.length; i++) {
		util.log(HELP_INFO_2[i]);
	}
}

function helpCommand(comd, argv, rl) {
	var argvs = util.argsFilter(argv);

	if (argvs.length > 2) {
		util.errorHandle(argv, rl);
		return;
	}

	if (comd === 'help') {
		help();
		rl.prompt();
		return;
	}

	if (consts.COMANDS_MAP[comd]) {
		var INFOS = consts.COMANDS_MAP[comd];
		for (var i = 0; i < INFOS.length; i++) {
			util.log(INFOS[i]);
		}
		rl.prompt();
		return;
	}

	util.errorHandle(argv, rl);
}

function addCommand(comd) {

}

function showCommand(comd, argv, rl, client, msg) {
	var argvs = util.argsFilter(argv);

	if (argvs.length > 2) {
		util.errorHandle(argv, rl);
		return;
	}

	var user = msg['user'] || 'admin';

	if (Context === 'all' && (comd === 'status' || comd === 'config' || comd === 'logins')) {
		util.log('\n' + consts.COMANDS_CONTEXT_ERROR + '\n');
		rl.prompt();
		return;
	}

	if (!consts.SHOW_COMMAND[comd]) {
		util.errorHandle(argv, rl);
		return;
	}

	client.request('watchServer', {
		comd: comd,
		context: Context
	}, function(err, data) {
		if (err) util.log(err);
		else util.formatOutput(comd, data);
		rl.prompt();
	});
}

function stopCommand(comd) {

}

function restartCommand(comd) {

}

function useCommand(comd, argv, rl, client, msg) {
	var argvs = util.argsFilter(argv);

	if (argvs.length > 2) {
		util.errorHandle(argv, rl);
		return;
	}

	var user = msg['user'] || 'admin';

	client.request('__console__', {
		signal: 'list'
	}, function(err, data) {
		if (err) console.error(err);
		var _msg = data['msg'];
		if (_msg[comd]) {
			util.log('\nswitch to server: ' + comd + '\n');
			Context = comd;
			var PROMPT = user + consts.PROMPT + Context + '>';
			rl.setPrompt(PROMPT);
		} else {
			util.log('\ncommand use ' + comd + ' ERROR for serverId ' + comd + ' not in pomelo clusters\n');
		}
		rl.prompt();
	});
}

function quit(rl) {
	rl.emit('close');
}

command.help = help;
command.quit = quit;
command.handle = handle;