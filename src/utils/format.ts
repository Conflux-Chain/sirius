import BigNumber from 'bignumber.js';
const riskDivided = new BigNumber(2).pow(256).minus(1);
const eps = new BigNumber(1e-6);
/**
 * convert number to thousands-string
 * @param {*} num
 */
export const toThousands = num => {
  let str = num + '';
  let re = /(?=(?!(\b))(\d{3})+$)/g;
  str = str.replace(re, ',');
  return str;
};

export function transferRisk(riskStr) {
  const riskNum = new BigNumber(riskStr, 16).dividedBy(riskDivided);
  if (riskNum.isNaN()) {
    return '';
  }
  // if risk > 1e-4*(1+eps) =>
  if (riskNum.isGreaterThan(new BigNumber(1e-4).times(eps.plus(1)))) {
    return 'lv3';
  }
  // risk > 1e-6*(1+eps)
  if (riskNum.isGreaterThan(new BigNumber(1e-6).times(eps.plus(1)))) {
    return 'lv2';
  }
  // risk > 1e-8*(1+eps)
  if (riskNum.isGreaterThan(new BigNumber(1e-8).times(eps.plus(1)))) {
    return 'lv1';
  }

  return 'lv0';
}
export const devidedByDecimals = (number, decimals) => {
  const bignumber =
    number instanceof BigNumber ? number : new BigNumber(number);
  const result = bignumber.dividedBy(10 ** decimals);
  return result.toString(10);
};
