function array_diff(a1, a2) {
  var a = [], diff = [];
  for (var i = 0; i < a1.length; i++) {
    a[a1[i]] = true;
  }
  for (var i = 0; i < a2.length; i++) {
    if (a[a2[i]]) {
      delete a[a2[i]];
    } else {
      a[a2[i]] = true;
    }
  }
  for (var k in a) {
    diff.push(k);
  }
  return diff;
};

var a2 =  ["http://pickles2.pxt.jp/", "http://pickles2.pxt.jp/overview/about/", "http://pickles2.pxt.jp/manual/", "http://pickles2.pxt.jp/tools/", "http://pickles2.pxt.jp/usergroups/", "http://pickles2.pxt.jp/tools/px2dt/", "http://pickles2.pxt.jp/developers/"];
var a1 = ["http://pickles2.pxt.jp/", "http://pickles2.pxt.jp/manual/system_structure/", "http://pickles2.pxt.jp/manual/setup/", "http://pickles2.pxt.jp/manual/configs/", "http://pickles2.pxt.jp/manual/sitemap/", "http://pickles2.pxt.jp/manual/theme/", "http://pickles2.pxt.jp/manual/contents/", "http://pickles2.pxt.jp/manual/publish/", "http://pickles2.pxt.jp/manual/cmd_options/", "http://pickles2.pxt.jp/manual/plugins/", "http://pickles2.pxt.jp/manual/pxcommands/", "http://pickles2.pxt.jp/manual/guieditor/", "http://pickles2.pxt.jp/manual/update/", "http://pickles2.pxt.jp/phpdoc/px-fw-2.x/", "http://pickles2.pxt.jp/phpdoc/px2-multitheme/", "http://pickles2.pxt.jp/manual/cmd_clearcache/", "http://pickles2.pxt.jp/manual/cmd_api/", "http://pickles2.pxt.jp/manual/guieditor/setting_pickles2/", "http://pickles2.pxt.jp/manual/guieditor/designing_modules/", "http://pickles2.pxt.jp/manual/guieditor/designing_modules_with_tplengines/", "http://pickles2.pxt.jp/manual/guieditor/fields/", "http://pickles2.pxt.jp/manual/guieditor/select_gui_engine/", "http://pickles2.pxt.jp/tools/asazuke/"];

console