var CrowdProcess = require('..');

function Run(d) {
  return d;
}

var data = [1, 2, 3];

var crp = new CrowdProcess('email@example.com', 'password');
crp.group = "group";

crp.map(Run, data, function(result) {
  console.log(result);
});
