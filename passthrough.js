var PassThrough = require('stream').PassThrough;

var pt = new PassThrough();

//pt.pipe(process.stdout);

var n = 10000000000;
while (n--) {
  pt.write(n+'');
}

pt.end();