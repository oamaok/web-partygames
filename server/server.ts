import http from 'http';
import Koa from 'koa';
import koaJson from 'koa-json';
import koaBodyparser from 'koa-bodyparser';
import SocketIO from 'socket.io';

const app = new Koa();
const server = http.createServer(app.callback());

const io = SocketIO(server, {
  path: '/api/ws',
  pingInterval: 2000,
  pingTimeout: 1000,
});


server.on('close', () => {
  Object.keys(io.sockets.connected).forEach((key) => {
    io.sockets.connected[key].disconnect();
  });
});

io.on('connection', (socket) => {
  setInterval(() => { socket.emit('message', Math.random()); }, 1000);
});

Object.assign(app, { io });

app.use(koaBodyparser());
app.use(koaJson());

if (require.main === module) {
  server.listen(process.env.API_PORT);
}

export default server;
