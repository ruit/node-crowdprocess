var fs = require('fs');
var crowdProcess = require('..');
var path = require('path');

//Load Program 
var programSource = path.join(__dirname, 'src', 'Run.js');
var programString = fs.readFileSync(programSource, {encoding: 'utf8'});

var bid = 1;

var task = crowdProcess(programString, bid, function(err, task){

  //Send data units
  var numDataUnits = 10
  for (var i = 0; i < numDataUnits; i++) {
    task.write(i);
    LOG('Writing: '+ i);
  };

  //Deal with results
  task.on('result', function(result){
    LOG('result: ' + result);
  });

  task.on('acknowledge', function(acknowledge){
    LOG('acknowledge: ' + acknowledge);
  });

  task.on('fault', function(fault) {
      LOG('faults' + fault);
  });

  task.on('error', LOG);

});

function LOG(stuff){
  console.log('-->LOGGING:\n ', stuff);
}
