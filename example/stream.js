var CrowdProcess = require('..');

function Run(d) {
  return d;
}

var data = process.stdin;
data.setEncoding('utf8');

var crp = new CrowdProcess('email@example.com', 'password');

crp.map(Run, data, function(result) {
  console.log(result);
});
