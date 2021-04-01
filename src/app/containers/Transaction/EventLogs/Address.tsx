import React from 'react';
import { Link } from '../../../components/Link/Loadable';
import { formatAddress } from 'utils/cfx';

export const Address = ({ address }) => {
  return <Link href={`/contract/${address}`}>{formatAddress(address)}</Link>;
};
