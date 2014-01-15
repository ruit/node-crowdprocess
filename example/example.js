var CrowdProcess = require('..');

function Run(d) {
  return d*2;
}

var data = [1, 2, 3];

//Write your mail and password in credentials.json
// {
//   "email": "your@mail.com",
//   "password": "yourpassword"
// }

var credentials = require('./credentials');
var crp = new CrowdProcess(credentials.email, credentials.password);

crp.map(Run, data, function(err, result) {
  console.log(result);
});
