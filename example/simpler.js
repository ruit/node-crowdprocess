var CrowdProcess = require('..')('jj@crowdprocess.com', 'blablabla1');

var data = [];
var n = 100;
while (n--) {
  data.push(n);
}

function Run (d) {
  return d;
}

function onResults (results) {
  console.log('got all', results.length, 'results');
}

var job = CrowdProcess(data, Run, onResults);

