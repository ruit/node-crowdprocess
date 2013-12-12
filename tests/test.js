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

    // Input stream (create tasks)
    var nTasks = 10;
    for (var i = 1; i <= nTasks; i++) {
      console.log('-->send:', i)
      job.write(i);
    };
    job.end();

    var rcvdTotal = 0,
        rcvdErrors = 0,
        rcvdResults = 0;

    // Output stream (receive results and errors)
    job.on('data' , handleResult);
    job.on('error', handleError );

    function handleResult (result) {
      rcvdResults++;
      rcvdTotal = rcvdErrors + rcvdResults;
      console.log(' > result:', rcvdResults);
      if (rcvdTotal === nTasks){
        job.destroy();
        t.ok(rcvdTotal === nTasks, 'Received errors and results equals number of tasks.');
        t.end();
      }
    }
    
    function handleError (error) {
      rcvdErrors++;
      console.warn(' > error:', rcvdErrors);
    }

  });
});

