var CrowdProcess = require('..');
var Readable = require('stream').Readable;
var Writable = require('stream').Writable;

function Run(d) {
  return d*2;
}

var data = new Readable({objectMode: true});
var n = 110;
data._read = function _read () {
  if (--n) {
    data.push({ n: n, d : Date.now() });
  } else {
    data.push(null);
  }
};

var results = new Writable({objectMode: true});
results.write = function write (chunk, encoding, cb) {
  if (cb)
    cb();
  return true;
};


var credentials = require('./credentials');
var crp = new CrowdProcess(credentials);

var job = crp(data, Run, function (r) { console.log('got all:', r.length); });
//data.pipe(job);

/*
while (n--) {
  job.write({ n: n, d : Date.now() });
}

job.end();
*/


job.on('end', function () {
  console.log('job ended');
});

job.on('data', function (d) {
  console.log('got data', d);
});

job.on('error', function (err) {
  console.error('got error: ', err);
});