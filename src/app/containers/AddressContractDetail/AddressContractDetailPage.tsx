/* -*- mode: typescript -*- */
/**
 * @fileOverview
 * @name AddressContractDetailPage.tsx
 * @author yqrashawn <namy.19@gmail.com>
 */

import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import { AddressDetailPage, ContractDetailPage } from './Loadable';
import { isAddress, isContractAddress } from '../../../utils';
interface RouteParams {
  address: string;
}

export const AddressContractDetailPage = () => {
  const { address } = useParams<RouteParams>();
  const history = useHistory();

  useEffectOnce(() => {
    if (!isAddress(address)) history.push('/404');
  });

  return isContractAddress(address) ? (
    <ContractDetailPage />
  ) : (
    <AddressDetailPage />
  );
};
