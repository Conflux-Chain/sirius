import React from 'react';
import { ExcutedTxns } from './ExcutedTxns';
import { PendingTxns } from './PendingTxns';
import qs from 'query-string';
import { useLocation } from 'react-router-dom';

interface Props {
  address: string;
}

export const ExcutedAndPendingTxns = ({ address = '' }: Props) => {
  const location = useLocation();
  const { transactionType } = qs.parse(location.search);

  if (transactionType === 'pending') {
    return <PendingTxns address={address}></PendingTxns>;
  } else {
    return <ExcutedTxns address={address}></ExcutedTxns>;
  }
};
