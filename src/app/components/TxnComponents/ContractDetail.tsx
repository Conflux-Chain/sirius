import React from 'react';
import { ICON_DEFAULT_TOKEN } from 'utils/constants';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { formatAddress } from 'utils';
import { useAddressNameMap } from '@cfxjs/sirius-next-common/dist/utils/hooks/useAddressNameMap';
import { getAddressNameInfo } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/utils';

export const ContractDetail = ({ address }: { address: string }) => {
  const { data: nameMap } = useAddressNameMap([address]);
  const nameInfo = getAddressNameInfo(address, nameMap);
  if (nameInfo) {
    const {
      tokenName,
      tokenSymbol,
      tokenIconUrl,
      contractName,
      verificationName,
    } = nameInfo;
    let child: React.ReactNode = null;

    if (tokenName || tokenSymbol) {
      const name = tokenName || '--';
      const symbol = `(${tokenSymbol ? tokenSymbol : '--'})`;
      const icon = tokenIconUrl || ICON_DEFAULT_TOKEN;

      child = (
        <>
          <img
            src={icon}
            alt="icon"
            style={{
              width: '1.1429rem',
              marginRight: 2,
            }}
          />
          <Link href={`/token/${formatAddress(address)}`}>
            {name} {symbol}
          </Link>{' '}
        </>
      );
    } else if (contractName || verificationName) {
      const name = contractName || verificationName;
      const icon = tokenIconUrl || ICON_DEFAULT_TOKEN;

      child = (
        <>
          <img
            src={icon}
            alt="icon"
            style={{
              width: '1.1429rem',
              marginBottom: 3,
              marginRight: 2,
            }}
          />
          <Link href={`/address/${formatAddress(address)}`}>{name}</Link>{' '}
        </>
      );
    }

    return <> {child}</>;
  }
  return null;
};
