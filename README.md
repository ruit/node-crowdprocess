#CrowdProcess

<p align="center">
  <a href="http://crowdprocess.com" target="new">
    <img src="https://crowdprocess.com/img/overview.png" alt="CrowdProcess"/>
  </a>
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

```javascript
var credentials = require('./credentials');
var CrowdProcess = require('..')(credentials);
```

The `credentials` object should be something like

```json
{
  "email": "your@email.com",
  "password": "secret"
}
```

or

```json
{
  "token": "eaa35d67-2aef-4b14-a50e-9d6c13f5012e"
}
```

If you don't have CrowdProcess account yet, you should [get one](https://crowdprocess.com/register). It takes less than 20 seconds ;)

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

```javascript
var dataStream = new Readable();
CrowdProcess(dataStream, Run, onResults);
```

Or pipe it:

```javascript
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

## Mock mode

Mock mode allows you to use this module without actually creating a Job, sending input data and receiving results to and from CrowdProcess. Everything will happen locally. Whatever you pipe into the stream will be passed to your `Run` as an argument, and the output will be piped back to you.

It's good if you're not sure you're using this module correctly or just don't want to be computing all the time during development.

To use it, create the stream with an options object, and set `mock` to `true` as one of the options, like so:

```javascript
var dataArray = [1, 2, 3];

function onResults (results) {
  console.log('yay got some results:', results);
}

var job = CrowdProcess({
  data: dataArray,
  program: Run,
  onResults: onResults,
  mock: true
});
```

It also works with the duplex stream:

```javascript
var job = CrowdProcess({
  program: Run,
  mock: true
});

dataStream.pipe(job).pipe(resultsStream);
```


## Caveats

1. The Duplex stream exposed accepts and delivers [`objectMode`](http://nodejs.org/api/stream.html#stream_object_mode) streams, so you can't, for instance, pipe directly it to `process.stdout`. You need to pass them through a stringifier like [JSONStream](https://github.com/dominictarr/JSONStream) or [newline-json](https://github.com/CrowdProcess/newline-json)

2. You cannot use `null` as input data. All streams used in this implementation are [Streams 2](http://blog.nodejs.org/2012/12/20/streams2/) and if you have a null inside your input data array or stream, somewhere along the implementation there will be a [`Readable.push(null)`](http://nodejs.org/api/stream.html#stream_readable_push_chunk_encoding), which closes the stream.

##Tests and Examples

If you run `npm test`, you'll be testing the module in [mock mode](#mock-mode). If you want to test this module's functionality with the live CrowdProcess platform, you have to create a `credentials.json` file in the root of this repository with your security credentials, that may be either `email` and `password` or `token`. They're the same object described [above](#require-and-authenticate), and then run `node test/all.js` to test the general functionality, and other files you'll find in the `test` directory.

Don't worry, your `credentials.json` will be [`.gitignore`d](https://github.com/CrowdProcess/node-crowdprocess/blob/master/.gitignore#L2).


##Under the hood

This module is basically a wrapper around two modules that deal with job creation and
data handling in CrowdProcess. If you want to learn more check the documentation:
* [Job creation](https://github.com/CrowdProcess/crp-job-client)
* [Data handling](https://github.com/CrowdProcess/crp-stream-client)
