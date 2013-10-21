var crpTaskClient = require('crp-task-client');
var taskProducerClient = require('crp-task-producer-client');
var path = require('path');
var fs = require('fs');

module.exports = function crowdProcess(userProgram, theBid, callbaque ){

  var credSource = path.join('/home/fsousa', '.crowdprocess', 'auth_token.json');
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

    stream.on('result', function(){
      dealWithResults(stream);
    });

    //voodoo code to count sent data units
    var streamWrite = stream.write;
    stream.write = interceptWrite;
    function interceptWrite() {
      streamWrite.apply(this, arguments);
      ++pending;
    }

    callbaque(null, stream);
  }

  function dealWithResults(stream){
    if (++resultCount === pending){
      stream.end();
      console.log('Finish receiving results')
    }
  }

} 