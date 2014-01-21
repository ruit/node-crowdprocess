var CrowdProcess = require('..');
var Readable = require('stream').Readable;
var Writable = require('stream').Writable;

function Run(d) {
  if (d.n === 50)

    throw new Error('OOPS, EXCEPTION AT 50');
  return d;
}

var data = new Readable({objectMode: true});
var n = 110;
data._read = function _read () {
  if (--n) {
    data.push({ n: n, d : Date.now() });
  } else {
    console.log('CLOSING INPUT');
    data.push(null);
    //data.emit('end');
  }
};

var results = new Writable({objectMode: true});
results.write = function write (chunk, encoding, cb) {
  console.log('wrote ', chunk, encoding, typeof chunk);
  if (cb)
    cb();
  return true;
};
//Write your mail and password in credentials.json
// {
//   "email": "your@mail.com",
//   "password": "yourpassword"
// }

var credentials = {
 email: 'jj@crowdprocess.com',
 password: 'blablabla1'
};

var crp = CrowdProcess(credentials.email, credentials.password);

process.stdout._readableState.objectMode = true;

var job = crp(Run);

data.pipe(job).pipe(results);

job.on('error', function (err) {
  console.error('got error: ', err);
});
/*

var rw = crp(Run);
setInterval(function () {
  var d = Date.now();
  rw.write(d);
  console.log(d);
}, 1000);

*/