const net = require('net');
const fs = require('fs');

const socketRequester = require('./socketRequester');
const httpRequester = require('./httpRequester');
const { formatToJson } = require('./httpJson');

const connections = {};
let server;

var SHUTDOWN = false;

const SOCKETFILE = '/var/run/docker.sock';

console.info('Loading interprocess communications test');
console.info('  Socket: %s \n  Process: %s', SOCKETFILE, process.pid);

function createServer(socket) {
    console.log('Creating server.');
    var server = net.createServer(function (stream) {
        console.log('Connection acknowledged.');

        var self = Date.now();
        connections[self] = (stream);

        stream.on('end', function () {
            console.log('Client disconnected.');
            delete connections[self];
        });


        stream.on('data', function (msg) {
            msg = msg.toString();

            console.log('\n\n\n\n--- Request received on socket:\n');
            console.log(msg)
            console.log('---\n')

            const formattedRequest = formatToJson(msg);
            try {
                httpRequester.request(formattedRequest);
            } catch (error) {
                console.log('===> error occured while sending request to mdeploy: ', error)
            }

            const terminationResponse = () => {
                return `${formattedRequest.method} http:/${formattedRequest.endpoint} HTTP/1.1\r\nHOST: ${formattedRequest.host}\r\nConnection: close\r\n\r\n`
            }
            
            try {
                socketRequester.request(formattedRequest)
                .then((data) => {
                    console.log('in then: ', data)
                    // if (!data) {
                    //     console.log('===> terminating connection')
                    //     stream.write(terminationResponse())
                    //     stream.end()
                    // } else
                    
                    if (data === 'OK') {
                        console.log('===> sending OK')
                        stream.write('OK')
                        // console.log('===> terminating connection')
                        // stream.write(terminationResponse())
                        // stream.end()
                    } else if (data) {
                        console.log('===> sending data')
                        stream.write(`${data}\r\n`)
                        console.log('===> terminating connection')
                        // const termRes = terminationResponse()
                        // console.log('===> terminationResponse: ', termRes)
                        // stream.write(termRes)
                        // stream.end()
                    } else {
                        console.log('============= unknown response =============')
                    }
                    // if (data) {
                    //     console.log('===> 1');
                    //     stream.write(data)
                    // }
                    // else {
                    //     console.log('===> 2');
                    //     stream.write('HEAD /_ping HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n')
                    //     stream.end()
                        // stream.emit('close')
                        // console.log('3');
                        // stream.emit('end')
                        // stream.end()
                        // stream.off()
                        // console.log('4');
                        
                        // stream.destroy()
                        // console.log('5');
                        // stream.off()
                        // console.log('6');
                        // stream
                        // stream.emit('close')
                    // }
                })
                .catch((data) => {
                    console.log('in catch')
                    stream.write(data)
                });
            } catch (error) {
                console.log('===> error occured while sending request to docker: ', error)
            }
            

        });
    })
        .listen(socket)
        .on('connection', function (socket) {
            console.log('Client connected.');
            //console.log(Object.keys(socket));
        });

    return server;
}



console.log('Checking for leftover socket.');
fs.stat(SOCKETFILE, function (err, stats) {
    if (err) {
        // start server
        console.log('No leftover socket found.');
        server = createServer(SOCKETFILE);
        fs.chmodSync(SOCKETFILE, 0777);
        return;
    }
    // remove file then start server
    console.log('Removing leftover socket.')
    fs.unlink(SOCKETFILE, function (err) {
        if (err) {
            // This should never happen.
            console.error(err); process.exit(0);
        }
        server = createServer(SOCKETFILE); return;
    });
});


function cleanup() {
    if (!SHUTDOWN) {
        SHUTDOWN = true;
        console.log('\n', "Terminating.", '\n');
        if (Object.keys(connections).length) {
            let clients = Object.keys(connections);
            while (clients.length) {
                let client = clients.pop();
                connections[client].write('__disconnect');
                connections[client].end();
            }
        }
        server.close();
        process.exit(0);
    }
}
process.on('SIGINT', cleanup);

