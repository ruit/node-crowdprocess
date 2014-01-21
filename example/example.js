var CrowdProcess = require('..');
var Readable = require('stream').Readable;
var Writable = require('stream').Writable;

function Run(d) {
  return d;
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


var credentials = {
 email: 'user@email.com',
 password: 'password'
};

credentials.email = 'jj@crowdprocess.com';
credentials.password = 'blablabla1';

var crp = CrowdProcess(credentials.email, credentials.password);
var job = crp(Run);
//data.pipe(job);

while (n--) {
  job.write({ n: n, d : Date.now() });
}

job.end();



job.on('end', function () {
  console.log('job ended');
});

job.on('data', function (d) {
  console.log('got data', d);
});

job.on('error', function (err) {
  console.error('got error: ', err);
});