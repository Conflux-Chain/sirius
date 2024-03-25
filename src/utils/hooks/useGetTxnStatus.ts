import React from 'react';
import { CFX } from 'utils/constants';
import {
  getTransactionLoop as getTransactionLoopOriginal,
  useGetTxnStatus as useGetTxnStatusOriginal,
} from 'sirius-next/packages/common/dist/utils/hooks/useGetTxnStatus';

interface TxnLoopOptsType {
  callback?: (data?) => void;
  timeout?: number;
  method?: string;
}

export const getTransactionLoop = (hash: string, outOptions: TxnLoopOptsType) =>
  getTransactionLoopOriginal(CFX, hash, outOptions);

export const useGetTxnStatus = (
  txnHashs: Array<string>,
  timeout?: number,
  method?,
) => useGetTxnStatusOriginal(React, CFX, txnHashs, timeout, method);
