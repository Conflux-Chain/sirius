import React from 'react';
import { Link } from 'app/components/Link/Loadable';
import { formatAddress } from 'utils';
import { ContractDetail } from 'app/components/TxnComponents/ContractDetail';
import { AddressLabel } from 'app/components/TxnComponents/AddressLabel';

export const Address = ({ address, contract }) => {
  return (
    <>
      <Link href={`/address/${address}`}>{formatAddress(address)}</Link>
      <ContractDetail info={contract} />
      <AddressLabel address={formatAddress(address)} />
    </>
  );
};
