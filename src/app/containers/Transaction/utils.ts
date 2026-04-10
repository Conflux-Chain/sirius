import { renderAddress } from 'utils/tableColumns/token';

export interface ContractNameItem {
  contract: {
    name?: string;
  };
  token: {
    name?: string;
    symbol?: string;
    decimals?: number;
    tokenType?: string;
    iconUrl?: string;
  };
  verification: {
    name?: string;
  };
}

export const getItemByKey = (
  key: 'contract' | 'token' | 'verification',
  nameMap: Record<string, ContractNameItem> | undefined,
  value: string,
) => {
  const item = nameMap?.[value]?.[key];
  return item
    ? {
        ...item,
        address: value,
      }
    : null;
};

export const renderAddressWithNameMap = (
  nameMap?: Record<string, ContractNameItem>,
): typeof renderAddress => (...args) => {
  const [value, row, type, withArrow] = args;
  const contractInfo = getItemByKey('contract', nameMap, value);
  const tokenInfo = getItemByKey('token', nameMap, value);
  const verification = getItemByKey('verification', nameMap, value);
  // TODO: temp solution for new and old contract/token info structure in api, need to unify in the future
  const additionalInfo =
    type === 'from'
      ? {
          fromContractInfo: contractInfo,
          fromTokenInfo: tokenInfo,
          fromVerification: verification,
        }
      : {
          toContractInfo: contractInfo,
          toTokenInfo: tokenInfo,
          toVerification: verification,
        };
  return renderAddress(
    value,
    {
      ...row,
      ...additionalInfo,
    },
    type,
    withArrow,
  );
};
