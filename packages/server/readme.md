# Payfast Server Side Validation

## Usage

```typescript

import { validatePayment } from '@miccoh/payfast-server';

app.post('/ipn', async (req, res) => {
  const valid = await validatePayment({
    xForwardedForHeader: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    payload: req.body,
    signature: req.body.signature
  }, {
    yourAmount: 100,
    sandbox: true, //toggle sandbox mode
  });
  if (valid) {
    res.status(200).send('success');
    return;
  }
  res.status(400).send({ message: 'failed' });
});

```