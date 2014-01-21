var CrowdProcess = require('..')('jj@crowdprocess.com', 'blablabla1');
var Readable = require('stream').Readable;

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

// only arguments and buffering
var job = CrowdProcess(data, Run, onResults);

job.on('data', function (d) {
  console.log('got result: ', d);
});

// no buffering
var job2 = CrowdProcess(data, Run);

job2.on('data', function (d) {
  console.log('got result: ', d);
});


// no buffering
var job2 = CrowdProcess(data, Run);

job2.on('data', function (d) {
  console.log('got result: ', d);
});

// no data is a stream

var data = new Readable({objectMode: true});
var n = 110;
data._read = function _read () {
  if (--n) {
    data.push({ n: n, d : Date.now() });
  } else {
    data.push(null);
  }
};
var job3 = CrowdProcess(data, Run);

job3.on('data', function (d) {
  console.log('got result: ', d);
});

// data is a stream, pipe to duplex

var data = new Readable({objectMode: true});
var n = 110;
data._read = function _read () {
  if (--n) {
    data.push({ n: n, d : Date.now() });
  } else {
    data.push(null);
  }
};

var job4 = CrowdProcess(Run);

data.pipe(job4);

job4.on('data', function (d) {
  console.log('got result: ', d);
});


// data is a stream, pipe it to duplex, wait for callback

var data = new Readable({objectMode: true});
var n = 110;
data._read = function _read () {
  if (--n) {
    data.push({ n: n, d : Date.now() });
  } else {
    data.push(null);
  }
};

var job4 = CrowdProcess(Run);

data.pipe(job4, onResults);

function onResults (results) {
  console.log('got all 110 results');
}