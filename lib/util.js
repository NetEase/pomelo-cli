var cliff = require('cliff');

var util = {};

module.exports = util;

function log(str) {
	process.stdout.write(str + '\n');
}

function errorHandle(comd, rl) {
	log('\nunknow command : ' + comd);
	log('type help for help infomation\n');
	rl.prompt();
}

function argsFilter(argv) {
	var argvs = argv.split(' ');
	for (var i = 0; i < argvs.length; i++) {
		if (argvs[i] === ' ') {
			argvs.splice(i, 1);
		}
	}
	return argvs;
}

function formatOutput(comd, data) {
	if (comd === 'servers') {
		var msg = data.msg;
		var rows = [];
		rows.push(['serverId', 'serverType', 'host', 'port', 'pid', 'heapUsed(M)', 'uptime(m)']);
		for (var key in msg) {
			var server = msg[key];
			rows.push([server['serverId'], server['serverType'], server['host'], server['port'], server['pid'], server['heapUsed'], server['uptime']]);
		}
		log('');
		log(cliff.stringifyRows(rows));
		log('');
		return;
	}

	if (comd === 'connections') {
		var msg = data.msg;
		var rows = [];
		rows.push(['serverId', 'totalConnCount', 'loginedCount']);
		for (var key in msg) {
			var server = msg[key];
			rows.push([server['serverId'], server['totalConnCount'], server['loginedCount']]);
		}
		log('\n' + cliff.stringifyRows(rows) + '\n');
		return;
	}

	if (comd === 'logins') {
		var msg = data.msg;
		var rows = [];
		rows.push(['loginTime', 'uid', 'address']);
		for (var key in msg) {
			var server = msg[key];
			var loginedList = server['loginedList'];
			if (loginedList && loginedList.length === 0) {
				log('\nno user logined in this connector\n');
				return;
			}
			log('\nserverId: ' + server['serverId'] + ' totalConnCount: ' + server['totalConnCount'] + ' loginedCount: ' + server['loginedCount']);
			for (var i = 0; i < loginedList.length; i++) {
				rows.push([format_date(new Date(loginedList[i]['loginTime'])), loginedList[i]['uid'], loginedList[i]['address']]);
			}
			log('\n' + cliff.stringifyRows(rows) + '\n');
			return;
		}
	}
}

function format_date(date, friendly) {
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();

	if (friendly) {
		var now = new Date();
		var mseconds = -(date.getTime() - now.getTime());
		var time_std = [1000, 60 * 1000, 60 * 60 * 1000, 24 * 60 * 60 * 1000];
		if (mseconds < time_std[3]) {
			if (mseconds > 0 && mseconds < time_std[1]) {
				return Math.floor(mseconds / time_std[0]).toString() + ' 秒前';
			}
			if (mseconds > time_std[1] && mseconds < time_std[2]) {
				return Math.floor(mseconds / time_std[1]).toString() + ' 分钟前';
			}
			if (mseconds > time_std[2]) {
				return Math.floor(mseconds / time_std[2]).toString() + ' 小时前';
			}
		}
	}

	//month = ((month < 10) ? '0' : '') + month;
	//day = ((day < 10) ? '0' : '') + day;
	hour = ((hour < 10) ? '0' : '') + hour;
	minute = ((minute < 10) ? '0' : '') + minute;
	second = ((second < 10) ? '0' : '') + second;

	return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
};

util.log = log;
util.errorHandle = errorHandle;
util.argsFilter = argsFilter;
util.formatOutput = formatOutput;
util.format_date = format_date;