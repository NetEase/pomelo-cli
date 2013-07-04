var util = require('./util');
var consts = require('./consts');
var cliff = require('cliff');
var command = {};

module.exports = command;

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

function quit() {

}

function handle(argv) {
	var argvs = argv.split(' ');
	var comd = argvs[0];

	var key = comd.trim();
	switch (key) {
		case 'help':
			command.help();
			break;
		case 'quit':
			rl.emit('close');
			break;
		default:
			quit(consts.COMANDS_ERROR);
			break;
	}
	console.log(argvs);
}

command.help = help;
command.quit = quit;
command.handle = handle;