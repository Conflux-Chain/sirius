import React from 'react';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { formatAddress } from 'utils';
import { ContractDetail } from '@cfxjs/sirius-next-common/dist/components/InputData/ContractDetail';
import { StyledHighlight } from './StyledComponents';

export const Address = ({ address }) => {
  return (
    <>
      <StyledHighlight scope="address" value={address}>
        <Link href={`/address/${address}`}>{formatAddress(address)}</Link>
      </StyledHighlight>
      <ContractDetail address={address} addressType="base32" />
    </>
  );
};
