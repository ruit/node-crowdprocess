var authClient = require('crp-auth-client');
var crpTaskClient = require('crp-task-client');
var taskProducerClient = require('crp-task-producer-client');
var path = require('path');
var fs = require('fs');
var Transform = require('stream').Transform;
var util = require('util');
var osenv = require('osenv');

var DEBUG;
if (process.env.NODE_ENV &&
    process.env.NODE_ENV.toLowerCase() === 'debug')
  DEBUG = true;

var credentialLocation = path.join(osenv.home(), '.crowdprocess', 'auth_token.json');

module.exports = CrowdProcess;

function CrowdProcess (program, bid, callback) {
  var opts;
  var credential;
  if (typeof program === 'object')
    opts = program;
  else
    opts = {};

  if (opts.credential) {
    credential = opts.credential;
    createTask(program, bid, credential, onTaskCreated);
  } else if (fs.existsSync(credentialLocation)) {
    credential = JSON.parse(fs.readFileSync(credentialLocation, {
      encoding: 'utf8'
    }));
    createTask(program, bid, credential, onTaskCreated);
  } else if (opts.username && opts.password) {
    authClient.login(opts.username, opts.username, onAuth);
    function onAuth (err, cred) {
      if (err)
        throw err;
      credential = cred;
      createTask(program, bid, credential, onTaskCreated);
    }
  }

  function onTaskCreated (err, taskDoc) {
    if (DEBUG)
      console.log('--- created task', taskDoc._id);
    connectStreams(taskDoc._id);
  }

  var CONNECTED;
  function connectStreams (taskId) {
    var options = {
      credential: credential,
      taskId: taskId,
      highWaterMark: 500  // default
    };

    var stream = taskProducerClient(options);
    stream.pipe(transform)
    transform.pipe(stream);
    CONNECTED = true;
    consumeQueue();
  }

  var queue = [];
  function consumeQueue () {
    var i = queue.length;
    if (queue && i > 0) {
      while (i--) {
        transform.push(queue[i]);
      }
    }
  }

  var transform = new Transform({
    objectMode: true
  });

  transform._transform = function (chunk, encoding, cb) {
    if (CONNECTED) {
      this.push(chunk);
      return cb();
    }

    queue.push(chunk);
  };

  return transform;
}

function createTask (program, bid, credential, cb) {
  var client = crpTaskClient({
    credential: credential
  });
  
  var task = {
    bid: bid,
    program: program
  };

  client.tasks.create(task, cb);
}
