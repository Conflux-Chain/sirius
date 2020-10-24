import React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { media } from '../../../styles/media';
import { translations } from '../../../locales/i18n';
import {
  TabsTablePanel,
  TabLabel,
} from '../../components/TabsTablePanel/Loadable';
import { Filter } from './Filter';
import { tokenColunms } from '../../../utils/tableColumns';

interface TransferProps {
  tokenAddress: string;
  symbol: string;
  decimals: number;
}

export function Transfers({ tokenAddress, symbol, decimals }: TransferProps) {
  const { t } = useTranslation();

  const columnsWidth = [3, 4, 4, 4, 3];
  const columns = [
    tokenColunms.txnHash,
    tokenColunms.age,
    tokenColunms.from,
    tokenColunms.to,
    tokenColunms.quantity,
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  const tabs = [
    {
      value: 'transfers',
      label: (count: number) => {
        return (
          <LabelWrap>
            {t(translations.token.transfers)}
            <TabLabel count={count} />
          </LabelWrap>
        );
      },
      url: `/transfer?address=${tokenAddress}`,
      table: {
        columns: columns,
        rowKey: 'transactionHash',
      },
    },
  ];

  return (
    <TransfersWrap>
      <TabsTablePanel tabs={tabs} />
      <Filter decimals={decimals} symbol={symbol} tokenAddress={tokenAddress} />
    </TransfersWrap>
  );
}

const TransfersWrap = styled.div`
  position: relative;
  ${media.s} {
    padding-top: 4rem;
  }
`;

const LabelWrap = styled.div`
  display: flex;
  color: #1a1a1a;
  font-weight: 700;
  font-size: 1.1429rem;
`;
