var fs = require('fs');
var crowdProcess = require('..');
var path = require('path');

//Load Program 
var programSource = path.join(__dirname, 'src', 'Run.js');
var programString = fs.readFileSync(programSource, {encoding: 'utf8'});

//Load Data
var sentences = require(path.join(__dirname, 'src', 'data.json'));

var bid = 1;

crowdProcess(programString, bid, function(err, task){

  //Send data units
  for (var i = 0; i < sentences.length; i++) {
    var dataUnit = {};
    dataUnit.s = sentences[i];
    dataUnit.w = 'browser';
    task.write(dataUnit);
    logIt('Sending: '+ dataUnit);
  };

  //Deal with results
  var resultCount = 0;
  task.on('result', function(result){
    dealWithResults(result);
  });

  function dealWithResults(result){
    logIt('result: ' + result);
    if (++resultCount === sentences.length){
      task.end();
      console.log('-->Finish receiving results')
    }
  }


  task.on('acknowledge', function(acknowledge){
    logIt('acknowledge: ' + acknowledge);
  });

  task.on('fault', function(fault) {
      logIt('faults' + fault);
  });

  task.on('error', logIt);

});

function logIt(stuff){
  console.log('-->LOGGING: ', stuff);
}
