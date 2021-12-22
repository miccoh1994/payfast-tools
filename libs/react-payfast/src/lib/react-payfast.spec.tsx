import { render, screen } from '@testing-library/react';

import ReactPayfast from './react-payfast';

const options = {
  merchant: {
    merchant_id: '10000100',
    merchant_key: '46f0cd694581a',
    return_url: 'www.google.com',
    cancel_url: 'www.google.com',
    notify_url: 'www.google.com',
  },
  customer: {
    name_first: 'Me',
    name_last: 'you',
    email_address: 'mummy@mymmmy.com',
  },
  transaction: {
    m_payment_id: '001',
    amount: 100,
    item_name: 'cookies',
    item_description: 'yo',
  },
};
describe('ReactPayfast', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReactPayfast {...options} sandbox />);
    expect(baseElement).toBeTruthy();
  });

  it('should render a number of input elements', () => {
    const { baseElement } = render(<ReactPayfast {...options} />);

    expect(baseElement.children.length).toBeGreaterThan(0);
  });

  it('should have inputs with the correct values', () => {
    render(<ReactPayfast {...options} />);
    const input = screen.getByTestId('merchant_id');
    expect((input as HTMLInputElement).value).toEqual(
      options.merchant.merchant_id
    );
  });
});
