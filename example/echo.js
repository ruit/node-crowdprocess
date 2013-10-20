var fs = require('fs');
var crowdProcess = require('..');
var path = require('path');

var programString = fs.readfileSync(path.join(__dirname,'Run.js'));

var credentials = JSON.parse(path.join(__dirname, '../','credentials', 'flavio.sousa.json'));

LOG(programString, credentials);

function LOG(stuff){
  console.log('-->LOGGING: ', stuff);
}
