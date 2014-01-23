var test = require('tap').test;
var credentials = require('../credentials.json');
var CrowdProcess = require('..')(credentials);
var program = require('./fixtures/program');
var N = 100;

test('tasks may be null', function (t) {
  var dataArray = new Array(N);
  var dataArray = [1,2,3,null];
  var job = CrowdProcess(dataArray, program, onResults);

  function onResults (results) {
    //t.equal(results.length, N);
    console.log(results);
    t.deepEqual(results.sort(), dataArray.sort());
    t.end();
  }
});