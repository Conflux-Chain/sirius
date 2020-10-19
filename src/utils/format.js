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
