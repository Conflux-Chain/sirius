import React from 'react';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { formatAddress } from 'utils';
import { ContractDetail } from 'app/components/TxnComponents/ContractDetail';
import { StyledHighlight } from './StyledComponents';

export const Address = ({ address, contract }) => {
  return (
    <>
      <StyledHighlight scope="address" value={address}>
        <Link href={`/address/${address}`}>{formatAddress(address)}</Link>
      </StyledHighlight>
      <ContractDetail info={contract} />
    </>
  );
};
