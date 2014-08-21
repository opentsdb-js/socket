/**
*
*	DEMO
*
*
*	DESCRIPTION:
*		- Demonstrates use of an OpenTSDB socket client to write data to OpenTSDB.
*
*
*	NOTES:
*		[1] This code will need to be tailored to the particular OpenTSDB you want to demo against. For instance, the host name may need to be changed to a value matching the relevant OpenTSDB endpoint.
*
*
*	TODO:
*		[1] 
*
*
*	HISTORY:
*		- 2014/08/20: Created. [AReines].
*
*
*	DEPENDENCIES:
*		[1] 
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. athan@nodeprime.com. 2014.
*
*/

(function() {
	'use strict';

	// MODULES //

	var // OpenTSDB socket client factory:
		createSocket = require( './../lib' );


	// SCRIPT //

	var socket = createSocket();

	socket
		.host( '192.168.92.111' )
		.port( 4243 )
		.strict( false );

	socket.on( 'error', onError );
	socket.on( 'close', onClose );
	socket.on( 'connect', onConnect );

	connect();

	return;

	// LISTENERS //

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

	// FUNCTIONS //

	function connect() {
		socket.connect();
	}

	function write( idx ) {
		setTimeout( onTimeout, 1000*idx );
		return;

		function onTimeout() {
			if ( socket.status() ) {
				socket.write( newLine(), onWrite );
			}
		}
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

})();