var fs = require('fs');
var crowdProcess = require('..');

//Load Program 
var programString = fs.readFileSync('./src/Run.js', {encoding: 'utf8'});

var bid = 1;
crowdProcess(programString, bid, function(err, task){

  sendDataUnits(task);

  onResult(task);

  onAcknowledge(task);

  onErrors(task);

});

var sentences = require('./src/data.json');
function sendDataUnits(task){

  var word = 'browser';

  for (var i = 0; i < sentences.length; i++) {

    var dataUnit = buildDataUnit(sentences[i], word);
    task.write(dataUnit);

  }
}

function buildDataUnit(sentence, word){
  var dataUnit = {};
  dataUnit.s = sentence;
  dataUnit.w = 'browser';
  return dataUnit;on
}

function onAcknowledge(task){
  task.on('acknowledge', function(acknowledge){
    logIt('Acknowledge: ' + acknowledge);
  });
}

var resultCount = 0;
function onResult(task){

  task.on('result', function(result){

    logIt('Result:'+ JSON.stringify(result) );
    if (++resultCount === sentences.length){
      task.end();
      console.log('-->Finish receiving results')
    }
  });
}

function onErrors(task){
  task.on('fault', logError);
  task.on('error', logError);
}

function logIt(stuff){
  console.log('-->'+ stuff);
}

function logError(err){
  console.error(err);
}