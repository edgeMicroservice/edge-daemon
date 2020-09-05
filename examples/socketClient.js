var net = require('net'),
    fs = require('fs'),
    // connections = {},
    // server, 
    client, mode
    ;

// prevent duplicate exit messages
var SHUTDOWN = false;

// Our socket
const SOCKETFILE = '/tmp/unix.sock';

// For simplicity of demonstration, both ends in this one file
mode = 'client'

console.info('Loading interprocess communications test: client');
console.info('  Mode: %s \n  Socket: %s \n  Process: %s',mode,SOCKETFILE,process.pid);


if(mode === "client"){
    // Connect to server.
    console.log("Connecting to server.");
    client = net.createConnection(SOCKETFILE)
        .on('connect', ()=>{
            console.log("Connected.");
        })
        // Messages are buffers. use toString
        .on('data', function(data) {
            data = data.toString();

            if(data === '__boop'){
                console.info('Server sent boop. Confirming our snoot is booped.');
                client.write('__snootbooped');
                return;
            }
            if(data === '__disconnect'){
                console.log('Server disconnected.')
                return cleanup();
            }

            // Generic message handler
            console.info('Server:', data)
        })
        .on('error', function(data) {
            console.error('Server not active.'); process.exit(1);
        })
        ;

    // Handle input from stdin.
    var inputbuffer = "";
    process.stdin.on("data", function (data) {
        inputbuffer += data;
        if (inputbuffer.indexOf("\n") !== -1) {
            var line = inputbuffer.substring(0, inputbuffer.indexOf("\n"));
            inputbuffer = inputbuffer.substring(inputbuffer.indexOf("\n") + 1);
            // Let the client escape
            if(line === 'exit'){ return cleanup(); }
            if(line === 'quit'){ return cleanup(); }
            client.write(line);
        }
    });

    function cleanup(){
        if(!SHUTDOWN){ SHUTDOWN = true;
            console.log('\n',"Terminating.",'\n');
            client.end();
            process.exit(0);
        }
    }
    process.on('SIGINT', cleanup);
}