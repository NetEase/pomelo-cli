var consts = {};

module.exports = consts;

consts.CONSOLE_MODULE = "__console__";

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

consts.HELP_LOGIN = [
	"\nWelcome to the Pomelo monitor.",
	"Pomelo is a fast, scalable game server framework for node.js. ",
	"you can use following command to connect to pomelo master",
	"pomelo-cli -h host -p port -u user -P password",
	"default type pomelo-cli equals to",
	"pomelo-cli -h 127.0.0.1 -p 3306 -u admin -P admin\n"
];

consts.COMANDS_ALL = [
	["command", "  distription"],
	["?", "  symbol for help"],
	["help", "  display this help"],
	["quit", "  quit pomelo-cli"],
	["kill", "  kill all servers"],
	["get", "  equal to app.get(key) "],
	["set", "  equal to app.set(key, value)"],
	["add", "  add server to pomelo clusters"],
	["stop", "  stop server. Takes serverId as argument"],
	["show", "  show infos like : user, servers, connections"],
	["use", "  use another server. Takes serverId as argument"],
	["enable", "  enable an admin console module or enable app settings"],
	["disable", "  disable an admin console module or disable app settings"],
	["dump", "  make a dump of the V8 heap and cpu for later inspection"]
];

consts.COMANDS_MAP = {
	"help": 1,
	"add": ["\nadd server to pomelo clusters",
			"example: add host=127.0.0.1 port=3451 serverType=chat id=chat-server-2",
			"example: add host=127.0.0.1 port=3152 serverType=connector id=connector-server-3 clientPort=3012 frontend=true\n",
	],
	"show": ["\nshow infos like : servers, connections",
			"you can show following informations:",
			"servers, connections, logins, modules, status, proxy, handler, components, settings",
			"example: show servers",
			"example: show connections",
			"example: show proxy",
			"example: show handler",
			"example: show logins\n"
	],
	"config": ["\nconfig infos like : proxy, remote, connection, connector, session",
			"you can show following informations:",
			"proxy, remote, connection, connector, session, protobuf",
			"localSession, channel, server, scheduler, globalChannel, monitor",
			"example: show config proxy",
			"example: show config remote",
			"example: show config connection",
			"note: show config xxx command show configuration from app.get(\'xxxConfig\')",
			"in pomelo you can pass opt config to component to make your like-style server",
			"but you should keep in mind to use it in a proper context\n"
	],
	"use": ["\nuse another server. takes serverId as argument",
			"then you will switch to serverId context",
			"your command will be applied to serverId server",
			"example: use serverId\n"
	],
	"enable": ["\nenable an admin console module or enable app settings",
			"example: enable module moduleId",
			"example: enable app settings\n",
	],
	"disable": ["\ndisable an admin console module or disable app settings",
			"example: disable module moduleId",
			"example: disable app settings\n"
	],
	"stop": ["\nstop server. takes serverId as argument.",
			"example: stop server serverId\n"
	],
	"kill": ["\nkill all servers.",
			"example: kill",
			"note: be carefull to use this command\n"
	],
	"dump": ["\nmake a dump of the V8 heap and cpu for later inspection",
			"example: dump cpu filepath times",
			"example: dump memory filepath\n"
	],
	"get": ["\nequal to app.get(key)",
			"example: get key\n"
	],
	"set": ["\nequal to app.set(key, value)",
			"example: set key value",
			"note: value must be string\n"
	]
};

consts.COMANDS_INFO = {
	"help": 1,
	"add": 1,
	"show": 1,
	"enable": 1,
	"disable": 1,
	"stop": 1,
	"kill": 1,
	"get": 1,
	"set": 1
};

consts.SHOW_COMMAND = {
	"servers": 1,
	"connections": 1,
	"logins": 1,
	"modules": 1,
	"status": 1,
	"config": 1,
	"proxy": 1,
	"handler": 1,
	"components": 1,
	"settings": 1
};

consts.CONTEXT_COMMAND = {
	"status": 1,
	"logins": 1,
	"proxy": 1,
	"handler": 1,
	"components": 1,
	"settings": 1,
	"enable": 1,
	"disable": 1
};

consts.ASSCI_LOGO = [
	".______     ______   .___  ___.  _______   __         ______   ",    
	"|   _  )   (  __  )  |   \\/   | |   ____| |  |       (  __  )  ",    
	"|  |_)  ) |  |  |  | |  \\  /  | |  |__    |  |      |  |  |  | ",    
	"|   ___)  |  |  |  | |   \\/   | |   __|   |  |      |  |  |  | ",    
	"|  |      |  `--'  | |  |  |  | |  |____  |  `----. |  `--'  | ",    
	"| _|       (______)  |__|  |__| |_______| |_______|  (______)  "    
];

consts.COMANDS_ERROR = "this command is error format";
consts.COMANDS_ADD_ERROR = "\nadd command error\n";
consts.COMANDS_ENABLE_ERROR = "\nenable command error\n";
consts.COMANDS_DISABLE_ERROR = "\ndisable command error\n";
consts.COMANDS_CONFIG_ERROR = "\nconfig command error\n";
consts.COMANDS_SHOW_ERROR = "\nshow command error\n";
consts.COMANDS_KILL_ERROR = "\nkill command error\n";
consts.COMANDS_USE_ERROR = "\nuse command error\n";
consts.COMANDS_STOP_ERROR = "\nstop command error\n";
consts.COMANDS_CONTEXT_ERROR = "this command is not used in this context\nyou can use command \'use\' to switch context";
consts.MODULE_INFO = "there are following modules registered in pomelo clusters";
consts.COMPONENTS_INFO = "there are following components registered in current server";
consts.KILL_QUESTION_INFO = "warning : are you really want to kill all servers [yes/no] ";
