var credentials = require('./credentials');
var CrowdProcess = require('..')(credentials);

var data = [];
var n = 10;
while (n--) {
  data.push(n);
}

function Run (d) {
  return d*2;
}

var job = CrowdProcess(data, Run, onResults);

function onResults (results) {
  console.log('got all', results.length, 'results');
}