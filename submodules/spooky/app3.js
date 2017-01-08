try {
    var Spooky = require('spooky');
} catch (e) {
    var Spooky = require('./lib/spooky');
}
var _ = require('underscore');
var _async = require('async');
var _html = (function () {/*
  <style>
    .tblDocInfo,.tblDocInfo th,.tblDocInfo td{
     border-collapse: collapse;
     border:1px solid #333;
    }
    .tblDocInfo th{
     background-color: #d9d9d9;
    }
  </style>
  <table border="1" class="tblDocInfo">
    <thead>
      <tr>
        <th>フェーズ</th>
        <th>システム名</th>
        <th>サブシステム名</th>
        <th>ドキュメントID</th>
        <th>ドキュメント名</th>
        <th colspan="2">作成日／更新日</th>
        <th colspan="2">作成者／更新者</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="2"><%= phase %></td>
        <td rowspan="2"><%= system %></td>
        <td rowspan="2"><%= subSystem %></td>
        <td rowspan="2"><%= documentID %></td>
        <td rowspan="2"><%= documentName %></td>
        <td>[作]</td>
        <td><%= createDate %></td>
        <td>[作]</td>
        <td><%= createUser %></td>
      </tr>
      <tr>
        <td>[更]</td>
        <td><%= alterDate %></td>
        <td>[更]</td>
        <td><%= alterUser %></td>
      </tr>
    </tbody>
  </table>
*/}).toString().replace(/(\n)/g, '').split('*')[1];
var headerTmpl = _.template(_html);

var fs = require("fs");

var cwd = process.cwd();
var infoJson = fs.readFileSync(cwd + "/conf/docInfo.json");
var info = JSON.parse(infoJson.toString());
var htmlHeader = headerTmpl(info[0]);
// console.log(htmlHeader);

var json = fs.readFileSync(cwd + "/conf/captureSettings.json");
var settings = JSON.parse(json.toString());

var screenshotUrl = 'http://google.com/';
var screenshotNow = new Date();
var screenshotDateTime = screenshotNow.getFullYear() + pad(screenshotNow.getMonth() + 1) + pad(screenshotNow.getDate()) + '-' + pad(screenshotNow.getHours()) + pad(screenshotNow.getMinutes()) + pad(screenshotNow.getSeconds());

var spooky = new Spooky({
    child: {
        transport: 'http'
    },
    casper: {
        logLevel: 'debug',
        verbose: false,
        pageSettings: {
          // userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12A365 Safari/600.1.4'
        }
    }
  }, function (err) {
    if (err) {
        e = new Error('Failed to initialize SpookyJS');
        e.details = err;
        throw e;
    }
    settings.forEach(function(values, key) {
      console.log(values.userAgent);
      // spooky.userAgent(values.userAgent);
      spooky.start(screenshotUrl);

      spooky.then([{
        k: key,
        t: screenshotDateTime,
        n: values.name,
        w: values.viewport.width,
        h: values.viewport.height
        ,u: values.userAgent
      }, function () {
        // this.wait(5000);
        this.evaluate(function() {
          if(document.body.style.backgroundColor===''){
          // 透過背景になるのを防止
          document.body.style.backgroundColor="#fff"
          }
        });

        emit('elog', 'k:' + k +' w:'+ w + " h:"+ h + " u:" + u);
        // this.userAgent(u);
        this.viewport(w, h);
        this.echo('Screenshot for ' + n + ' (' + w + 'x' + h + ')', 'info');
        this.capture('screenshots/' + t + '/' + n + '-' + w + 'x' + h + '.png');
        //     // this.page.paperSize = { format: 'A3', orientation: 'portrait', border: '1cm'} ;
        //     // this.capture('screenshots/' + screenshotDateTime + '/' + values.name + '-' + values.viewport.width + 'x' + values.viewport.height + '.pdf');
      }]);
      spooky.run(function(){
        this.exit();
      });
    });
  }
);

spooky.on('error', function (e, stack) {
    console.error(e);

    if (stack) {
        console.log(stack);
    }
});

/*
// Uncomment this block to see all of the things Casper has to say.
// There are a lot.
// He has opinions.
spooky.on('console', function (line) {
    console.log(line);
});
*/


spooky.on('log', function (log) {
    if (log.space === 'remote') {
        console.log(log.message.replace(/ \- .*/, ''));
    }
});

// emitで呼び出す
spooky.on('elog', function (msg) {
  console.log(msg);
});


function pad(number) {
  var r = String(number);
  if ( r.length === 1 ) {
    r = '0' + r;
  }
  return r;
}
