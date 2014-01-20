var Stream = require('stream');
var JobClient = require('crp-job-client');
var StreamClient = require('crp-stream-client');
var Duplex = Stream.Duplex;
if (!Duplex) {
  Duplex = require('readable-stream').Duplex;
}
var util = require('util');
util.inherits(SimpleProtocol, Readable);