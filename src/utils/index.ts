export const tranferToLowerCase = (str: string) => {
  return str ? str.toLowerCase() : '';
};
export const isCfxAddress = (address: string) => {
  return /^0x[0-9a-f]{40}$/.test(address);
};
export const getEllipsStr = (str: string, frontNum: number, endNum: number) => {
  if (str) {
    const length = str.length;
    return (
      str.substring(0, frontNum) +
      '...' +
      str.substring(length - endNum, length)
    );
  }
  return '';
};
