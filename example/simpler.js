var CrowdProcess = require('..')('jj@crowdprocess.com', 'blablabla1');

var data = [];
var n = 10;
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

job.on('data', function (d) {
  //console.log('got result: ', d);
});

//job.end();