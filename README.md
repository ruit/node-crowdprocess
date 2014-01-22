#CrowdProcess

<p align="center">
[![CrowdProcess](https://crowdprocess.com/img/overview.png)](https://crowdprocess.com/)
</p>

[CrowdProcess](https://crowdprocess.com/) is a browser-powered distributed computing platform.

This is the easiest entry-level module to use CrowdProcess in node.js (and the [browser](https://github.com/substack/node-browserify)).

If you're not sure about how CrowdProcess works, you should go through [the guide](https://crowdprocess.com/guide), it should take you less than 5 minutes.

##Install

```javascript
npm install crowdprocess
```

##Examples speek louder than words

```javascript
var credentials = require('./credentials');
var CrowdProcess = require('..')(credentials);

function Run (d) {
  return d*2;
}

var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

CrowdProcess(data, Run, function (results) {
  console.log('results:', results);
});

```

Notice any [resemblance](https://github.com/caolan/async#map);

This pretty much covers it. There are more [examples](https://github.com/CrowdProcess/node-crowdprocess/tree/master/examples) using streams.

##More detailed use

### Require and Authenticate

```
var credentials = require('./credentials');
var CrowdProcess = require('..')(credentials);
```

The `credentials` object should be something like `{ "email": "your@email.com", "password": "secret" }` or `{ "token": "eaa35d67-2aef-4b14-a50e-9d6c13f5012e" }`. If you don't have an account yet, you should [get one](https://crowdprocess.com/register). It takes less than 20 seconds ;)

### CrowdProcess([data, ] Run[, cb]) is a [Duplex](http://nodejs.org/api/stream.html#stream_class_stream_duplex_1) stream

The `CrowdProcess` object you get after requiring and authenticating is a "job builder", meaning you can use it to create CrowdProcess Jobs. Just pass it [at least] a `Run` function and you'll get a Duplex stream:

```javascript
var job = CrowdProcess(Run);
console.log(job instanceof Duplex) // true
```

This means you can pipe data do it, and results from it!

**`Run`** is the only mandatory parameter.

### The input data

Input data must be either an Array of objects or a [Readable](http://nodejs.org/api/stream.html#stream_class_stream_readable_1) [objectMode](http://nodejs.org/api/stream.html#stream_object_mode) stream.

If you choose to use an Array, you must pass it as the first parameter:

```javascript
var dataArray = [1, 2, 3];
CrowdProcess(dataArray, Run, onResults);
```

If you choose to use a Readable stream, then you can either pass it as the first parameter:

```
var dataStream = new Readable();
CrowdProcess(dataStream, Run, onResults);
```

Or pipe it:

```
var dataStream = new Readable();
dataStream.pipe(CrowdProcess(Run, onResults));
```

### Getting the results

If you want the results to be buffered, just pass a callback:

```javascript
var dataArray = [1, 2, 3];
CrowdProcess(dataArray, Run, function (results) {
  console.log('results: ', results);
});

```

If you don't want them buffered, don't pass the callback:

```javascript
var dataArray = [1, 2, 3];

var job = CrowdProcess(dataArray, Run);

job.on('data', function (result) {
  console.log('got a result: ', result);
});

job.on('end', function () {
  console.log('got all results!');
});

```

### Listening for errors

If your job yields errors, you should catch them so you can make it better next time:

```javascript
var dataArray = [1, 2, 3];

var job = CrowdProcess(dataArray, Run);

job.on('error', function (err) {
  console.error('oh no:', err);
});

```

If you don't listen for errors and they occur, an uncaught exception will be thrown.

##Caveats

1. The Duplex stream exposed accepts and delivers [`objectMode`](http://nodejs.org/api/stream.html#stream_object_mode) streams, so you can't, for instance, pipe directly it to `process.stdout`. You need to pass them through a stringifier like [JSONStream](https://github.com/dominictarr/JSONStream) or [newline-json](https://github.com/CrowdProcess/newline-json)

##Under the hood

This module is basically a wrapper around two modules that deal with job creation and
data handling in CrowdProcess. If you want to learn more check the documentation:
* [Job creation](https://github.com/CrowdProcess/crp-job-client)
* [Data handling](https://github.com/CrowdProcess/crp-stream-client)
