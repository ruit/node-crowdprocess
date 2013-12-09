var userHome = require('osenv').home();
var path = require('path');
var login = require('./src/auth');
var job = require('./src/job');
var fs = require('fs');

module.exports = crowdprocess;

function crowdprocess(userProgram, jobBid, groupId, callback){

  var tokenPath = path.join(userHome, '.crowdprocess', 'auth_token');
  fs.exists(tokenPath, tokenExists);

  function tokenExists (exists){
    if (exists) {
      job(userProgram, jobBid, groupId, callback);

    } else {
      login(function (){
        job(userProgram, jobBid, groupId, callback);
      });
    }
  }

}