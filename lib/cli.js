var readline = require('readline');
var adminClient = require('pomelo-admin').adminClient;
var command = require('./command')();
var consts = require('./consts');
var util = require('./util');
var argv = require('optimist').argv;

var user = argv['u'] = argv['u'] || 'admin';
var password = argv['p'] = argv['p'] || 'admin';
var host = argv['h'] = argv['h'] || 'localhost';
var port = argv['P'] = argv['P'] || 3005;
var context = 'all';
var client = null;

module.exports = doConnect;

function doConnect() {
  client = new adminClient();
  var id = 'pomelo_cli_' + Date.now();
  client.connect(id, host, port, function(err) {
    if (err) util.log('\nconnect to pomelo master error -> ' + host + ':' + port + '\n');
    else {
      var ASSCI_LOGO = consts.ASSCI_LOGO;
      for (var i = 0; i < ASSCI_LOGO.length; i++) {
        util.log(ASSCI_LOGO[i]);
      }

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
  var PROMPT = user + consts.PROMPT + context + '>';
  rl.setPrompt(PROMPT);
  rl.prompt();

  rl.on('line', function(line) {
    var key = line.trim();
    if(!key){
      util.help();
      rl.prompt();
      return;
    }
    switch (key) {
      case 'help':
        util.help();
        rl.prompt();
        break;
      case '?':
        util.help();
        rl.prompt();
        break;
      case 'quit':
        command.quit(rl);
        break;
      case 'kill':
        command.kill(rl, client);
        break;
      default:
        command.handle(key, {
          user: user
        }, rl, client);
        break;
    }
  }).on('close', function() {
    util.log('bye ' + user);
    process.exit(0);
  });
}