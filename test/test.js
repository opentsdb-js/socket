
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Event Emitter:
	EventEmitter = require( 'events' ).EventEmitter,

	// Utility module to create a mock OpenTSDB TCP server:
	createServer = require( './utils/tcp_server.js' ),

	// Module to be tested:
	createSocket = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'lib/socket', function tests() {
	'use strict';

	// SETUP //

	var SERVER,
		ADDRESS;

	before( function setup( done ) {
		SERVER = createServer();
		SERVER.on( 'listening', function onListen() {
			ADDRESS = SERVER.address();
			done();
		});
	});

	// TEARDOWN //

	after( function teardown() {
		SERVER.close();
	});


	// TESTS //

	it( 'should export a factory function', function test() {
		expect( createSocket ).to.be.a( 'function' );
	});

	it( 'should generate an event emitter', function test() {
		var socket = createSocket();

		assert.ok( socket instanceof EventEmitter );
	});

	describe( 'host', function tests() {

		it( 'should provide a method to set/get the OpenTSDB host', function test() {
			var socket = createSocket();
			expect( socket.host ).to.be.a( 'function' );
		});

		it( 'should not allow a non-string host', function test() {
			var socket = createSocket(),
				values = [
					5,
					[],
					{},
					true,
					null,
					undefined,
					NaN,
					function(){}
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( TypeError );
			}

			function badValue( value ) {
				return function() {
					socket.host( value );
				};
			}
		});

		it( 'should not allow an invalid host', function test() {
			var socket = createSocket(),
				values = [
					'badhost',
					'1000.10.10.100'
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( Error );
			}

			function badValue( value ) {
				return function() {
					socket.host( value );
				};
			}
		});

		it( 'should set the host', function test() {
			var socket = createSocket();
			socket.host( '192.168.1.172' );
			assert.strictEqual( socket.host(), '192.168.1.172' );
		});

	}); // end TESTS host

	describe( 'port', function tests() {

		it( 'should provide a method to set/get the OpenTSDB port', function test() {
			var socket = createSocket();
			expect( socket.port ).to.be.a( 'function' );
		});

		it( 'should not allow a non-numeric port', function test() {
			var socket = createSocket(),
				values = [
					'5',
					[],
					{},
					true,
					null,
					undefined,
					NaN,
					function(){}
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( TypeError );
			}

			function badValue( value ) {
				return function() {
					socket.port( value );
				};
			}
		});

		it( 'should set the port', function test() {
			var socket = createSocket();
			socket.port( 1337 );
			assert.strictEqual( socket.port(), 1337 );
		});

	}); // end TESTS port

	describe( 'connect', function tests() {

		it( 'should provide a method to create a socket connection', function test() {
			var socket = createSocket();
			expect( socket.connect ).to.be.a( 'function' );
		});

		it( 'should create a socket connection', function test( done ) {
			var socket = createSocket();

			// Configure the socket:
			socket.on( 'connect', function onConnect() {
				assert.ok( true );
				socket.end();
				done();
			});

			// Create a client socket connection:
			socket
				.host( ADDRESS.address )
				.port( ADDRESS.port )
				.connect();
		});

		it( 'should not override an existing connection (one connection per socket instance)', function test( done ) {
			var socket = createSocket();

			// Configure the socket:
			socket.on( 'connect', onConnect );
			socket.on( 'warn', onWarn );

			// Create a client socket connection:
			socket
				.host( ADDRESS.address )
				.port( ADDRESS.port )
				.connect();

			function onConnect() {
				socket.connect();
			}

			function onWarn( msg ) {
				assert.ok( true );
				socket.end();
				done();
			}
		});

	}); // end TESTS connect()

	describe( 'status', function tests() {

		it( 'should provide a method to determine the current connection status', function test() {
			var socket = createSocket();
			expect( socket.status ).to.be.a( 'function' );
		});

		it( 'should indicate when no socket connection exists', function test( done ) {
			var socket = createSocket();
			assert.notOk( socket.status() );

			socket
				.host( ADDRESS.address )
				.port( ADDRESS.port )
				.connect();

			socket.on( 'connect', function onConnect() {
				socket.end();
			});

			socket.on( 'close', function onClose() {
				assert.notOk( socket.status() );
				done();
			});
		});

		it( 'should indicate when a socket connection exists', function test( done ) {
			var socket = createSocket();
			
			socket
				.host( ADDRESS.address )
				.port( ADDRESS.port )
				.connect();

			socket.on( 'connect', function onConnect() {
				assert.ok( socket.status() );
				socket.end();
				done();
			});
		});

	});

	describe( 'strict', function tests() {

		it( 'should provide a method to set/get a type checking level when writing to the socket stream', function test() {
			var socket = createSocket();
			expect( socket.strict ).to.be.a( 'function' );
		});

		it( 'should not allow a non-boolean flag', function test() {
			var socket = createSocket(),
				values = [
					'5',
					[],
					{},
					5,
					null,
					undefined,
					NaN,
					function(){}
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( TypeError );
			}

			function badValue( value ) {
				return function() {
					socket.strict( value );
				};
			}
		});

		it( 'should set a type checking flag', function test() {
			var socket = createSocket();
			socket.strict( false );
			assert.strictEqual( socket.strict(), false );
		});

	});

	describe( 'write', function tests() {

		it( 'should provide a method to write to the socket stream', function test() {
			var socket = createSocket();
			expect( socket.write ).to.be.a( 'function' );
		});

		it( 'should throw an error if no connection has been established when in strict mode', function test() {
			var socket = createSocket();

			socket.strict( true );

			expect( foo ).to.throw( Error );

			function foo() {
				socket.write( 'beep' );
			}
		});

		it( 'should not allow a non-string to be written to the socket when in strict mode', function test( done ) {
			var socket = createSocket(),
				values = [
					5,
					[],
					{},
					true,
					null,
					undefined,
					NaN,
					function(){}
				];

			// Configure the socket:
			socket.on( 'connect', function onConnect() {
				for ( var i = 0; i < values.length; i++ ) {
					expect( badValues( values[i] ) ).to.throw( TypeError );
				}
				socket.end();
				done();
			});

			// Create a client socket connection:
			socket
				.host( ADDRESS.address )
				.port( ADDRESS.port )
				.strict( true )
				.connect();

			function badValues( value ) {
				return function() {
					socket.write( value, function(){} );
				};
			}
		});

		it( 'should ensure the callback is a function when in strict mode', function test( done ) {
			var socket = createSocket(),
				values = [
					5,
					[],
					{},
					true,
					null,
					undefined,
					NaN,
					'5'
				];

			// Configure the socket:
			socket.on( 'connect', function onConnect() {
				for ( var i = 0; i < values.length; i++ ) {
					expect( badValues( values[i] ) ).to.throw( TypeError );
				}
				socket.end();
				done();
			});

			// Create a client socket connection:
			socket
				.host( ADDRESS.address )
				.port( ADDRESS.port )
				.strict( true )
				.connect();

			function badValues( value ) {
				return function() {
					socket.write( 'beep', value );
				};
			}
		});

		it( 'should not enforce type checking when not in strict mode', function test( done ) {
			var socket = createSocket(),
				values = [
					5,
					[],
					{},
					true,
					null,
					undefined,
					NaN,
					function(){}
				];

			// Configure the socket:
			socket.on( 'connect', function onConnect() {
				for ( var i = 0; i < values.length; i++ ) {
					expect( badValues( values[i] ) ).to.not.throw( TypeError );
				}
				socket.end();
				done();
			});

			// Create a client socket connection:
			socket
				.host( ADDRESS.address )
				.port( ADDRESS.port )
				.strict( false )
				.connect();

			function badValues( value ) {
				return function() {
					try {
						socket.write( value );
					} catch ( error ) {
						// Expected behavior...
						return;
					}
					throw new Error();
				};
			}
		});

		it( 'should write to the socket stream', function test( done ) {
			var socket = createSocket(),
				expected;

			expected = 'put cpu.utilization ' + Date.now() + ' ' + Math.random() + ' beep=boop foo=bar\n';

			// Configure the server:
			SERVER.on( 'connection', onSocket );

			// Configure the socket:
			socket.on( 'connect', function onConnect() {
				socket.write( expected );
			});

			// Create a client socket connection:
			socket
				.host( ADDRESS.address )
				.port( ADDRESS.port )
				.strict( true )
				.connect();

			function onSocket( sSocket ) {
				sSocket.on( 'data', function onData( actual ) {
					assert.strictEqual( actual.toString(), expected );
					SERVER.removeListener( 'connection', onSocket );
					socket.end();
					done();
				});
			}
		});

		it( 'should invoke a callback when finished writing to the socket', function test( done ) {
			var socket = createSocket();

			// Configure the socket:
			socket.on( 'connect', function onConnect() {
				socket.write( 'beep', onFinish );
			});

			// Create a client socket connection:
			socket
				.host( ADDRESS.address )
				.port( ADDRESS.port )
				.strict( true )
				.connect();

			function onFinish() {
				assert.ok( true );
				socket.end();
				done();
			}
		});

	}); // end TESTS write()

	describe( 'end', function tests() {

		it( 'should provide a method to end a socket connection', function test() {
			var socket = createSocket();
			expect( socket.end ).to.be.a( 'function' );
		});

		it( 'should end a socket connection', function test( done ) {
			var socket = createSocket();

			// Configure the socket:
			socket.on( 'connect', function onConnect() {
				socket.end();
			});

			socket.on( 'close', function onClose( flg ) {
				if ( flg ) {
					assert.ok( false, 'Socket closed due to an error.' );
					done();
					return;
				}
				assert.ok( true );
				done();
			});

			// Create a client socket connection:
			socket
				.host( ADDRESS.address )
				.port( ADDRESS.port )
				.strict( true )
				.connect();
		});

	}); // end TESTS end()

});