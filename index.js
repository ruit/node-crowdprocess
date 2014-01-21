var Stream = require('stream');
var JobClient = require('crp-job-client');
var StreamClient = require('crp-stream-client');
var inherits = require('util').inherits;

var Duplex = Stream.Duplex ||
  require('readable-stream').Duplex;

var PassThrough = Stream.PassThrough ||
  require('readable-stream').PassThrough;

module.exports = CrowdProcess;

function CrowdProcess(username, password) {
  var opts = {};
  if (arguments.length === 1 &&
      typeof arguments[0] === 'string') {
    opts.token = arguments[0];
  }

  if (arguments.length === 1 &&
      typeof arguments[0] === 'object') {
    opts = arguments[0];
  }

  if (arguments.length === 2 &&
      typeof arguments[0] === 'string' &&
      typeof arguments[1] === 'string') {
    opts.email = arguments[0];
    opts.password = arguments[1];
  }

  var jobs = JobClient(opts);
  var streams = StreamClient(opts);

  function DuplexThrough(options) {
    var self = this;

    options.objectMode = true; // force

    if (!(this instanceof DuplexThrough)) {
      return new DuplexThrough(options);
    }
    Duplex.call(this, options);
    this.inRStream = new PassThrough(options);
    this.outWStream = new PassThrough(options);


    if (options instanceof Function) {
      options = {
        program: options
      };
    }

    if (options.program instanceof Function) {
      options.program = options.program.toString();
    }


    jobs.create({
      program: options.program,
      group: options.group,
      bid: options.bid
    }, function (err, res) {
      if (err) throw err;

      var id = res.id;
      var resultStream = streams(id).Results({ stream: true });
      var errorStream = streams(id).Errors({ stream: true });
      var taskStream = streams(id).Tasks();

      self.inRStream.pipe(taskStream);
      resultStream.pipe(self.outWStream);


/*
      errorStream.on('data', function (err) {
        self.outWStream.emit('error', err);
      });*/
    });
  }

  inherits(DuplexThrough, Duplex);

  DuplexThrough.prototype._write = _write;
  function _write (chunk, enc, cb) {
    this.inRStream.write(chunk, enc, cb);
  }

  DuplexThrough.prototype._read = function (n) {
    console.log('trying to read ', n);
    var self = this;

    self.outWStream
      .on('readable', function () {
        var chunk;
        while (null !== (chunk = self.outWStream.read(n))) {
          // if push returns false, stop writing
          console.log('CHEGOUOOUUUOUOU', chunk);
          if (!self.push(chunk)) {
            break;
          }
        }
      })
      .on('end', function () {
        self.push(null); // EOF
      });


/*
    self.outWStream.on('data', function (data) {
      console.log('GOT DATA', data)
      self.push(data);
    });

    self.on('end', function () {
      self.push(null); // EOF
    });*/
  };

  return DuplexThrough;
/*
  function Map(program, data, onResults) {
    var s = new Stream();
    s.writable = true;
    s.readable = true;

    s.write = write;
    s.end = end;
    s.destroy = destroy;


    function write (d) {
      if (taskStream && taskStream.writable)
        return taskStream.write(d);
      return false;
    }

    function end () {
      console.log('END');
    }

    function destroy () {
      console.log('DESTROY');
    }

    var taskStream;
    var resultsBuffer = [];

    var opts;
    if (typeof program === 'object') {
      opts = program;
    } else {
      opts = {
        program: program
      };
    }

    if (opts.program instanceof Function)
      opts.program = opts.program.toString();


    jobs.create({
      program: opts.program,
      group: opts.group,
      bid: opts.bid
    }, function (err, res) {
      if (err) throw err;

      var id = res.id;
      var numTasks = 0;
      var numResults = 0;
      var inputClosed = false;

      var resultStream = streams(id).Results({ stream: true });
      resultStream.on('data', function(result) {
        numResults++;

        if (onResults instanceof Function) {
          resultsBuffer.push(result);
        }

        if (inputClosed && numResults == numTasks) {
          resultStream.end();
          errorStream.end();
          onResults(resultsBuffer);
          s.emit('end');
        }
      });

      var errorStream = streams(id).Errors({ stream: true });
      errorStream.on('data', function(error) {
        numResults++;

        s.emit('error', error);

        if (inputClosed && numResults == numTasks) {
          errorStream.end();
          resultStream.end();
          onResults(resultsBuffer);
          s.emit('end');
        }
      });

      taskStream = streams(id).Tasks();
      taskStream.on('data', function (d) {
        console.log('got data!', d);
      });

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

    return s;
  }*/
}
