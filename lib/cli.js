var readline = require('readline');
var adminClient = require('pomelo-admin').adminClient;
var command = require('./command');
var consts = require('./consts');
var util = require('./util');
var argv = require('optimist').argv;

var user = argv['u'] = argv['u'] || 'admin';
var password = argv['p'] = argv['p'] || 'admin';
var host = argv['h'] = argv['h'] || 'localhost';
var port = argv['P'] = argv['P'] || 3005;

doConnect();

function doConnect() {
  var client = new adminClient();
  var id = 'pomelo_cli_' + Date.now();
  client.connect(id, host, port, function(err) {
    if (err) console.error(err);
    else {
      var WELCOME_INFO = consts.WELCOME_INFO;
      for (var i = 0, l = WELCOME_INFO.length; i < l; i++) {
        util.log(WELCOME_INFO[i]);
      }
      startCli();
    }
  });
}

function startCli() {
  var rl = readline.createInterface(process.stdin, process.stdout);
  var PROMPT = user + consts.PROMPT + 'all>';
  rl.setPrompt(PROMPT);
  rl.prompt();

  rl.on('line', function(line) {
    var key = line.trim();
    switch (key) {
      case 'help':
        command.help();
        break;
      case 'quit':
        rl.emit('close');
        break;
      default:
        command.handle(line);
        break;
    }
    // rl.setPrompt(key + '> ');
    rl.prompt();
  }).on('close', function() {
    util.log('bye');
    process.exit(0);
  });
}