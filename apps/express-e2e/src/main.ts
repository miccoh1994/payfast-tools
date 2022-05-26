/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import {connect} from 'ngrok';
import { validatePayment } from '@miccoh/payfast-server';
import { config } from 'dotenv';
import { resolve } from 'path';
console.log(resolve('.env'))
config({
  path: resolve('.env')
})
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.post('/ipn', async (req, res) => {
  const valid = await validatePayment({
    xForwardedForHeader: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    payload: req.body,
    signature: req.body.signature
  }, {
    yourAmount: 100,
    sandbox: true,
  });
  if (valid) {
    res.status(200).send('success');
    return;
  }
  res.status(400).send({ message: 'failed' });
});


const port = process.env.port || 3333;

async function start() {
  const url = await connect({ addr: Number(port), authtoken: process.env.NGROK_AUTH_TOKEN, host_header: 'rewrite' });
  const server = app.listen(port, () => {
    app.get('/tunnels', (req, res) => {
      res.send(url);
    })
    
    console.log(`Listening at http://localhost:${port}`);
    console.log(`Ngrok tunnel opened at ${url}`)
    return;

  });
  server.on('error', console.error);
}

start();
