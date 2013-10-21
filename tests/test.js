var fs = require('fs');
var crowdProcess = require('..');
var path = require('path');
var test = require('tap').test;

test('Test Everything!!', function(t){

  var programString = "function Run(data){ return data *2;}";
  var bid = 1;

  var task = crowdProcess(programString, bid, function(err, task){

    //Send data units
    var numDataUnits = 10
    for (var i = 1; i <= numDataUnits; i++) {
      task.write(i);
    };

    var sumReceived = 0;
    //Deal with results
    task.on('result', function(result){
      dealWithResults(result);
    });

    var received = 0
    function dealWithResults(result){
      sumReceived += result;
      if (++received === numDataUnits){
        t.ok(sumReceived === numDataUnits*(numDataUnits+1), 'Everything is ok.');
        t.end();
      }

    }
  });

});