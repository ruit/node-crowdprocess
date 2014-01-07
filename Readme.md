#CrowdProcess 

[![CrowdProcess](http://crowdprocess.com/img/crowdprocess-logo-symbol.svg)](http://crowdprocess.com/)

[CrowdProcess](http://crowdprocess.com/) is a browser-powered distributed computing platform.  
The platform connects with our partner websites and they supply it with their viewers' browsers' processing power using an [HTML5 Web Worker](https://developer.mozilla.org/en-US/docs/Web/Guide/Performance/Using_web_workers).  

CrowdProcess then makes that processing power available to it's users.

With this module you can write node programs programatically for CrowdProcess.

##Install 

```javascript
npm install crowdprocess
```

##Getting started

The best way to explain 'how to CrowdProcess' is to get started with an example. 

Let's begin with a very simple application. We have a group of strings (tweets in this case) and we want to 
know how many  occurrences of the word 'browser' we have in each. Also, we have a lot of tweets so we'll be using 
CrowdProcess to speed up the count. 

We begin with a JSON array that has all the tweets:

```javascript
[
  "The power of connected browsers compels you",
  "dude...latency between the browsers! And some optimizations we still need to do lol",
  "They've totally surprised us with the awesome stuff they've done so far!",
  "10000 dataunits, 1800/2000 browsers. 133.8 times faster than the local machine.",
  " It is a browser based supercomputing platform. We have many browsers"
]
```

we define our function that will run in the browser:

```javascript
function Run(data){

  s = data.s;
  w = data.w;
  
  //split by comma, period, single space
  a = s.split(/[ ,.]+/);

  var count = 0;
  for (var i = 0; i < a.length; i++) {
    if (a[i].toLowerCase() === w.toLowerCase()) count++;
    if (a[i].toLowerCase() === w.toLowerCase()+'s') count++;//acount plurals
  };

  var output = {};
  output.count = count;
  output.sentence = s;
  return output;
}

```

You have to provide your username and password to the crowdprocess module. You can store it in `credentials.json`.

```javascript
{
  "email": "user@email.com",
  "password": "password"
}
```


We require the module and call the crowdprocess function in a node script. Using the crowdprocess module is very simple. After requiring you only have to execute the function with a callback that receives the job stream as an argument. You'll be using this stream to write dataunits and read results.

```javascript
var crowdprocess = require('crowdprocess');

var path = require ('path');
var fs = require ('fs');

// Load Program 
var programString = fs.readFileSync(path.join(__dirname,'src', 'Run.js'), {encoding: 'utf8'});

// Job bid (currently not being used)
var bid = 1;

// Crowdprocess processing group. Public is default
var group = 'public';

// Get credentials
var credentialsSrc = path.join(__dirname, 'credentials.json');
var credentials = require(credentialsSrc);
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
```

This pretty much covers it. See the working [example](https://github.com/CrowdProcess/node-crowdprocess/blob/master/example/counter.js) to get started right away.

##Under the hood

This module is basically a wrap up for other three modules that deal with authentication, job creation and 
data handling in CrowdProcess. If you want to learn more check the documentation:
* [Authentication client](https://github.com/CrowdProcess/crp-account-client)
* [Job creation](https://github.com/CrowdProcess/crp-job-client) 
* [Data handling](https://github.com/CrowdProcess/crp-stream-client)
