#CrowdProcess

[![CrowdProcess](https://crowdprocess.com/img/crowdprocess-logo-symbol.svg)](https://crowdprocess.com/)

[CrowdProcess](https://crowdprocess.com/) is a browser-powered distributed computing platform.
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

We begin with a Readable stream:

```javascript

var Readable = require('stream').Readable;
var rs = Readable();

var n = 100;

rs._read = function () {
  if (--n)
    rs.push(n);
  else
    rs.push(null);
};
```

we define our function that will run in the browser:

```javascript
function Run(n){
  return n*2;
}

```

We require the module and call the crowdprocess map function in a node script. Using the crowdprocess module is very simple.
You only have to instanciate CrowdProcess with your credentials (email and password or auth token).

```javascript
var CrowdProcess = require('crowdprocess');
var crp = new CrowdProcess({
  email: 'email@example.com',
  password: 'password'
});

// or
// var crp = new CrowdProcess({ token: 'bb74a721-1728-45fe-8394-2d3ef4e0ac82' });

rs.pipe(crp(Run)).pipe(process.stdout);
```

This pretty much covers it. See the working [example](https://github.com/CrowdProcess/node-crowdprocess/blob/master/example/example.js) to get started right away.

##Under the hood

This module is basically a wrapper around two modules that deal with job creation and
data handling in CrowdProcess. If you want to learn more check the documentation:
* [Job creation](https://github.com/CrowdProcess/crp-job-client)
* [Data handling](https://github.com/CrowdProcess/crp-stream-client)
