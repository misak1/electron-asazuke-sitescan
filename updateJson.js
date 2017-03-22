// json like -> json
var fs = require('fs');
var parseJson = require('./submodules/parse-json/index.js');
var confs = ['userAgent.json', 'viewport.json'];

for (var idx in confs) {
  var ua = new parseJson('data/'+confs[idx]);
  fs.writeFileSync('data_dist/'+confs[idx], ua.read().toString(), "UTF-8");
}


var jsonUserAgent = require('./data_dist/userAgent.json');
console.log(jsonUserAgent);
var jsonViewport = require('./data_dist/viewport.json');
console.log(jsonViewport);
