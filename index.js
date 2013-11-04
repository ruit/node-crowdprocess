var crpTaskClient = require('crp-task-client');
var taskProducerClient = require('crp-task-producer-client');
var path = require('path');
var osenv = require('osenv')
var fs = require('fs');

module.exports = function crowdProcess(userProgram, theBid, callbaque ){

  var credSource = path.join(osenv.home(), '.crowdprocess', 'auth_token.json');
  var credentials = JSON.parse( fs.readFileSync( credSource, {encoding: 'utf8'}));

  var client = crpTaskClient({credential: credentials});
  
  var task = {
    bid: theBid,
    program: userProgram
  };

  client.tasks.create(task, function(err, taskDoc){
    if (err) throw err;
    console.log('-->Created task with id', taskDoc._id);
    whenTaskCreated(taskDoc._id);
  });

  var resultCount = 0;
  var pending = 0;
  function whenTaskCreated(theTaskID){

    var options = {
      credential: credentials,
      taskId: theTaskID,
      highWaterMark: 500  // default
    }

    var stream = taskProducerClient(options);

    //voodoo code to count sent data units
    var streamWrite = stream.write;
    stream.write = interceptWrite;
    function interceptWrite() {
      streamWrite.apply(this, arguments);
      ++pending;
    }

    callbaque(null, stream);
  }
} 