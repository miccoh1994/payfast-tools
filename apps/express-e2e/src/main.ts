/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import { validatePayment } from '@za-payments/payfast';
const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.post('/ipn', async (req, res) => {
  //dEtD7a0gZnm1jVYVG-aKj
  // res.write('HTTP/1.0 200 OK');
  console.log(req.headers);
  console.log(req.body);
  const valid = await validatePayment(req, {
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
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
