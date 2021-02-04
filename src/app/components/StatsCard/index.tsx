import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import SkelontonContainer from '../SkeletonContainer';
import { reqTokenList, reqTopStatistics } from '../../../utils/httpRequest';
import { formatNumber, fromDripToCfx } from '../../../utils';
import { AddressContainer } from '../AddressContainer';
import { formatAddress } from '../../../utils/cfx';
import { token } from '../../../utils/tableColumns/token';

export enum StatsType {
  topCFXSend = 'topCFXSend',
  topCFXReceived = 'topCFXReceived',
  topTxnCountSent = 'topTxnCountSent',
  topTxnCountReceived = 'topTxnCountReceived',
  topTokensBySenders = 'topTokensBySenders',
  topTokensByReceivers = 'topTokensByReceivers',
  topTokensByTxnCount = 'topTokensByTxnCount',
  topTokensByTxnAccountsCount = 'topTokensByTxnAccountsCount',
}

interface Props {
  span: string;
  type: StatsType;
}

export const StatsCard = ({
  span = '7d',
  type = StatsType.topTxnCountSent,
}: Partial<Props>) => {
  const { t } = useTranslation();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTokenInfo, setLoadingTokenInfo] = useState(true);

  let columns = [];
  let action = '';
  let category = '';
  switch (type) {
    case StatsType.topCFXSend:
      columns = [
        t(translations.statistics.column.address),
        t(translations.statistics.column.txnValue),
        t(translations.statistics.column.percentage),
      ];
      action = 'cfxSend';
      category = 'transaction';
      break;
    case StatsType.topCFXReceived:
      columns = [
        t(translations.statistics.column.address),
        t(translations.statistics.column.txnValue),
        t(translations.statistics.column.percentage),
      ];
      action = 'cfxReceived';
      category = 'transaction';
      break;
    case StatsType.topTxnCountSent:
      columns = [
        t(translations.statistics.column.address),
        t(translations.statistics.column.txn),
        t(translations.statistics.column.percentage),
      ];
      action = 'txnSend';
      category = 'transaction';
      break;
    case StatsType.topTxnCountReceived:
      columns = [
        t(translations.statistics.column.address),
        t(translations.statistics.column.txn),
        t(translations.statistics.column.percentage),
      ];
      action = 'txnReceived';
      category = 'transaction';
      break;
    case StatsType.topTokensBySenders:
      columns = [
        t(translations.statistics.column.token),
        t(translations.statistics.column.senders),
      ];
      action = 'rank_contract_by_number_of_senders';
      category = 'token';
      break;
    case StatsType.topTokensByReceivers:
      columns = [
        t(translations.statistics.column.token),
        t(translations.statistics.column.receivers),
      ];
      action = 'rank_contract_by_number_of_receivers';
      category = 'token';
      break;
    case StatsType.topTokensByTxnCount:
      columns = [
        t(translations.statistics.column.token),
        t(translations.statistics.column.txn),
      ];
      action = 'rank_contract_by_number_of_transfers';
      category = 'token';
      break;
    case StatsType.topTokensByTxnAccountsCount:
      columns = [
        t(translations.statistics.column.token),
        t(translations.statistics.column.txnAccounts),
      ];
      action = 'rank_contract_by_number_of_participants';
      category = 'token';
      break;

    default:
      break;
  }

  useEffect(() => {
    if (action) {
      setLoading(true);
      setLoadingTokenInfo(true);
      reqTopStatistics({
        span,
        action,
      })
        .then(res => {
          if (res.code === 0) {
            if (category === 'token') {
              // inject token info
              let tokenAddress;
              let sourceList = res.list;

              tokenAddress = sourceList.reduce((acc, item) => {
                if (item.base32address && !acc.includes(item.base32address))
                  acc.push(item.base32address);
                return acc;
              }, []);

              if (tokenAddress.length > 0) {
                reqTokenList({
                  addressArray: tokenAddress,
                  fields: 'icon',
                })
                  .then(tokens => {
                    if (tokens && tokens.list) {
                      const listWithTokenInfo = sourceList.map(item => {
                        if (tokenAddress.includes(item.base32address)) {
                          const tokenInfo = tokens.list.find(
                            t =>
                              formatAddress(t.address) ===
                              formatAddress(item.base32address),
                          );
                          if (tokenInfo)
                            return { ...item, token: { ...tokenInfo } };
                        }
                        return item;
                      });
                      setData(listWithTokenInfo);
                    } else {
                      setData(sourceList);
                    }
                  })
                  .catch(e => {
                    console.error(e);
                    setData(sourceList);
                  })
                  .finally(() => {
                    setLoadingTokenInfo(false);
                  });
              }
            } else {
              setData(res.list);
              setLoadingTokenInfo(false);
            }
          } else {
            console.error(res);
            setLoadingTokenInfo(false);
          }
        })
        .catch(e => {
          console.error(e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [action, category, span, type]);
  return (
    <CardWrapper>
      <h2>{t(translations.statistics[type])}</h2>
      <SkelontonContainer
        shown={loading || (category === 'token' && loadingTokenInfo)}
      >
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>{t(translations.statistics.column.rank)}</th>
                {columns.map(c => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {category === 'transaction'
                ? data.map((d, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>
                        <AddressContainer value={d.base32 || d.hex} />
                      </td>
                      <td>
                        {action === 'cfxSend' || action === 'cfxReceived'
                          ? fromDripToCfx(d.value)
                          : d.value}
                      </td>
                      <td>{formatNumber(d.percent)}%</td>
                    </tr>
                  ))
                : category === 'token'
                ? data.map((d, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>
                        {d.token ? (
                          token.render(d.token)
                        ) : (
                          <AddressContainer value={d.base32address || d.hex} />
                        )}
                      </td>
                      <td>{d.valueN || '0'}</td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      </SkelontonContainer>
    </CardWrapper>
  );
};

const CardWrapper = styled.div`
  padding: 18px;
  width: 100%;
  min-height: 530px;
  border-radius: 5px;
  border: 1px solid #e8e9ea;
  white-space: nowrap;

  h2 {
    font-size: 16px;
    font-weight: 500;
    color: #000000;
    line-height: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e8e9ea;
  }

  .table-wrapper {
    width: 100%;
    min-height: 450px;
    padding-bottom: 16px;
    overflow-x: auto;
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
      padding: 8px;
    }
    td {
      color: #23304f;
    }
    tbody tr:nth-child(odd) {
      background: rgba(250, 251, 252, 0.62);
    }
  }
`;
