# React Payfast Integration

## Usage

```tsx

const options = {
  merchant: {
    merchant_id: '10000100',
    merchant_key: '46f0cd694581a',
    return_url: window.location.origin + '/success',
    cancel_url: window.location.origin + '/cancelled',
    notify_url: 'https://yournotificationurl.com',
  },
  customer: {
    name_first: 'Test',
    name_last: 'Test',
    email_address: 'test@test.com',
  },
  transaction: {
    m_payment_id: 'sonme_unique_id',
    amount: 100,
    item_name: 'cookies',
    item_description: 'a bag of cookies',
  },
}

      <ReactPayfast {...payfastOptions} sandbox> //toggle the payfast sandbox with the sandbox prop
        <button type="submit">Pay Now</button> // make sure to include the submit button for the form. You can style this yourself.
      </ReactPayfast>

```