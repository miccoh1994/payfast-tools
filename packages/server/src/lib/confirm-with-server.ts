import type { ISignatureInput } from '@miccoh/payfast-core';
import axios from 'axios';
import { getParameterString } from '@miccoh/payfast-core';

export async function confirmWithServer(
  host: string,
  data: ISignatureInput,
  passphrase?: string
) {
  const parameterStringWithSig = getParameterString(data, passphrase);

  const { data: result } = await axios.post(
    `https://${host}/eng/query/validate`,
    parameterStringWithSig
  );
  if (result === 'VALID') {
    return true;
  }
  console.warn(
    `[payfast]: failed to validate with server, host: ${host} \n error: ${result}`
  );
  return false;
}
