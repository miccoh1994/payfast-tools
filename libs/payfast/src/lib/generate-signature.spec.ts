import { ISignatureInput } from '@za-payments/react-payfast';
import { generateSignature } from './generate-signature';
const payload = {
  m_payment_id: 'CbfulVs30aHEVF64HWwyQ',
  pf_payment_id: '1337059',
  payment_status: 'COMPLETE',
  item_name: 'cookies',
  item_description: 'a bag of cookies',
  amount_gross: '100.00',
  amount_fee: '-2.30',
  amount_net: '97.70',
  custom_str1: '',
  custom_str2: '',
  custom_str3: '',
  custom_str4: '',
  custom_str5: '',
  custom_int1: '',
  custom_int2: '',
  custom_int3: '',
  custom_int4: '',
  custom_int5: '',
  name_first: 'Test',
  name_last: 'Test',
  email_address: 'test@test.com',
  merchant_id: '10000100',
  signature: '091dc05a0cfa54583d2086670d5b21a8',
};
describe('payfast', () => {
  it('should work', () => {
    expect(generateSignature(payload as unknown as ISignatureInput)).toEqual(
      '091dc05a0cfa54583d2086670d5b21a8'
    );
  });
});
