var JobClient = require('crp-job-client');
var JobStreamClient = require('crp-stream-client');
var path = require('path');
var osenv = require('osenv');
var fs = require('fs');
var error = require('./error');

module.exports = function crowdProcess(userProgram, jobBid, groupId, callback ){

  var tokenSource = path.join(osenv.home(), '.crowdprocess', 'auth_token.json');
  var token = require(tokenSource);

  var job = JobClient({token: token});
  
  var program = {
    bid: jobBid,
    group: groupId,
    program: userProgram
  };

  job.create(program, function(err, jobDoc){
    if (err) return callback(err);
    jobId = jobDoc.id;
    console.log('Created job with token', jobId, '...');
    onJobCreation(jobId);
  });

  var resultCount = 0;
  var pending = 0;
  function onJobCreation(jobId){

    var jobStreamClient = JobStreamClient({
      token: token,
      jobId: jobId,
      only: true
    });

    //voodoo code to count send data units
    var streamWrite = jobStreamClient.write;
    jobStreamClient.write = interceptWrite;
    function interceptWrite() {
      streamWrite.apply(this, arguments);
      ++pending;
    }

    callback(null, jobStreamClient);
  }
} 