var consts = {};

module.exports = consts;

consts.PROMPT = "@pomelo : ";

consts.WELCOME_INFO = ["\nWelcome to the Pomelo monitor. Commands end with ; or \g.",
		"Pomelo is a fast, scalable game server framework for node.js. ",
		"Type \'help;\' or \'\h\' for help.\n"
];

consts.HELP_INFO_1 = [
		"\nFor information about Pomelo products and services, visit:",
		"   http://pomelo.netease.com/",
		"\nList of all Pomelo commands:\n"
];

consts.HELP_INFO_2 = [
		"\nFor more command usage type : help command",
		"example: help show\n"
];

consts.COMANDS_ALL = [
	["command", "  distription"],
	["?", "  symbol for help"],
	["help", "  Display this help"],
	["kick", "  kick user offline"],
	["enable", "  enable an admin console module"],
	["disable", "  disable an admin console module"],
	["add", "  add server/slave to pomelo clusters"],
	["show", "  Show infos like : user,servers, connections"],
	["use", "  Use another server. Takes serverId as argument."],
	["stop", "  stop server. Takes serverId as argument."],
	["restart", "  restart server. Takes serverId as argument."]
];

consts.COMANDS_MAP = {
	"help": 1,
	"add": 1,
	"show": 1,
	"kick": 1,
	"enable": 1,
	"disable": 1,
	"stop": 1,
	"restart": 1
};

consts.COMANDS_INFO = {
	"help": 1,
	"add": 1,
	"show": 1,
	"kick": 1,
	"enable": 1,
	"disable": 1,
	"stop": 1,
	"restart": 1
};

consts.COMANDS_ERROR = 'The command is error format.';