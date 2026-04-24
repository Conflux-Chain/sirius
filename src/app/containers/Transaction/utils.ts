import { renderAddress } from 'utils/tableColumns/token';

export interface AddressNameMap {
  contract?: {
    name?: string;
  };
  token?: {
    name?: string;
    symbol?: string;
    decimals?: number;
    iconUrl?: string;
    website?: string;
    tokenType?: string;
  };
  verification?: {
    name?: string;
  };
  eSpace?: {
    address?: string;
  };
  ens?: {
    name?: string;
  };
  nameTag?: {
    nameTag?: string;
    website?: string;
    desc?: string;
    labels?: string[];
    caution?: string;
  };
  implementation?: {
    name?: string;
    address?: string;
    proxyPattern?: string;
  };
}

export const getItemByKey = <T extends keyof AddressNameMap>(
  key: T,
  nameMap: Record<string, AddressNameMap> | undefined,
  value: string,
): (AddressNameMap[T] & { address: string }) | null => {
  const item = nameMap?.[value]?.[key];
  return item
    ? {
        ...item,
        address: value,
      }
    : null;
};

export const renderAddressWithNameMap = (
  nameMap?: Record<string, AddressNameMap>,
): typeof renderAddress => (...args) => {
  const [value, row, type, withArrow] = args;
  const contractInfo = getItemByKey('contract', nameMap, value);
  const tokenInfo = getItemByKey('token', nameMap, value);
  const verification = getItemByKey('verification', nameMap, value);
  const ens = getItemByKey('ens', nameMap, value);
  // TODO: temp solution for new and old contract/token info structure in api, need to unify in the future
  const additionalInfo =
    type === 'from'
      ? {
          fromContractInfo: contractInfo,
          fromTokenInfo: tokenInfo,
          fromVerification: verification,
          fromENSInfo: ens,
        }
      : {
          toContractInfo: contractInfo,
          toTokenInfo: tokenInfo,
          toVerification: verification,
          toENSInfo: ens,
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
