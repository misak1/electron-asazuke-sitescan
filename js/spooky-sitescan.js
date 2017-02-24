var LINK_LEVEL = -1; // -1見つかるものがある限り
var TARGET_URL = 'http://pickles2.pxt.jp/';
var list = {}; // 処理済みリスト

var parse = require('url-parse');
var url = "";
var host = "";

var logfile = host + '.txt';
var progressfile = host + '-progress.txt';

var tmpLinks = [];
tmpLinks.push(TARGET_URL);
var cap_i = 0;
var Spooky = require('./submodules/spooky/lib/spooky.js');
// var Spooky = require('spooky');
console.log(Spooky);

var fs = require('fs');

var updateConf = function (setting) {
  TARGET_URL = setting.url;
  tmpLinks = [];
  tmpLinks.push(TARGET_URL);

  url = parse(TARGET_URL, true);
  host = url.host; // host = hostname + port
  mConsole.appendMsg('Spooky start ...');
  mConsole.appendMsg('START_URL -> ' + TARGET_URL);
  mConsole.appendMsg('----------------------------------------');
}
var getConf = function () {
  return appConf;
}
var casperExit = function () {;
}
var loop = function (url) {
  var url = url || TARGET_URL;
  if (list[url]) {
    // NEXT URL
    var arydiff = array_diff(Object.keys(list), tmpLinks);
    // tmpLinks = arydiff;
    url = arydiff.shift();
    loop(url);
    return true;
  } else {
    list[url] = true;
  }

  if (!url) {
    casperExit();
    return true;
  }


  var ceSpooky = new Spooky({
    child: {
      transport: 'stdio'
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

    var vp = appConf.viewport.split('x');
    ceSpooky.create({
      viewportSize: {
        width: vp[0],
        height: vp[1]
      },
      pageSettings: {
        userName: appConf.useragent,
        password: appConf.userid
      }
    });
    ceSpooky.userAgent(appConf.useragent);

    ceSpooky.start(url);
    // mConsole.appendMsg(ceSpooky);

    ceSpooky.then(function (csinfo) {
      // CASPERJS CONTEXT
      // capture
      var parse = require('url-parse');
      var url = parse(csinfo.url, true);
      // url.sep(/) -> $
      var encpath = encodeURIComponent(url.pathname).replace(/%2f/ig, '$');
      var filename = encpath + '.png';
      this.capture(filename);
      this.emit('cecapture', filename);
      this.emit('ceinfo', csinfo);

      // get absolute href
      var arylink = this.evaluate(function () {
        var links = document.querySelectorAll('a');
        return Array.prototype.map.call(links, function (e) {
          return e.href;
        });
      });
      this.emit('celink', arylink);
    });
    ceSpooky.run();
  });
  ceSpooky.on('error', function (e, stack) {
    mConsole.appendMsg("Error");
    mConsole.appendMsg(e);
    console.log(e);
    if (stack) {
      console.log(stack);
      mConsole.appendMsg(stack);
    }
  });

  ceSpooky.on('cecapture', function (filename) {
    cap_i++;
    var sec = ("0000" + (cap_i)).slice(-5);
    fs.renameSync(filename, appConf.output_dir + '/' + sec + filename);
  });
  ceSpooky.on('ceinfo', function (csinfo) {
    console.log("ceinfo", csinfo, csinfo.url);
    var c = Object.keys(list).length;
    var p = tmpLinks.length;
    if(p > 1){
      progress((c / p * 100), c + ' / ' + p);
    }else{
      progress(1, c + ' / ' + p);
    }
    var url = csinfo.url;
    // mConsole.appendMsg('<a href="'+url+'" target="_blank">'+url+'</a>');
    mConsole.appendMsg('<a href="javascript:require(\'electron\').shell.openExternal(\''+url+'\');">'+url+'</a>');

    fs.writeFileSync(appConf.output_dir + '/sitescan-log.txt', tmpLinks.join("\n") + "\n");
    fs.appendFileSync(appConf.output_dir + '/sitescan-progress.txt', csinfo.url + "\n");

    this.destroy();
  });
  ceSpooky.on('celink', function (hrefs) {
    // mConsole.appendMsg('[host filter]');
    var filterLinks = Array.prototype.map.call(hrefs, function (absoluteURL) {

      // Parse Errorの対応
      var absoluteURL = absoluteURL.replace(/#.*/, '').replace(/\?.*/, '');
      if (absoluteURL === 'http://' + host + '/#') {
        absoluteURL = 'http://' + host + '/';
      }
      try {
        var _url = parse(absoluteURL, true);
      } catch (e) {
        console.log(e);
      }
      var _host = _url.host;

      if (host === _host) {
        return absoluteURL;
      } else {
        return "";
      }
    });

    // mConsole.appendMsg('[extention filter]');
    filterLinks = Array.prototype.map.call(filterLinks, function (absoluteURL) {
      if (absoluteURL.match(/\.gif$|\.png$|\.jpg$|\.jpeg$|\.bmp|\.ico|\.icns$/gm)) {
        return "";
      } else if (absoluteURL.match(/\.flv$|\.swf$|\.mp4$|\.m4v$|\.m4p$|\.3gp$|\.3g2$|\.mov$|\.qt$|\.mpg$|\.mpeg$|\.mpeg2$|\.dat$|\.ts$|\.tp$|\.m2t$|\.m2p$|\.avi$|\.divx$|\.wmv$|\.asf$|\.rm$|\.rmvb$|\.mkv$|\.ogm$|\.ogg$/gm)) {
        return "";
      } else if (absoluteURL.match(/\.xml$|\.rtf$|\.rdf$|\.rss$|\.pdf$|\.xls$|\.xlsx$|\.doc$|\.docx$|\.ppt$|\.pptx$/gm)) {
        return "";
      } else if (absoluteURL.match(/\.zip$|\.lzh$|\.tar$|\.tgz$|\.gz$|\.rar$/gm)) {
        return "";
      } else {
        return absoluteURL.replace(/#.*/, '').replace(/\?.*/, '');
        // return absoluteURL;
      }
    });

    // mConsole.appendMsg('[array merge]');
    var mergeLinks = tmpLinks.concat(filterLinks);

    // mConsole.appendMsg('[uniq filter]');
    var uniqLinks = mergeLinks.filter(function (x, i, self) {
      return self.indexOf(x) === i;
    });

    // mConsole.appendMsg('[join]');
    tmpLinks = uniqLinks;

    // 空配列削除
    tmpLinks = tmpLinks.filter(function (e) { return e !== ""; });

    loop(url);
  });
};
// go
// loop();
