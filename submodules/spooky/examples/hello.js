try {
    var Spooky = require('spooky');
} catch (e) {
    var Spooky = require('../lib/spooky');
}
var _ = require('underscore');
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
            verbose: true
        }
    }, function (err) {
        if (err) {
            e = new Error('Failed to initialize SpookyJS');
            e.details = err;
            throw e;
        }

        spooky.start(
            'http://en.wikipedia.org/wiki/Spooky_the_Tuff_Little_Ghost');
        spooky.then(
          function () {
            this.viewport(1920, 1080);
            // this.viewport(values.viewport.width, values.viewport.height);
            // this.emit('hello', 'Hello, from ' + this.evaluate(function () {
            //     return document.title;
            // }));
            this.capture('test.png');
        });
        spooky.thenOpen('http://en.wikipedia.org/wiki/Spooky_the_Tuff_Little_Ghost', function() {
          this.wait(5000);
          this.evaluate(function() {
            if(document.body.style.backgroundColor===''){
            // 透過背景になるのを防止
            document.body.style.backgroundColor="#fff"
            }
          });
        });
        spooky.run();
    });

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

spooky.on('hello', function (greeting) {
    console.log(greeting);
});

spooky.on('log', function (log) {
    if (log.space === 'remote') {
        console.log(log.message.replace(/ \- .*/, ''));
    }
});
