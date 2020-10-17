export const tranferToLowerCase = (str: string) => {
  return str ? str.toLowerCase() : '';
};
export const isCfxAddress = (address: string) => {
  return /^0x[0-9a-f]{40}$/.test(address);
};
export const getEllipsisAddress = (
  address: string,
  frontNum: number,
  endNum: number,
) => {
  if (isCfxAddress(address)) {
    const length = address.length;
    return (
      address.substring(0, frontNum) +
      '...' +
      address.substring(length - endNum, length)
    );
  }
  return '';
};
