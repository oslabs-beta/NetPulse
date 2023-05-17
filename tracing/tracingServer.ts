const express = require('express');
const { Request: ExpressRequest, Response: ExpressResponse } = require('express');
const iostart = require('socket.io');

const otelController = require('./otelController');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const iostart = require('socket.io');
// const otelController = require('./otelController'); // import middleware

// start custom express server on port 4000
const server = app
  .listen(4000, () => {
    console.log(`Custom trace listening server on port 4000`);
  })
  .on('error', () => {
    process.once('SIGUSR2', () => {
      process.kill(process.pid, 'SIGUSR2');
    });
    process.on('SIGINT', () => {
      // this is only called on ctrl+c, not restart
      process.kill(process.pid, 'SIGINT');
    });
  });

// create socket running on top of express server + enable cors

const io = iostart(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

// custom express server running on port 4000 to send data to front end dashboard
app.use(
  '/',
  otelController.parseTrace,
  (req: typeof ExpressRequest, res: typeof ExpressResponse) => {
    if (res.locals.clientData.length > 0) io.emit('message', JSON.stringify(res.locals.clientData));
    res.sendStatus(200);
  }
);
