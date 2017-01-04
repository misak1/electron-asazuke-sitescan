json風なテキスト読み込み

```
var parseJson = require('./submodules/parse-json/index.js');
var pj = new parseJson('config.json');
console.log(pj.getStatus());
console.log(pj.read());
```