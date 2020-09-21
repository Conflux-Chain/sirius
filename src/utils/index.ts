export const tranferToLowerCase = (str: string) => {
  return str ? str.toLowerCase() : '';
};
export const isCfxAddress = (address: string) => {
  return /^0x[0-9a-f]{40}$/.test(address);
};
