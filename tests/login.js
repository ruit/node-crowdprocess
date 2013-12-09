var fs = require('fs');
var login = require('../src/auth');
var path = require('path');
var test = require('tap').test;

test('Test login', function(t){

  login( function (err){
    if (err) throw (err);
    t.end();

  });

});