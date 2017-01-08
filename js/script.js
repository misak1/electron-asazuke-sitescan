// progress
var storage = require('electron-json-storage');
var appConf = {};
var mConsole = require('m-console');
mConsole.init();

var $console = $('.m-console');
var buffer_size = 1000;
$console.append('<div></div>'.repeat(buffer_size));
// /* Console test */
// var c = 0;
// function demo() {
// 	console.log("aaa");
// 	if(c > 50) c = 0;
// 	mConsole.appendMsg("#".repeat(c));
// 	setTimeout(demo, 100);
// 	c++;
// }
// demo();

/* progress */
var progressbar = $("#progressbar"),
	progressLabel = $(".progress-label");
progressbar.progressbar({
	value: 0,
	change: function () {
		// progressLabel.text(progressbar.progressbar("value") + "%");
		progressLabel.text($('.hide-progress-text').text());
	},
	complete: function () {
		progressLabel.text("Complete!");
	}
});
progressbarValue = progressbar.find(".ui-progressbar-value");
progressbarValue.css({
	//"background": '#' + Math.floor(Math.random() * 16777215).toString(16)
	"background": '#58c8b5'
});
function progress(p, txt) {
	// var val = progressbar.progressbar("value") || 0;
	$('.hide-progress-text').text(txt);
	progressbar.progressbar("value", p);
	progressbarValue = progressbar.find(".ui-progressbar-value");
}

// Modal
$(function () {
	var $body = $('body');
	var fs = require('fs');

	var isDir = function (filepath) {
		return fs.existsSync(filepath) && fs.statSync(filepath).isDirectory();
	};

	var setting = {};
	var validation = function () {
		var valid = true;

		// OUTPUT_DIR
		console.log($('input[name="output_dir"]').val());
		var pattern = new RegExp(".+");
		var filepath = $('input[name="output_dir"]').val()
		if (pattern.test($('input[name="output_dir"]').val())) {
			if (isDir(filepath)) {
				console.log(filepath + ' is directory.');
				$('input[name="output_dir"]').parents('tr').removeClass('is-error');
				setting['output_dir'] = $('input[name="output_dir"]').val();
			} else {
				console.log(filepath + ' is not directory.');
				$('input[name="output_dir"]').parents('tr').addClass('is-error');
				valid = false;
			}
		} else {
			$('input[name="output_dir"]').parents('tr').addClass('is-error');
			valid = false;
		}

		// URL
		console.log($('input[name="url"]').val());
		var pattern = new RegExp("https?://[a-zA-Z_0-9/:%#\$&\?\(\)~\.=\+\-]+");
		if (pattern.test($('input[name="url"]').val())) {
			$('input[name="url"]').parents('tr').removeClass('is-error');
			setting['url'] = $('input[name="url"]').val();
		} else {
			$('input[name="url"]').parents('tr').addClass('is-error');
			valid = false;
		}

		// HTTP AUTH
		setting['userid'] = $('input[name="userid"]').val();
		setting['passwd'] = $('input[name="passwd"]').val();

		// Browser Setting
		setting['useragent'] = $('select[name="useragent"]').val();
		setting['viewport'] = $('select[name="viewport"]').val();

		console.log('setting', setting);
		console.log('valid', valid);
		return valid;
	}

	var loadCB = function (data) {
		// console.log(data);
		$('input[name="output_dir"]').val(data.output_dir);
		$('input[name="url"]').val(data.url);
		$('input[name="userid"]').val(data.userid);
		$('input[name="passwd"]').val(data.passwd);
		$('select[name="useragent"]').val(data.useragent);
		$('select[name="viewport"]').val(data.viewport);
	}

	var load = function (cb) {
		storage.get('config', function (error, data) {
			cb(data);
		});
	}

	var save = function (setting) {
		updateConf(setting);
		appConf = setting;
		getConf();

		storage.set('config', setting, function (error) {
			if (error) throw error;
		});
	}

	load(loadCB);

	$('.btn-execute').on('click', function (e) {
		e.stopPropagation();
		if ($('body').hasClass('is-running')) {
			$body.addClass('show-modal');
		} else {
			if (validation()) {
				save(setting);
				$body.addClass('show-modal');
				$(this).text('モーダルを開く');

				loop();
				$('body').addClass('is-running');
			}
		}
	});
	$('.c-modal').on('click', function (e) {
		e.stopPropagation();
	});
	$('.c-modal-wrapper').on('click', function (e) {
		e.stopPropagation();
		$body.removeClass('show-modal');
	});
	$('.c-modal .icon-cross').on('click', function (e) {
		e.stopPropagation();
		$body.removeClass('show-modal');
	});
});


var parseJson = require('./submodules/parse-json/index.js');

// UserAgent
var jsonUserAgent = {};
storage.get('userAgent', function (error, data) {
	if (error) throw error;
	jsonUserAgent = data;
	if (Object.keys(data).length === 0) {
		// データがないときの処理
		jsonUserAgent = require('./_userAgent.json');
	}
	storage.set('userAgent', jsonUserAgent, function (error) {
		if (error) throw error;
	});
	var $selectEl = $('select[name="useragent"]');
	for (var i in jsonUserAgent) {
		var $group = $('<optgroup>');
		$group.attr('label', i);
		$grop_data = jsonUserAgent[i];
		for (var i in $grop_data) {
			$group.append($('<option label="' + i + '" value="' + $grop_data[i] + '">' + i + '</option>'));
		}
		$selectEl.append($group);
	}
});
// viewport
var jsonViewport = {};
storage.get('viewport', function (error, data) {
	if (error) throw error;
	jsonViewport = data;
	if (Object.keys(data).length === 0) {
		// データがないときの処理
		jsonViewport = require('./_viewport.json');
	}
	storage.set('viewport', jsonViewport, function (error) {
		if (error) throw error;
	});
	var $selectEl = $('select[name="viewport"]');
	for (var i in jsonViewport) {
		var $group = $('<optgroup>');
		$group.attr('label', i);
		$grop_data = jsonViewport[i];
		for (var i in $grop_data) {
			$group.append($('<option label="' + i + '" value="' + $grop_data[i] + '">' + i + '</option>'));
		}
		$selectEl.append($group);
	}
});