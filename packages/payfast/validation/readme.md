# Payfast Server Side Validation

## Usage

```typescript

import { validatePayment } from '@knix/payfast-validation';

app.post('/ipn', async (req, res) => {
  const valid = await validatePayment({
    xForwardedForHeader: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    payload: req.body
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