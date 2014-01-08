var CrowdProcess = require('..');

function Run(d) {
  return d*2;
}

var data = [1, 2, 3];

var credentials = require('../credentials');
var crp = new CrowdProcess(credentials.email, credentials.password);

crp.map(Run, data, function(err, result) {
  console.log(result);
});
