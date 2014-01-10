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
know how many occurrences of the word 'browsers' we have in each. Also, we have a lot of tweets so we'll be using
CrowdProcess to speed up the count.

We begin with a JSON array that has all the tweets:

```javascript
var data = [
  "The power of connected browsers compels you",
  "dude...latency between the browsers! And some optimizations we still need to do lol",
  "They've totally surprised us with the awesome stuff they've done so far!",
  "10000 dataunits, 1800/2000 browsers. 133.8 times faster than the local machine.",
  " It is a browser based supercomputing platform. We have many browsers"
];
```

we define our function that will run in the browser:

```javascript
function Run(data){
  //split by comma, period, single space
  words = data.split(/[ ,.]+/);

  var count = 0;
  for (var i = 0; i < words.length; i++) {
    if (words[i].toLowerCase() === 'browsers') count++;
  };

  var output = {};
  output.count = count;
  output.sentence = s;
  return output;
}

```

We require the module and call the crowdprocess map function in a node script. Using the crowdprocess module is very simple.
You only have to instanciate CrowdProcess with your email and password and execute the map function with a callback that will be called once per each computed result.

```javascript
var CrowdProcess = require('crowdprocess');

var crp = new CrowdProcess('email@example.com', 'password');

crp.map(Run, data, function(err, result) {
  console.log(result);
});
```

This pretty much covers it. See the working [example](https://github.com/CrowdProcess/node-crowdprocess/blob/master/example/example.js) to get started right away.

##Under the hood

This module is basically a wrapper around two modules that deal with job creation and
data handling in CrowdProcess. If you want to learn more check the documentation:
* [Job creation](https://github.com/CrowdProcess/crp-job-client)
* [Data handling](https://github.com/CrowdProcess/crp-stream-client)
