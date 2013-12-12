var fs = require('fs');
var crowdProcess = require('..');
var path = require('path');
var test = require('tap').test;

// Get credentials
var credentialsSrc = path.join(__dirname, 'credentials.json');
var credentials = require(credentialsSrc);
var email = credentials.email;
var password = credentials.password;

test('Test Job', function(t){

  var programString = "function Run(data){ return data *2;}";
  var bid = 1;

  crowdProcess(programString, bid, undefined, email, password, function(err, job){

    //Send data units
    var numDataUnits = 10;
    for (var i = 1; i <= numDataUnits; i++) {
      console.log('-->send:', i)
      job.write(i);
    };

    var sumReceived = 0;
    //Deal with results
    job.on('data', function(result){
      dealWithResults(result);
    });

    var received = 0
    function dealWithResults(result){
      console.log('-->result:', received+1);
      sumReceived += result;
      if (++received === numDataUnits){
        job.end();
        t.ok(sumReceived === numDataUnits*(numDataUnits+1), 'Everything is ok.');
        t.end();
      }
    }
  });

});
