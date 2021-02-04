import React from 'react';
import styled from 'styled-components/macro';
import { Card } from '../Card';
import { CardProps } from '@cfxjs/react-ui/dist/card/card';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';

export enum StatsType {
  topTxnCountSent = 'topTxnCountSent',
  topTxnCountReceived = 'topTxnCountReceived',
  topCFXSend = 'topCFXSend',
  topCFXReceived = 'topCFXReceived',
  topTokensBySenders = 'topTokensBySenders',
  topTokensByReceivers = 'topTokensByReceivers',
  topTokensByTxnCount = 'topTokensByTxnCount',
  topTokensByTxnAccountsCount = 'topTokensByTxnAccountsCount',
}

interface Props {
  span?: string;
  type?: StatsType;
}

export const StatsCard = ({
  span = '7d',
  type = StatsType.topTxnCountSent,
}: Partial<Props>) => {
  const { t } = useTranslation();

  let columns = [];
  switch (type) {
    case StatsType.topTxnCountSent:
    case StatsType.topTxnCountReceived:
      columns = [
        t(translations.statistics.column.address),
        t(translations.statistics.column.txn),
        t(translations.statistics.column.percentage),
      ];
      break;
    case StatsType.topCFXSend:
    case StatsType.topCFXReceived:
      columns = [
        t(translations.statistics.column.address),
        t(translations.statistics.column.txnValue),
        t(translations.statistics.column.percentage),
      ];
      break;
    case StatsType.topTokensBySenders:
      columns = [
        t(translations.statistics.column.token),
        t(translations.statistics.column.senders),
      ];
      break;
    case StatsType.topTokensByReceivers:
      columns = [
        t(translations.statistics.column.token),
        t(translations.statistics.column.receivers),
      ];
      break;
    case StatsType.topTokensByTxnCount:
      columns = [
        t(translations.statistics.column.token),
        t(translations.statistics.column.txn),
      ];
      break;
    case StatsType.topTokensByTxnAccountsCount:
      columns = [
        t(translations.statistics.column.token),
        t(translations.statistics.column.txnAccounts),
      ];
      break;

    default:
      break;
  }
  return (
    <CardWrapper>
      <h2>{t(translations.statistics[type])}</h2>
      <table>
        <thead>
          <tr>
            <th>{t(translations.statistics.column.rank)}</th>
            {columns.map(c => (
              <th>{c}</th>
            ))}
          </tr>
        </thead>
      </table>
    </CardWrapper>
  );
};

const CardWrapper = styled.div`
  padding: 18px;
  width: 100%;
  height: 500px;
  border-radius: 5px;
  border: 1px solid #e8e9ea;
  white-space: nowrap;
  overflow-x: auto;

  h2 {
    font-size: 16px;
    font-weight: 500;
    color: #000000;
    line-height: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e8e9ea;
  }

  .table-wrapper {
    max-height: 350px;
    overflow-y: auto;
  }

  table {
    width: 100%;
    font-size: 14px;
    text-align: left;
    padding: 10px 0;
    th,
    td {
      font-weight: normal;
      color: #9b9eac;
      line-height: 24px;
      padding: 4px;
    }
    td {
      color: #23304f;
    }
  }
`;
