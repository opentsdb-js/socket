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

#### socket.connect()

Creates a TCP socket connection.

``` javascript
socket.connect();
```

#### socket.status()

Returns the current connection status. If a socket connection exists, returns `true`. If no socket connection exists, returns `false`. 

``` javascript
socket.status();
```


#### socket.strict( [bool] )

This method is a setter/getter. If no boolean `flag` is provided, the method returns the strict setting. By default, the socket enforces strict type checking on socket writes. To turn off strict mode,

``` javascript
socket.strict( false );
```

Turn off strict mode when you are certain that arguments provided to the `socket.write()` method are of the proper type.


#### socket.write( string[, clbk] )

Writes to the socket connection. If strict mode is `off`, no type checking of input arguments occurs. An optional callback is invoked after writing all data to the socket. To write to the socket,

``` javascript
var value = '';

value += 'put ';
value += 'cpu.utilization ';
value += Date.now() + ' ';
value += Math.random() + ' ';
value += 'beep=boop ';
value += 'foo=bar\n';

socket.write( value, function ack() {
	console.log( '...data written...' );
});
```

#### socket.end()

Closes a socket connection. To close a socket,

``` javascript
socket.end();
```


### Events

The socket is an event-emitter and emits the following events...

#### 'connect'

The socket emits a `connect` event upon successfully establishing a socket connection. To register a listener,

``` javascript
socket.addListener( 'connect', function onConnect() {
	console.log( '...connected...' );
});
```

#### 'error'

The socket emits an `error` event upon encountering an error. To register a listener,

``` javascript
socket.addListener( 'error', function onError( error ) {
	console.error( error.message );
	console.error( error.stack );
});
```

#### 'close'

The socket emits a `close` event when the other end of the connection closes the socket. To register a listener,

``` javascript
socket.addListener( 'close', function onClose() {
	console.log( '...socket closed...' );
	console.log( '...attempting to reconnect in 5 seconds...' );
	setTimeout( function reconnect() {
		socket.connect();
	}, 5000 );
});
```

#### 'warn'

The socket emits a `warn` event when attempting to create a new socket connection when a connection already exists. To register a listener,

``` javascript
socket.addListener( 'warn', function onWarn( message ) {
	console.warn( message );
});
```



## Notes

When used as setters, all setter/getter methods are chainable. For example,

``` javascript
var createSocket = require( 'opentsdb-socket' ),
	socket = createSocket();

socket
	.host( '192.168.92.111' )
	.port( 8080 )
	.strict( false )
	.connect();
```


## Examples

``` javascript
var createSocket = require( 'opentsdb-socket' ),
	socket = createSocket();

socket
	.host( '192.168.92.111' )
	.port( 4243 )
	.strict( false );

socket.on( 'error', onError );
socket.on( 'close', onClose );
socket.on( 'connect', onConnect );

connect();

function connect() {
	socket.connect();
}

function onError( error ) {
	console.error( error.message );
	console.error( error.stack );
}

function onClose() {
	console.log( '...attempting to reconnect in 2 seconds...' );
	setTimeout( function reconnect() {
		connect();
	}, 2000 );
}

function onConnect() {
	for ( var i = 0; i < 100; i++ ) {
		write( i );
	}
}

function write( idx ) {
	setTimeout( function onTimeout() {
		if ( socket.status() ) {
			socket.write( newLine(), onWrite );
		}
	}, 1000*idx );
}

function newLine() {
	var metric = 'cpu.utilization',
		timestamp = Date.now(),
		value = Math.random(),
		line = '';

	line += 'put ';
	line += metric + ' ';
	line += timestamp + ' ';
	line += value + ' ';
	line += 'beep=boop ';
	line += 'foo=bar';
	line += '\n';

	return line;
}

function onWrite() {
	console.log( '...data written to socket...' );
}
```



## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org/) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

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
$ make view-cov
```



## License

[MIT license](http://opensource.org/licenses/MIT). 


---
## Copyright

Copyright &copy; 2014. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/opentsdb-socket.svg
[npm-url]: https://npmjs.org/package/opentsdb-socket

[travis-image]: http://img.shields.io/travis/opentsdb-js/socket/master.svg
[travis-url]: https://travis-ci.org/opentsdb-js/socket

[coveralls-image]: https://img.shields.io/coveralls/opentsdb-js/socket/master.svg
[coveralls-url]: https://coveralls.io/r/opentsdb-js/socket?branch=master

[dependencies-image]: http://img.shields.io/david/opentsdb-js/socket.svg
[dependencies-url]: https://david-dm.org/opentsdb-js/socket

[dev-dependencies-image]: http://img.shields.io/david/dev/opentsdb-js/socket.svg
[dev-dependencies-url]: https://david-dm.org/dev/opentsdb-js/socket

[github-issues-image]: http://img.shields.io/github/issues/opentsdb-js/socket.svg
[github-issues-url]: https://github.com/opentsdb-js/socket/issues
