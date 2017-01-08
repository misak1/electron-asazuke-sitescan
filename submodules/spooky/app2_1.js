try {
    var Spooky = require('spooky');
} catch (e) {
    var Spooky = require('./lib/spooky');
}


var spooky = new Spooky({
        child: {
            transport: 'http'
        },
        casper: {
            logLevel: 'debug',
            verbose: true
        }
    },
    function (err) {
      // for(var ii=0; ii<5; ii++){
        if (err) {
            e = new Error('Failed to initialize SpookyJS');
            e.details = err;
            throw e;
        }
        var ii = 0;
        spooky.userAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12A365 Safari/600.1.4');
        spooky.start('http://tanshio.net');
        spooky.then([{
          ii: ii
        }, function () {
          this.wait(2000, function() {
            var j = 0;
            emit('elog', 'tanshio'+ 1 + '.png');
            this.capture('tanshio'+ 1 + '.png');
          });
        }]);

        spooky.then([{
          ii: ii
        }, function () {
          var j = 0;
          this.wait(4000, function() {
            emit('elog', 'tanshio'+ 2 + '.png');
            this.capture('tanshio'+ 2 + '.png');
          });
        }]);
        spooky.run(function(){
            this.exit();
        });
    // }
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

spooky.on('elog', function (greeting) {
    console.log(greeting);
});

spooky.on('log', function (log) {
    if (log.space === 'remote') {
        console.log(log.message.replace(/ \- .*/, ''));
    }
});
