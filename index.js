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

  function DuplexThrough(data, program, onResults) {
    if (!(this instanceof DuplexThrough)) {
      return new DuplexThrough(data, program, onResults);
    }

    var self = this;

    var opts = {};

    if (Object.getPrototypeOf(data) === Object.prototype)
      opts = data;

    if (data instanceof Stream || data instanceof Array) {
      opts.data = data;
    }

    if (data instanceof Function) {
      opts.program = data.toString();
    }

    if (typeof data === 'string') {
      opts.program = data;
    }

    if (!opts.program && program instanceof Function) {
      opts.program = program.toString();
    }

    if (!opts.program && typeof program === 'string') {
      opts.program = program;
    }

    if (arguments.length === 2 &&
        opts.program &&
        !opts.data &&
        program instanceof Function) {
      opts.onResults = program;
    }

    if (onResults instanceof Function) {
      opts.onResults = onResults;
    }

    opts.objectMode = true; // force objectMode

    Duplex.call(this, opts);

    this.opts = opts;

    this.inRStream = new PassThrough(opts); // tasks
    this.outWStream = new PassThrough(opts); // results

    this.numTasks = 0;
    this.numResults = 0;
    this.bufferedResults = [];

    jobs.create({
      program: opts.program,
      group: opts.group,
      bid: opts.bid
    }, function (err, res) {
      if (err) throw new Error(err);

      var id = res.id;
      self.resultStream = streams(id).Results({ stream: true });
      self.errorStream = streams(id).Errors({ stream: true });
      self.taskStream = streams(id).Tasks();

      if (self.opts.data instanceof Stream) {
        self.opts.data.pipe(self.inRStream);
      }

      if (self.opts.data instanceof Array) {
        var data = self.opts.data;
        var n = data.length;
        for (var i = 0; i < n; i++) {
          self.numTasks++;
          self.inRStream.write(data[i]);
        }
        self.inRStream.end();
      }

      self.inRStream.pipe(self.taskStream);
      self.resultStream.pipe(self.outWStream);

      self.inRStream.on('end', function () {
        if (self.numResults == self.numTasks) {
          self.inRStream.end();
          self.outWStream.end();
          self.push(null);
        }
      });

      self.outWStream.on('end', function () {
        self.push(null);
      });

      self.errorStream.on('data', function (err) {
        self.numResults++;
        self.emit('error', err);
        if (self._writableState.ended && self.numResults == self.numTasks) {
          self.resultStream.end();
          self.errorStream.end();
          self.inRStream.end();
          self.push(null);
          if (self.opts.onResults) {
            self.opts.onResults(self.bufferedResults);
          }
        }
      });
    });

/*
    setInterval(function () {
      console.log(self._writableState.ended, self.numResults, self.numTasks);
    }, 500);*/
  }

  inherits(DuplexThrough, Duplex);

  DuplexThrough.prototype._write = _write;
  function _write (chunk, enc, cb) {
    this.numTasks++;
    this.inRStream.write(chunk, enc, cb);
  }

  DuplexThrough.prototype._read = function (n) {
    var self = this;
    self.outWStream.once('readable', function () {
      var chunk;
      while (null !== (chunk = self.outWStream.read(n))) {
        self.numResults++;
        console.log('have a result: ', chunk)
        if (!self.push(chunk)) {
          break;
        } else {
          if (self.opts.onResults) {
            self.bufferedResults.push(chunk);
          }
        }

        if (self._writableState.ended && self.numResults == self.numTasks) {
          self.resultStream.end();
          self.errorStream.end();
          self.inRStream.end();
          self.push(null);
          if (self.opts.onResults) {
            self.opts.onResults(self.bufferedResults);
          }
        }
      }
    });
  };

  return DuplexThrough;
}
