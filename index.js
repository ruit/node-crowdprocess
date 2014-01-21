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
    this.inRStream = new PassThrough(options); // tasks
    this.outWStream = new PassThrough(options); // results

    this.numTasks = 0;
    this.numResults = 0;

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
      self.resultStream = streams(id).Results({ stream: true });
      self.errorStream = streams(id).Errors({ stream: true });
      self.taskStream = streams(id).Tasks();

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

      self.outWStream.on('finished', function () {
        self.push(null);
      });

      self.errorStream.on('data', function (err) {
        self.numResults++;
        self.emit('error', err);
        if (self._writableState.ended && self.numResults == self.numTasks) {
          self.resultStream.end();
          self.errorStream.end();
          self.taskStream.end();
          self.inRStream.end();
          self.outWStream.end();
          self.push(null);
        }
      });
    });
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
        if (!self.push(chunk)) {
          break;
        }
      }
    });

    if (self._writableState.ended && self.numResults == self.numTasks) {
      self.resultStream.end();
      self.errorStream.end();
      self.taskStream.end();
      self.inRStream.end();
      self.outWStream.end();
      self.push(null);
    }
  };

  return DuplexThrough;
}
