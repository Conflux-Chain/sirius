/* -*- mode: typescript -*- */
/**
 * @fileOverview
 * @name AddressContractDetailPage.tsx
 * @author yqrashawn <namy.19@gmail.com>
 */

import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import { AddressDetailPage } from './Loadable';
import { isCurrentNetworkAddress } from '../../../utils';
interface RouteParams {
  address: string;
}

export const AddressContractDetailPage = () => {
  const { address } = useParams<RouteParams>();
  const history = useHistory();

  useEffectOnce(() => {
    if (!isCurrentNetworkAddress(address)) history.push('/404');
  });

  // return 1 > 2 ? <AddressDetailPage /> : <ContractDetailPage />;
  return <AddressDetailPage />;
};
