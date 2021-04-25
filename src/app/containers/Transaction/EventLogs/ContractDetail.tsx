import React from 'react';
import { defaultContractIcon } from '../../../../constants';

export const ContractDetail = ({ info }) => {
  if (info && info['name']) {
    return (
      <>
        {' '}
        ({info && info['name']}{' '}
        <img
          src={(info && info['icon']) || defaultContractIcon}
          alt="icon"
          style={{
            width: '1.1429rem',
          }}
        />
        )
      </>
    );
  }
  return null;
};
