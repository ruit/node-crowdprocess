var JobClient = require('crp-job-client');
var StreamClient = require('crp-stream-client');

module.exports = CrowdProcess;

function CrowdProcess(email, password) {
  var jobs = JobClient({
    email: email,
    password: password
  });
  var streams = StreamClient({
    email: email,
    password: password
  });

  function map(program, data, results) {
    if (typeof program !== 'string' && typeof program.toString === 'function')
      program = program.toString();

    jobs.create({ program: program }, function (err, res) {
      if (err) throw err;

      var id = res.id;

      var numResults = 0;
      var resultStream = streams(id).Results({ stream: true });
      resultStream.on('data', function(result) {
        numResults++;
        if (numResults == data.length) {
          resultStream.end();
          errorStream.end();
        }
        results(result);
      });

      var errorStream = streams(id).Errors({ stream: true });
      errorStream.on('data', function(error) {
        numResults++;
        if (numResults == data.length) {
          errorStream.end();
          resultStream.end();
        }
      });

      var taskStream = streams(id).Tasks();
      for (var i=0; i < data.length; i++) {
        taskStream.write(data[i]);
      }
      taskStream.end();
    });
  }

  this.map = map;
}
