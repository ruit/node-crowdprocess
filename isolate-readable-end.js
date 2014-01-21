var Readable = require('stream').Readable;

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

rs.pipe(process.stdout);