var AccountClient = require('crp-account-client');
var fs = require('fs');
var read = require('read');
var userHome = require('osenv').home();
var path = require('path');

module.exports = login;

function login(email, password, callback){

  if ( email && password ){
    getToken();
  } else{
    getUser();
  }

  function getUser () {

    read({prompt: "Email:"}, function (err, user) {
      email = user;
      getPass();
    });
  }

  function getPass () {
    read({prompt: "Password:", silent: true}, function (err, pass) {
      password = pass;
      getToken();
    });
  }

  function getToken(){
    var client = AccountClient();

    client.login({
      email: email,
      password: password
    }, onLogin);


    function onLogin(err, token){
      if (err) {
        callback(err, null);
      }

      var tokenPath = path.join(userHome, '.crowdprocess', 'auth_token.json');
      fs.writeFile(tokenPath, JSON.stringify(token), {encoding: 'utf8'}, function () {
        console.log('Logged in with token:', token);
        callback(null);
      });
    }

  };
}