var crowdprocess = require('..');

var path = require ('path');
var fs = require ('fs');

// Load Program 
var programString = fs.readFileSync(path.join(__dirname,'src', 'Run.js'), {encoding: 'utf8'});

// Job bid (currently not being used)
var bid = 1;

//Default group is 'public' 
var group = 'stlx';

// Get credentials
var credentials = require('../credentials.json');
var email = credentials.email;
var password = credentials.password;

crowdprocess(programString, bid, group, email, password, function(err, job){

  if (err) throw err;

  sendDataUnits(job);

  onResult(job);

  onErrors(job);

});

var sentences = require('./src/data.json');
function sendDataUnits(job){

  var word = 'browser';

  for (var i = 0; i < sentences.length; i++) {

    var dataUnit = buildDataUnit(sentences[i], word);
    job.write(dataUnit);

  }
}

function buildDataUnit(sentence, word){
  var dataUnit = {};
  dataUnit.s = sentence;
  dataUnit.w = 'browser';
  return dataUnit;
}

var resultCount = 0;
var errorCount = 0;
function onResult(job){
  job.on('data', function(result){
    console.log('Result:', JSON.stringify(result) );
    ++resultCount;
    rendezVous(job);
  });
}

function onErrors(job){
  job.on('error', function (error ){ 
    console.log(error);
    ++errorCount;
    rendezVous(job);
  });
}

function rendezVous (job) {
  if (resultCount + errorCount === sentences.length) {
    job.destroy();
    console.log('Finish receiving results.');
  }
}