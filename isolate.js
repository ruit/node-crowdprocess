var Stream = require('stream');
var inherits = require('util').inherits;
var Duplex = Stream.Duplex ||
  require('readable-stream').Duplex;

var PassThrough = Stream.PassThrough ||
  require('readable-stream').PassThrough;

var Readable = require('stream').Readable;

  function DuplexThrough(options) {
    if (!options) options = {};
    options.objectMode = true; // force

    if (!(this instanceof DuplexThrough)) {
      return new DuplexThrough(options);
    }
    Duplex.call(this, options);
    //this.inRStream = new PassThrough(options);
    //this.outWStream = new PassThrough(options);
}

inherits(DuplexThrough, Duplex);

DuplexThrough.prototype._write = _write;
function _write (chunk, enc, cb) {
  console.log('wrote:', chunk, enc, typeof chunk);
  cb();
}

DuplexThrough.prototype._read = _read;
function _read (n) {
  console.log('trying to read ', n);
}

var rs = new Readable({objectMode: true});
var n = 100;
rs._read = function _read () {
  if (--n) {
    rs.push({ d : Date.now() });
  } else {
    rs.push(null);
  }
};

var dt = new DuplexThrough();

rs.pipe(dt).pipe(process.stdout);