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

interface RouteParams {
  address: string;
}

export const AddressContractDetailPage = () => {
  const { address } = useParams<RouteParams>();
  const isValidAddr = /^0x[0-9a-fA-F]{40}$/.test(address);
  const isValidContractAddress =
    isValidAddr && /^0x8[0-9a-fA-F]{39}$/.test(address);

  const history = useHistory();

  useEffectOnce(() => {
    if (!isValidAddr) history.push('/');
  });

  return isValidContractAddress ? (
    <ContractDetailPage />
  ) : (
    <AddressDetailPage />
  );
};
