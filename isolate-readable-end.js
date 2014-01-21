var Readable = require('stream').Readable;
var PassThrough = require('stream').PassThrough ||
  require('readable-stream').PassThrough;

var rs = new Readable();
var n = 100;
rs._read = function _read () {
  if (--n) {
    rs.push(n+'');
  } else {
    rs.push(null);
  }
};

rs.on('end', function () {
  console.log('rs ended!');
});

var pt = new PassThrough();

rs.pipe(pt).pipe(process.stdout);

pt.on('data', function (d) {
  //console.log('got data in pt', d);
});

pt.on('end', function () {
  console.log('pt ended!!!!!!');
});