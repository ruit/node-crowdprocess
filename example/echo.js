var fs = require('fs');
var crowdProcess = require('..');
var path = require('path');

//Load Program 
var programSource = path.join(__dirname, 'src', 'Run.js');
var programString = fs.readFileSync(programSource, {encoding: 'utf8'});

//Load credentials
var credSource = path.join(__dirname, '../','credentials', 'flavio.sousa.json' );
var credentials = JSON.parse( fs.readFileSync( credSource, {encoding: 'utf8'}));

var task = crowdProcess(credentials, program, err);
if (err) throw err;

//Send data units
var numDataUnits = 10
for (var i = 0; i < numDataUnits; i++) {
  task.write(i);
};

//Deal with results
task.on('results', function(results){
  //Do stuff with result
}

task.on('acknowledge', function(acknowledge){
  //Do stuff with acknowledge
}

task.on('fault', function(fault) {
    //Do stuff with faults
});

task.on('drain', function() {
    task.end();
    console.log('Finished receiving results');
});


function LOG(stuff){
  console.log('-->LOGGING:\n ', stuff);
}
