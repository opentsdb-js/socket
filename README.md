Socket
======
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

> [OpenTSDB](http://opentsdb.net) socket client.

OpenTSDB provides three methods of [writing data](http://opentsdb.net/docs/build/html/user_guide/writing.html#input-methods): telnet, HTTP, and batch import. This library implements a telnet interface for writing data.

A few words on the other methods:

*	Batch import is a command-line interface which is useful for data migrations. 
* 	The [HTTP](http://opentsdb.net/docs/build/html/api_http/put.html) interface provides the convenience of REST but has performance limitations.



### Install

For use in Node.js,

``` bash
$ npm install opentsdb-socket
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).



### Client

To interface with OpenTSDB, one must first create a socket client. To do so,

``` javascript
var createSocket = require( 'opentsdb-socket' );

var socket = createSocket();
```

OpenTSDB socket clients are configurable and have the following methods...


#### socket.host( [host] )

This method is a setter/getter. If no `host` is provided, the method returns the configured `host`. By default, the client `host` is `127.0.0.1`. To point to a remote `host`,

``` javascript
socket.host( '192.168.92.11' );
```

#### socket.port( [port] )

This method is a setter/getter. If no `port` is provided, the method returns the configured `port`. By default, the client port is `4242`. To set a different `port`,

``` javascript
socket.port( 8080 );
```




---
## Notes

When used as setters, all setter/getter methods are chainable. For example,

``` javascript
var createSocket = require( 'opentsdb-socket' ),
	socket = createSocket();

socket
	.host( '192.168.92.111' )
	.port( 8080 );
```


---
## Tests

### Unit

Unit tests use the [Mocha](http://visionmedia.github.io/mocha) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ open reports/coverage/lcov-report/index.html
```


---
## License

[MIT license](http://opensource.org/licenses/MIT). 


---
## Copyright

Copyright &copy; 2014. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/opentsdb-socket.svg
[npm-url]: https://npmjs.org/package/opentsdb-socket

[travis-image]: http://img.shields.io/travis/opentsdb-js/opentsdb-socket/master.svg
[travis-url]: https://travis-ci.org/opentsdb-js/opentsdb-socket

[coveralls-image]: https://img.shields.io/coveralls/opentsdb-js/opentsdb-socket/master.svg
[coveralls-url]: https://coveralls.io/r/opentsdb-js/opentsdb-socket?branch=master

[dependencies-image]: http://img.shields.io/david/opentsdb-js/opentsdb-socket.svg
[dependencies-url]: https://david-dm.org/opentsdb-js/opentsdb-socket

[dev-dependencies-image]: http://img.shields.io/david/dev/opentsdb-js/opentsdb-socket.svg
[dev-dependencies-url]: https://david-dm.org/dev/opentsdb-js/opentsdb-socket

[github-issues-image]: http://img.shields.io/github/issues/opentsdb-js/opentsdb-socket.svg
[github-issues-url]: https://github.com/opentsdb-js/opentsdb-socket/issues