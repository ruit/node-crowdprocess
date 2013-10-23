#CrowdProcess 

Write node programs programatically for CrowdProcess with a single module.

##Install 

```javascript
npm install crowdprocess
```

##Getting started

The best way to explain 'how to CrowdProcess' is to get started with an example.
We'll assume that you already installed [crowdprocess-cli](https://github.com/CrowdProcess/crp-cli) and are currently logged in. 
You have to be logged in CrowdProcess to be able to create tasks and stream data unit ( follow the link to learn how to [login](https://github.com/CrowdProcess/crp-cli#login)).

Let's begin with a very simple application. We have a group of string (tweets if you must) and we want to 
know who many  occurrences of the word 'browser' we have in each. Also, we have a lot of tweets so we'll be using 
CrowdProcess to speed up the count. 

We begin with a JSON array that has all the tweets:

```javascript
[
  "The power of connected browsers compels you",
  "dude... latency between the browsers! And some optimizations we still need to do lol",
  "They’ve totally surprised us with the awesome stuff they’ve done so far!",
  "10000 data units, 1800/2000 browsers. 133.8 times faster than the local machine.",
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
    if (a[i] === w) count++;
  };
  return count;
}
```


and we require the module and call the crowdprocess function in a node script. Using the crowdprocess module is very simple. After requiring you only have to execute the function with a callback 
that receives the task stream as an argument. You'll be using this stream to write data units and read results.

```javascript
var crowdprocess = require('crowdprocess');

var tweets = [/*array with all the tweets*/];
var word = 'browser';

//Task bid
var bid = 1;

var programString = /*String with Run function*/

crowdProcess(programString, bid, function(err, task){

  for (var i = 0; i < tweets.length; i++) {
    
    //Data unit object
    dataUnit.s = tweets[i];
    dataUnit.w = word;
    task.write(dataUnit);

  }; 

  //Deal with results
  task.on('result', function(result){
    console.log(result);
  });

});
```

This pretty much covers it all. See the working example! and get started right away.

##Under the hood

This module is basically a wrap up for other three modules that deal with authentication, task creation and 
data handling in CrowdProcess. If you want to learn more just follow the links:
* [Athentication cliente](https://github.com/CrowdProcess/crp-auth-client)
* [Task creation](https://github.com/CrowdProcess/crp-task-client) 
* [data handling](https://github.com/CrowdProcess/crp-task-producer-client)