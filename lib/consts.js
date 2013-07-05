var consts = {};

module.exports = consts;

consts.PROMPT = "@pomelo : ";

consts.WELCOME_INFO = ["\nWelcome to the Pomelo monitor.",
		"Pomelo is a fast, scalable game server framework for node.js. ",
		"Type \'help\' for help information.\n"
];

consts.HELP_INFO_1 = [
		"\nFor information about Pomelo products and services, visit:",
		"   http://pomelo.netease.com/",
		"\nList of all Pomelo commands:\n"
];

consts.HELP_INFO_2 = [
		"\nFor more command usage, type : help command",
		"example: help show\n"
];

consts.COMANDS_ALL = [
	["command", "  distription"],
	["?", "  symbol for help"],
	["help", "  display this help"],
	["kick", "  kick user offline"],
	["enable", "  enable an admin console module"],
	["disable", "  disable an admin console module"],
	["add", "  add server/slave to pomelo clusters"],
	["show", "  show infos like : user, servers, connections"],
	["use", "  use another server. Takes serverId as argument."],
	["stop", "  stop server. Takes serverId as argument."],
	["restart", "  restart server. Takes serverId as argument."]
];

consts.COMANDS_MAP = {
	"help": 1,
	"add": ["\nadd server/slave to pomelo clusters",
			"example: add server host port serverType",
			"example: add slave host port serverType\n"
	],
	"show": ["\nshow infos like : user, servers, connections",
			"you can show following informations:",
			"user, servers, connections, logins, modules",
			"example: show user",
			"example: show servers",
			"example: show connections",
			"example: show logins from to\n"
	],
	"use": ["\nuse another server. takes serverId as argument",
			"then you will switch to serverId context",
			"your command will be applied to serverId server",
			"example: use serverId\n"
	],
	"kick": ["\nkick user offline",
			"example: kick user uid\n"
	],
	"enable": ["\nenable an admin console module",
			"example: enable module moduleId\n"
	],
	"disable": ["\ndisable an admin console module",
			"example: disable module moduleId\n"
	],
	"stop": ["\nstop server. takes serverId as argument.",
			"example: stop server serverId\n"
	],
	"restart": ["\nrestart server. Takes serverId as argument.",
			"example: restart server serverId\n"
	]
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

consts.SHOW_COMMAND = {
	"servers": 1,
	"connections": 1,
	"logins": 1,
	"modules": 1,
	"status": 1,
	"config": 1
};

consts.COMANDS_ERROR = 'this command is error format.';
consts.COMANDS_CONTEXT_ERROR = "this command is not used in this context\nyou can use command \'use\' to switch context";