var LINK_LEVEL = -1; // -1見つかるものがある限り
var TARGET_URL = 'http://pickles2.pxt.jp/';
var list = {}; // 処理済みリスト

var parse = require('url-parse');
var url = "";
var host = "";

var verboseLog = "";
var progressfile = "";
var logTmpLinks = "";
var siteMapCSV = "";
var cavData = [
    "* path"
    , "* content"
    , "* id"
    , "* title"
    , "* title_breadcrumb"
    , "* title_h1"
    , "* title_label"
    , "* title_full"
    , "* logical_path"
    , "* list_flg"
    , "* layout"
    , "* orderby"
    , "* keywords"
    , "* description"
    , "* category_top_flg"
    , "* **delete_flg"
    , "* og:title"
    , "* og:description"
    , "* og:image"
    , "* og:type"
    , "* og:site_name"
    , "* og:url"
    , "* og:locale"
    , "* fb:app_id"
    , "* apple-touch-icon"
    , "* favicon"
    , "* viewport"
];
var tmpLinks = [];
tmpLinks.push(TARGET_URL);
var cap_i = 0;
// var Spooky = require('./submodules/spooky/lib/spooky.js');
var Spooky = require('spooky');
var CSV = require("comma-separated-values");

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
    // custom property
    appConf.verboseLog = host + '.txt';
    appConf.progressfile = host + '-progress.txt';
    appConf.logTmpLinks = host + '-tmpLink.txt';
    appConf.siteMapCSV = host + '-sitemap.csv';

    // CSV head CSVの引数は2次元配列である必要がある。
    fs.appendFileSync(appConf.output_dir + '/' + appConf.siteMapCSV, new CSV([cavData]).encode() + "\n");
    return appConf;
}
var casperExit = function () {
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

        /**
         * 画面キャプチャのあり/なし
         */
        if (appConf.captureing) {
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
        } else {
            ceSpooky.then(function (csinfo) {
                // CASPERJS CONTEXT
                // capture
                var parse = require('url-parse');
                var url = parse(csinfo.url, true);
                // url.sep(/) -> $
                // var encpath = encodeURIComponent(url.pathname).replace(/%2f/ig, '$');
                // var filename = encpath + '.png';
                // this.capture(filename);
                // this.emit('cecapture', filename);

                this.emit('ceinfo', csinfo);

                // get absolute href
                var arylink = this.evaluate(function () {
                    var links = document.querySelectorAll('a');
                    return Array.prototype.map.call(links, function (e) {
                        return e.href;
                    });
                });
                this.emit('celink', arylink);

                var hashSiteMap = this.evaluate(function () {
                    var hashSiteMap = {};
                    hashSiteMap['* content'] = "";
                    hashSiteMap['* id'] = "";
                    hashSiteMap['* title'] = "";
                    hashSiteMap['* title_breadcrumb'] = "";
                    hashSiteMap['* title_h1'] = "";
                    hashSiteMap['* title_label'] = "";
                    hashSiteMap['* title_full'] = "";
                    hashSiteMap['* logical_path'] = "";
                    hashSiteMap['* list_flg'] = 1;
                    hashSiteMap['* layout'] = "";
                    hashSiteMap['* orderby'] = "";
                    hashSiteMap['* keywords'] = "";
                    hashSiteMap['* description'] = "";
                    hashSiteMap['* category_top_flg'] = "";
                    hashSiteMap['* **delete_flg'] = "";
                    hashSiteMap['* og:title'] = "";
                    hashSiteMap['* og:description'] = "";
                    hashSiteMap['* og:image'] = "";
                    hashSiteMap['* og:type'] = "";
                    hashSiteMap['* og:site_name'] = "";
                    hashSiteMap['* og:url'] = "";
                    hashSiteMap['* og:locale'] = "";
                    hashSiteMap['* fb:app_id'] = "";
                    hashSiteMap['* apple-touch-icon'] = "";
                    hashSiteMap['* favicon'] = "";
                    hashSiteMap['* viewport'] = "";

                    var a,b,c,d,e,f,g,h,i,j,k,l,m,n,o;
                    if (a = document.querySelectorAll('title')[0]) { hashSiteMap['* title'] = a.innerText; };
                    if (b = document.querySelectorAll('h1')[0]) { hashSiteMap['* title_h1'] = b.innerText; };
                    if (c = document.querySelectorAll('meta[name="keywords"]')[0]) { hashSiteMap['* keywords'] = c.getAttribute('content') };
                    if (d = document.querySelectorAll('meta[name="description"]')[0]) { hashSiteMap['* description'] = d.getAttribute('content') };
                    if (e = document.querySelectorAll('meta[property="og:title"]')[0]) { hashSiteMap['* og:title'] = e.getAttribute('content') };
                    if (f = document.querySelectorAll('meta[property="og:description"]')[0]) { hashSiteMap['* og:description'] = f.getAttribute('content') };
                    if (g = document.querySelectorAll('meta[property="og:image"]')[0]) { hashSiteMap['* og:image'] = g.getAttribute('content') };
                    if (h = document.querySelectorAll('meta[property="og:type"]')[0]) { hashSiteMap['* og:type'] = h.getAttribute('content') };
                    if (i = document.querySelectorAll('meta[property="og:site_name"]')[0]) { hashSiteMap['* og:site_name'] = i.getAttribute('content') };
                    if (j = document.querySelectorAll('meta[property="og:url"]')[0]) { hashSiteMap['* og:url'] = j.getAttribute('content') };
                    if (k = document.querySelectorAll('meta[property="og:locale"]')[0]) { hashSiteMap['* og:locale'] = k.getAttribute('content') };
                    if (l = document.querySelectorAll('meta[property="fb:app_id"]')[0]) { hashSiteMap['* fb:app_id'] = l.getAttribute('content') };
                    if (m = document.querySelectorAll('link[rel="apple-touch-icon"]')[0]) { hashSiteMap['* apple-touch-icon'] = m.getAttribute('href') };
                    if (n = document.querySelectorAll('link[rel="shortcut icon"]')[0]) { hashSiteMap['* favicon'] = n.getAttribute('href') };
                    if (o = document.querySelectorAll('meta[name="viewport"]')[0]) { hashSiteMap['* viewport'] = o.getAttribute('content') };
                    console.log(hashSiteMap);
                    return hashSiteMap;
                });
                hashSiteMap['* path'] = csinfo.url;
                this.emit('sitemap', hashSiteMap);
                /* /Sitemap */
            });
        }

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
        if (p > 1) {
            progress((c / p * 100), c + ' / ' + p);
        } else {
            progress(1, c + ' / ' + p);
        }
        var url = csinfo.url;
        // mConsole.appendMsg('<a href="'+url+'" target="_blank">'+url+'</a>');
        mConsole.appendMsg('<a href="javascript:require(\'electron\').shell.openExternal(\'' + url + '\');">' + url + '</a>');

        if (appConf.verbose_log) {
            fs.appendFileSync(appConf.output_dir + '/' + appConf.verboseLog, "\n" + "[" + csinfo.url + "]");
            fs.appendFileSync(appConf.output_dir + '/' + appConf.verboseLog, tmpLinks.join("\n") + "\n");
        }
        fs.writeFileSync(appConf.output_dir + '/' + appConf.logTmpLinks, tmpLinks.join("\n") + "\n");
        fs.appendFileSync(appConf.output_dir + '/' + appConf.progressfile, csinfo.url + "\n");

        // this.destroy();
    });
    ceSpooky.on('sitemap', function (hashSiteMap) {
        var _data = [];
        cavData.forEach(function (key) {
            _data.push(hashSiteMap[key]);
        }, this);
        // CSVの引数は2次元配列である必要がある。
        var _csv = new CSV([_data]).encode();
        fs.appendFileSync(appConf.output_dir + '/' + appConf.siteMapCSV, _csv + "\n");
        // this.destroy();
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
        this.destroy();
        loop(url);
    });
};

