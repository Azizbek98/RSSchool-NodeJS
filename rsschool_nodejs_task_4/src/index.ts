import { httpServer } from './http_server/http_server';
import { createWebSocketStream, WebSocketServer } from 'ws';
import nodemon from 'nodemon';
import parseCommand from './lib/parseCommand';
import { truncateString } from './lib/utils';
import dotenv from 'dotenv';
dotenv.config();

const HTTP_PORT = process.env.PORT || 8181;
const WEBSOCKET_PORT = Number(process.env.WEB_SOCKET_PORT) || 8080;
console.log(`Start HTTP Server on the ${HTTP_PORT} port! (http://localhost:${HTTP_PORT})`);

httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: WEBSOCKET_PORT });
console.log(`Start WebSocket Server on the ${WEBSOCKET_PORT} port! (http://localhost:${WEBSOCKET_PORT})`);

wss.on('connection', (ws) => {
    console.log(`Clients connected: ${wss.clients.size}`);

    const duplex = createWebSocketStream(ws, {
        encoding: 'utf-8',
        decodeStrings: false,
        readableObjectMode: true,
        writableObjectMode: true,
    });

    duplex.on('data', (chunk) => {
        const command = chunk.toString();
        console.log(`<- ${command}`);

        parseCommand(command)
            .then((answer) => {
                if (typeof answer !== 'string') {
                    duplex.write(command);
                    return;
                }
                duplex.write(answer);
                const formatAnswer = truncateString(answer);
                console.log(`-> ${formatAnswer}`);
            })
            .catch((error) => console.error(error));
    });

    ws.on('close', function () {
        console.log('Client disconnected');
    });
});

wss.on('close', () => {
    wss.clients.forEach((socket) => {
        socket.close();

        process.nextTick(() => {
            if (socket.readyState === socket.OPEN || socket.readyState === socket.CLOSING) {
                socket.terminate();
            }
        });
    });
});

process.on('SIGINT', () => {
    nodemon.emit('quit');
    process.exit(0);
});

process.on('exit', (code) => {
    nodemon.emit('quit');
    process.exit(code);
});
