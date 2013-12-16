var userHome = require('osenv').home();
var path = require('path');
var login = require('./src/auth');
var job = require('./src/job');
var fs = require('fs');

var AccountClient = require('crp-account-client');

module.exports = crowdprocess;

function crowdprocess(program, bid, group, email, password, callback){

  if ( group === 'public' ) {
    group = undefined;
  } else {
    callback('Group does not exist', null);
  }

  var tokenPath = path.join(userHome, '.crowdprocess', 'auth_token.json');
  fs.exists(tokenPath, tokenExists);

  function tokenExists (exists){
    if (exists) {
      job(program, bid, group, callback);
    } else {
      login(email, password, function (){
        job(program, bid, group, callback);
      });
    }
  }
}