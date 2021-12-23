export function verifyAmount(
  mAmount: number | string,
  pfAmountGross: number | string
) {
  const validAmount =
    Math.abs(parseFloat(String(mAmount)) - parseFloat(String(pfAmountGross))) <=
    0.01;
  if (validAmount === true) {
    return validAmount;
  }
  console.warn('[payfast]: failed to verify amount');
  return validAmount;
}
