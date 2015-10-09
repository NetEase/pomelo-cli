var consts = require('./consts');
var util = require('./util');
var cliff = require('cliff');
var fs = require('fs');

var Command = function() {
	this.zk_commands = {};
	this.redis_commands = {};
	this.init();
	this.Context = 'all';
}

module.exports = function(){
	return new Command();
}

Command.prototype.init = function() {
	var self = this;
	fs.readdirSync(__dirname + '/commands/zk').forEach(function(filename) {
		if (/\.js$/.test(filename)) {
			var name = filename.substr(0, filename.lastIndexOf('.'));
			var _command = require('./commands/zk/' + name);
			self.zk_commands[name] = _command;
		}
	});
	fs.readdirSync(__dirname + '/commands/redis').forEach(function(filename) {
		if (/\.js$/.test(filename)) {
			var name = filename.substr(0, filename.lastIndexOf('.'));
			var _command = require('./commands/redis/' + name);
			self.redis_commands[name] = _command;
		}
	});
}

Command.prototype.handle = function(argv, msg, rl, client){
	var self = this;
	var argvs = util.argsFilter(argv);
	var comd = argvs[0];
	var comd1 = argvs[1] || "";

	comd1 = comd1.trim();
	var mode = msg.mode;
	var m;
	if(mode === 'redis') {
		m = this.redis_commands[comd];
	} else {
		m = this.zk_commands[comd];
	}
	if(m){
		var _command = m();
		_command.handle(self, comd1, argv, rl, client, msg);
	} else {
		util.errorHandle(argv, rl);
	}
}

Command.prototype.quit = function(rl){
	rl.emit('close');
}

Command.prototype.getContext = function(){
	return this.Context;
}

Command.prototype.setContext = function(context){
	this.Context = context;
}
