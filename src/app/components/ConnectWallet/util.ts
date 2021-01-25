export const formatAddress = (
  addr,
  frontCount: number = 6,
  endCount: number = 4,
) => {
  if (!addr) return '';
  return `${addr.substr(0, frontCount)}...${addr.substr(
    0 - endCount,
    endCount,
  )}`;
};
