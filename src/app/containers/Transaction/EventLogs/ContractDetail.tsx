import React from 'react';
import { defaultContractIcon, defaultTokenIcon } from '../../../../constants';

export const ContractDetail = ({ info }) => {
  if (info) {
    const { contract, token } = info;
    let contractBody: React.ReactNode = null;
    let tokenBody: React.ReactNode = null;

    if (contract && contract.name) {
      contractBody = (
        <>
          <img
            src={(contract && contract['icon']) || defaultContractIcon}
            alt="icon"
            style={{
              width: '1.1429rem',
            }}
          />{' '}
          {contract && contract['name']}
        </>
      );
    }

    if (token && token.name) {
      tokenBody = (
        <>
          <span>; </span>
          <img
            src={(token && token['icon']) || defaultTokenIcon}
            alt="icon"
            style={{
              width: '1.1429rem',
            }}
          />{' '}
          {token && token['name']}
        </>
      );
    }

    return (
      <>
        {' '}
        ({contractBody}
        {tokenBody})
      </>
    );
  }
  return null;
};
