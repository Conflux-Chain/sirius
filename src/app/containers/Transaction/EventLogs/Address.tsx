import React from 'react';
import { Link } from 'app/components/Link/Loadable';
import { formatAddress } from 'utils/cfx';
import { ContractDetail } from 'app/components/TxnComponents/ContractDetail';

export const Address = ({ address, contract }) => {
  return (
    <>
      <Link href={`/contract/${address}`}>{formatAddress(address)}</Link>
      <ContractDetail info={contract} />
    </>
  );
};
