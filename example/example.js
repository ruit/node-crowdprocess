var CrowdProcess = require('..');
var Readable = require('stream').Readable;

function Run(d) {
  return d;
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

rs.pipe(crp(Run)).pipe(process.stdout);
/*

var rw = crp(Run);
setInterval(function () {
  var d = Date.now();
  rw.write(d);
  console.log(d);
}, 1000);

*/