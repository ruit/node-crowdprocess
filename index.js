var userHome = require('osenv').home();
var path = require('path');
var login = require('./src/auth');
var job = require('./src/job');
var fs = require('fs');


module.exports = crowdprocess;

function crowdprocess(program, bid, group, username, password, callback){

  var tokenPath = path.join(userHome, '.crowdprocess', 'auth_token.json');
  fs.exists(tokenPath, tokenExists);

  function tokenExists (exists){
    if (exists) {
      job(program, bid, group, callback);
    } else {
      login(username, password, function (){
        job(program, bid, group, callback);
      });
    }
  }
}