var JobClient = require('crp-job-client');
var JobStreamClient = require('crp-stream-client');

var path = require('path');
var osenv = require('osenv');
var fs = require('fs');

module.exports = function job(program, bid, group, callback ){

  var tokenSource = path.join(osenv.home(), '.crowdprocess', 'auth_token.json');
  var token = require(tokenSource);

  var credentials = {token: token}
  var jobs = JobClient(credentials);
  var jobStreamClient = JobStreamClient(credentials);
  
  var settings = {
    bid: bid,
    group: group,
    program: program
  };

  var jobId;
  jobs.create(settings, function(err, job){
    if (err) return callback(err);
    jobId = job.id;
    console.log('Created job with Id', jobId, '...');
    onJobCreation(jobId);
  });

  function onJobCreation(jobId){

    var duplex = jobStreamClient(jobId).Duplex({
      timeout: '10000ms'
    });

    callback(null, duplex);
  }
} 