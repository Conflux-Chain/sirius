import React from 'react';
import { ICON_DEFAULT_TOKEN } from 'utils/constants';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { formatAddress } from 'utils';

interface Props {
  info: {
    contract: any;
    token: any;
  };
}

export const ContractDetail = ({ info }) => {
  if (info) {
    const { contract, token } = info;
    let child: React.ReactNode = null;

    if (token && (token.name || token.symbol)) {
      const name = token['name'] || '--';
      let symbol = token['symbol'];
      symbol = `(${symbol ? symbol : '--'})`;
      const icon = token['iconUrl'] || ICON_DEFAULT_TOKEN;

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
      const icon = (token && token['iconUrl']) || ICON_DEFAULT_TOKEN;

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
          <Link href={`/address/${formatAddress(contract.address)}`}>
            {name}
          </Link>{' '}
        </>
      );
    }

    return <> {child}</>;
  }
  return null;
};

ContractDetail.defaultProps = {
  showTokenInfo: true,
  showContractInfo: false,
};
