/* eslint-disable camelcase */

import type { ReactPayfastProps } from '../lib';
import { ReactPayfast } from '../lib';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
const buildOptions = (m_payment_id: string, notify_url: string) => ({
  merchant: {
    merchant_id: '10000100',
    merchant_key: '46f0cd694581a',
    return_url: window.location.origin + '/success',
    cancel_url: window.location.origin + '/success',
    notify_url,
  },
  customer: {
    name_first: 'Test',
    name_last: 'Test',
    email_address: 'test@test.com',
  },
  transaction: {
    m_payment_id,
    amount: 100,
    item_name: 'cookies',
    item_description: 'a bag of cookies',
  },
});
export function ReactPayfastExample() {
  const [payfastOptions, setPayfastOptions] =
    useState<ReactPayfastProps | null>(null);

  function getNgrokUrl() {
    axios.get('/api/tunnels').then(({ data }) => {
      const url = data + '/ipn';
      setPayfastOptions(buildOptions(nanoid(), url));
    });
  }
  useEffect(() => {
    getNgrokUrl();
  }, []);
  if (payfastOptions === null) {
    return <div>loading...</div>;
  }
  return (
    <>
      <h1>yest this is a test</h1>
      <ReactPayfast {...payfastOptions} sandbox>
        <button type="submit">Pay Now</button>
      </ReactPayfast>
    </>
  );
}