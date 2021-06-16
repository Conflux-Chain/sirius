import React from 'react';
import { defaultTokenIcon } from '../../../constants';
import ContractIcon from '../../../images/contract-icon.png';
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
              marginRight: 2,
            }}
          />
          <Link href={`/token/${formatAddress(token.address)}`}>
            {name} {symbol}
          </Link>{' '}
        </>
      );
    } else if (contract && contract.name) {
      const name = contract['name'];
      const icon = ContractIcon;

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
