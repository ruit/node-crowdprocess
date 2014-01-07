var data = [
  "The power of connected browsers compels you",
  "dude...latency between the browsers! And some optimizations we still need to do lol",
  "They've totally surprised us with the awesome stuff they've done so far!",
  "10000 dataunits, 1800/2000 browsers. 133.8 times faster than the local machine.",
  " It is a browser based supercomputing platform. We have many browsers"
];

function Run(data){
  //split by comma, period, single space
  words = data.split(/[ ,.]+/);

  var count = 0;
  for (var i = 0; i < words.length; i++) {
    if (words[i].toLowerCase() === 'browsers') count++;
  };

  var output = {};
  output.count = count;
  output.sentence = data;
  return output;
}


var CrowdProcess = require('..');

var crp = new CrowdProcess('email@example.com', 'password');

crp.map(Run, data, function(err, result) {
  console.log(result);
});
