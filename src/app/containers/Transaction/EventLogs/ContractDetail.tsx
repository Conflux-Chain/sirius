import React from 'react';
import { defaultContractIcon, defaultTokenIcon } from '../../../../constants';
import { Link } from 'app/components/Link';
import { formatAddress } from 'utils/cfx';

export const ContractDetail = ({ info }) => {
  if (info) {
    const { contract, token } = info;
    let child: React.ReactNode = null;

    if (token && (token.name || token.symbol)) {
      const name = token['name'] || '--';
      let symbol = token['symbol'];
      symbol = `(${symbol ? symbol : '--'})`;
      const icon = token['icon'] || defaultTokenIcon;

      child = (
        <>
          <img
            src={icon}
            alt="icon"
            style={{
              width: '1.1429rem',
            }}
          />{' '}
          <Link href={`/token/${formatAddress(token.address)}`}>
            {name} {symbol}
          </Link>{' '}
        </>
      );
    } else if (contract && contract.name) {
      const name = contract['name'];
      const icon = contract['icon'] || defaultContractIcon;

      child = (
        <>
          <img
            src={icon}
            alt="icon"
            style={{
              width: '1.1429rem',
            }}
          />{' '}
          <Link href={`/contract/${formatAddress(contract.address)}`}>
            {name}
          </Link>{' '}
        </>
      );
    }

    return <> {child}</>;
  }
  return null;
};
