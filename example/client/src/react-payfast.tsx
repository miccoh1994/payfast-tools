
import type { PayfastCreatePaymentRequest, PayfastCreatePaymentResponse } from '@knix/payfast';
import { ReactPayfast } from '@knix/payfast-react';
import { useQuery } from '@tanstack/react-query';

const EXAMPLE_OPTIONS = ({
  return_url: window.location.origin + '/success',
  cancel_url: window.location.origin + '/success',
  name_first: 'Test',
  name_last: 'Test',
  email_address: 'test@test.com',
  amount: 100,
  item_name: 'cookies',
  item_description: 'a bag of cookies',
});

function useFetchPayfastInputs(request: PayfastCreatePaymentRequest) {
  return useQuery({
    queryKey: ['payfastOptions', request],
    queryFn: async () => {
      const response = await fetch('/api/payments/payfast/inputs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occurred');
      }
      const data = await response.json();
      return data.inputs as PayfastCreatePaymentResponse;
    }
  });
}

export function ReactPayfastExample() {

  const { data, error, isError, isFetching } = useFetchPayfastInputs(EXAMPLE_OPTIONS);

  return (
    <>
      <h1>Checkout</h1>
      {isError && <h2>{error.message}</h2>}
      <ReactPayfast payfast={data} sandbox>
        <button disabled={isFetching || isError} type="submit">{isFetching ? 'Loading...' : 'Pay Now'}</button>
      </ReactPayfast>
    </>
  );
}