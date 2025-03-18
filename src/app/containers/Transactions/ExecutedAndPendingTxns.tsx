import React from 'react';
import { ExecutedTxns } from './ExecutedTxns';
import { PendingTxns } from './PendingTxns';
import qs from 'query-string';
import { useLocation } from 'react-router-dom';

interface Props {
  address: string;
}

export const ExecutedAndPendingTxns = ({ address = '' }: Props) => {
  const location = useLocation();
  const { transactionType } = qs.parse(location.search);

  if (transactionType === 'pending') {
    return <PendingTxns address={address}></PendingTxns>;
  } else {
    return <ExecutedTxns address={address}></ExecutedTxns>;
  }
};
