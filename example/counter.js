var crowdprocess = require('..');

var path = require ('path');
var fs = require ('fs');

// Load Program 
var programString = fs.readFileSync(path.join(__dirname,'src', 'Run.js'), {encoding: 'utf8'});

// Job bid (currently not being used)
var bid = 1;

// Get credentials
var credentialsSrc = path.join(__dirname, 'credentials.json');
var credentials = require(credentialsSrc);
var email = credentials.email;
var password = credentials.password;

crowdprocess(programString, bid, undefined, email, password, function(err, job){

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
  return dataUnit;on
}

var resultCount = 0;
function onResult(job){

  job.on('data', function(result){

    logIt('Result:'+ JSON.stringify(result) );
    if (++resultCount === sentences.length){
      job.end();
      console.log('-->Finish receiving results')
    }
  });
}

function onErrors(job){
  job.on('error', logError);
}

function logIt(stuff){
  console.log('-->'+ stuff);
}

function logError(err){
  console.error(err);
}
