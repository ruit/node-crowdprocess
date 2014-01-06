var Stream = require('stream');
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
      var numTasks = 0;
      var numResults = 0;
      var inputClosed = false;

      var resultStream = streams(id).Results({ stream: true });
      resultStream.on('data', function(result) {
        numResults++;
        if (inputClosed && numResults == numTasks) {
          resultStream.end();
          errorStream.end();
        }
        results(result);
      });

      var errorStream = streams(id).Errors({ stream: true });
      errorStream.on('data', function(error) {
        numResults++;
        if (inputClosed && numResults == numTasks) {
          errorStream.end();
          resultStream.end();
        }
      });

      var taskStream = streams(id).Tasks();
      taskStream.on('end', function() {
        inputClosed = true;
        if (inputClosed && numResults == numTasks) {
          errorStream.end();
          resultStream.end();
        }
      });
      if (data instanceof Stream) {
        data.on('data', function(d) {
          taskStream.write(d);
          numTasks++;
        });

        data.on('end', function() {
          taskStream.end();
        });
      } else {
        for (var i=0; i < data.length; i++) {
          taskStream.write(data[i]);
          numTasks++;
        }
        taskStream.end();
      }
    });
  }

  this.map = map;
}
