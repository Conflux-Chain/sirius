import React from 'react';
import { Link } from 'sirius-next/packages/common/dist/components/Link';
import { formatAddress } from 'utils';
import { ContractDetail } from 'app/components/TxnComponents/ContractDetail';

export const Address = ({ address, contract }) => {
  return (
    <>
      <Link href={`/address/${address}`}>{formatAddress(address)}</Link>
      <ContractDetail info={contract} />
    </>
  );
};
