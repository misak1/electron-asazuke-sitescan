// try {
//     var Spooky = require('spooky');
// } catch (e) {
var Spooky = require('./lib/spooky');
// }

var x = Spooky.selectXPath;

var spooky = new Spooky({
    child: {
        transport: 'stdio'
    },
    casper: {
        logLevel: 'debug',
        verbose: true
    }
},
    function (err) {
        if (err) {
            e = new Error('Failed to initialize SpookyJS');
            e.details = err;
            throw e;
        }
        // spooky.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36 ');
        spooky.userAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12A365 Safari/600.1.4');

        spooky.start('http://tanshio.net');

        spooky.then(function () {
            var j = 0;
            this.capture('tanshio.png');

            for (var i = 0; i < 10; i++) {
                // emit("hello",i);
                this.wait(2000, function () {
                    var title = this.evaluate(function (j) {
                        return document.getElementsByClassName("entry-title")[j].textContent;
                    }, j);
                    j++;

                    emit("hello", title);
                });


            }
        });


        spooky.run(function () {
            this.exit();
        });
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
