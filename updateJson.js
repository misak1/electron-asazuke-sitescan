// json like -> json
var fs = require('fs');
var parseJson = require('./submodules/parse-json/index.js');
var confs = ['userAgent.json', 'viewport.json'];

for (var i in confs) {
  var ua = new parseJson(confs[i]);
  fs.writeFileSync('_' + confs[i], ua.read().toString(), "UTF-8");
}


var jsonUserAgent = require('./_userAgent.json');
console.log(jsonUserAgent);
var jsonViewport = require('./_viewport.json');
console.log(jsonViewport);