var Stream = require('stream');
var PassThrough = Stream.PassThrough ||
  require('readable-stream').PassThrough;

var Readable = require('stream').Readable;

var pt = new PassThrough({objectMode: true});

var rs = new Readable({objectMode: true});
var n = 100;
rs._read = function _read () {
  if (--n) {
    rs.push({ d : Date.now() });
  } else {
    rs.push(null);
  }
};

rs.pipe(pt).pipe(process.stdout);