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
import { Text } from '../Text/Loadable';
import BigNumber from 'bignumber.js';
import { useAccounts } from '../../../utils/hooks/usePortal';
import ReactECharts from 'echarts-for-react';
import { media } from '../../../styles/media';
import { monospaceFont } from '../../../styles/variable';

export enum StatsType {
  topCFXSend = 'topCFXSend',
  topCFXReceived = 'topCFXReceived',
  topTxnCountSent = 'topTxnCountSent',
  topTxnCountReceived = 'topTxnCountReceived',
  topTokensBySenders = 'topTokensBySenders',
  topTokensByReceivers = 'topTokensByReceivers',
  topTokensByTxnCount = 'topTokensByTxnCount',
  topTokensByTxnAccountsCount = 'topTokensByTxnAccountsCount',
  topMinersByBlocksMined = 'topMinersByBlocksMined',
  topAccountsByGasUsed = 'topAccountsByGasUsed',
  topAccountsByTxnCount = 'topAccountsByTxnCount',
}

interface Props {
  span: string;
  type: StatsType;
  withChart?: boolean;
}

const cfxValue = (value, opt = {}) => (
  <Text hoverValue={`${fromDripToCfx(value, true)} CFX`}>
    {fromDripToCfx(value, false, {
      withUnit: false,
      keepDecimal: false,
      ...opt,
    })}
  </Text>
);

const intValue = (value, opt = {}) => (
  <Text
    hoverValue={formatNumber(value, {
      withUnit: false,
    })}
  >
    {formatNumber(value, { withUnit: false, ...opt })}
  </Text>
);

const percentageValue = value => (
  <Text
    hoverValue={`${formatNumber(value, {
      keepZero: true,
    })} %`}
  >
    {formatNumber(value, { keepZero: true })}%
  </Text>
);

export const StatsCard = ({
  span = '7d',
  type = StatsType.topTxnCountSent,
  withChart = false,
}: Partial<Props>) => {
  const { t } = useTranslation();
  const [data, setData] = useState<any>([]);
  const [totalDifficulty, setTotalDifficulty] = useState<string>('');
  const [totalGas, setTotalGas] = useState<number>(Infinity);
  const [loading, setLoading] = useState(true);
  const [loadingTokenInfo, setLoadingTokenInfo] = useState(true);

  // get portal selected address
  const [accounts] = useAccounts();

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
    case StatsType.topMinersByBlocksMined:
      columns = [
        t(translations.statistics.column.address),
        t(translations.statistics.column.totalBlocksMined),
        t(translations.statistics.column.totalRewards),
        t(translations.statistics.column.totalTxnFees),
        t(translations.statistics.column.hashRate),
      ];
      action = 'topMiner';
      category = 'miner';
      break;
    case StatsType.topAccountsByGasUsed:
      columns = [
        t(translations.statistics.column.address),
        t(translations.statistics.column.gasUsed),
      ];
      action = 'top-gas-used';
      category = 'network';
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
              if (category === 'miner' && res.allDifficulty) {
                // calc proportion of hashRate
                setTotalDifficulty(res.allDifficulty + '');
              }
              if (category === 'network' && res.totalGas) {
                // calc proportion of gas used
                setTotalGas(+(res.totalGas || Infinity));
              }
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

  const tableHeader = category => {
    switch (category) {
      case 'transaction':
        return (
          <>
            <th>{columns[0]}</th>
            <th className="text-right">{columns[1]}</th>
            <th className="text-right">{columns[2]}</th>
          </>
        );
      case 'token':
        return (
          <>
            <th>{columns[0]}</th>
            <th className="text-right">{columns[1]}</th>
          </>
        );
      case 'miner':
        return (
          <>
            <th>{columns[0]}</th>
            <th className="text-right">{columns[1]}</th>
            <th className="text-right">{columns[2]}</th>
            <th className="text-right">{columns[3]}</th>
            <th className="text-right">{columns[4]}</th>
            <th className="text-right">{columns[5]}</th>
          </>
        );
      case 'network':
        return (
          <>
            <th>{columns[0]}</th>
            <th className="text-right">{columns[1]}</th>
            <th className="text-right">{columns[2]}</th>
          </>
        );
      default:
        return null;
    }
  };

  const tableBody = (category, data: any = []) => {
    switch (category) {
      case 'transaction':
        return data.map((d, i) => (
          <tr key={i}>
            <td>{i + 1}</td>
            <td>
              <AddressContainer
                value={d.base32 || d.hex}
                isMe={
                  accounts && accounts.length > 0
                    ? formatAddress(accounts[0]) ===
                      formatAddress(d.base32 || d.hex)
                    : false
                }
              />
            </td>
            <td className="text-right">
              {action === 'cfxSend' || action === 'cfxReceived'
                ? cfxValue(d.value)
                : intValue(d.value)}
            </td>
            <td className="text-right">{percentageValue(d.percent)}</td>
          </tr>
        ));
      case 'token':
        return data.map((d, i) => (
          <tr key={i}>
            <td>{i + 1}</td>
            <td>
              {d.token ? (
                token.render(d.token)
              ) : (
                <AddressContainer
                  value={d.base32address || d.hex}
                  isMe={
                    accounts && accounts.length > 0
                      ? formatAddress(accounts[0]) ===
                        formatAddress(d.base32address || d.hex)
                      : false
                  }
                />
              )}
            </td>
            <td className="text-right">{intValue(d.valueN)}</td>
          </tr>
        ));
      case 'miner':
        return data.map((d, i) => (
          <tr key={i}>
            <td>{i + 1}</td>
            <td>
              <AddressContainer
                value={d.base32 || '0x' + d.miner}
                maxWidth={220}
                isMe={
                  accounts && accounts.length > 0
                    ? formatAddress(accounts[0]) ===
                      formatAddress(d.base32 || '0x' + d.miner)
                    : false
                }
              />
            </td>
            <td className="text-right">{intValue(d.blockCount)}</td>
            <td className="text-right">{cfxValue(d.totalReward)} CFX</td>
            <td className="text-right">
              {cfxValue(d.txFee, {
                keepDecimal: true,
                keepZero: true,
              })}{' '}
              CFX
            </td>
            <td className="text-right">
              <Text
                hoverValue={
                  formatNumber(d.hashRate, {
                    withUnit: false,
                  }) + ' H/s'
                }
              >
                {formatNumber(
                  new BigNumber(d.hashRate)
                    .dividedBy(new BigNumber(10).pow(9))
                    .toFixed(3),
                  {
                    withUnit: false,
                    keepZero: true,
                  },
                )}
              </Text>

              <Text
                hoverValue={
                  (d.difficultySum && totalDifficulty
                    ? new BigNumber(d.difficultySum)
                        .dividedBy(new BigNumber(totalDifficulty))
                        .multipliedBy(100)
                        .toFixed(8)
                    : '-') + '%'
                }
              >
                &nbsp;(
                {d.difficultySum && totalDifficulty
                  ? new BigNumber(d.difficultySum)
                      .dividedBy(new BigNumber(totalDifficulty))
                      .multipliedBy(100)
                      .toFixed(3)
                  : '-'}
                %)
              </Text>
            </td>
          </tr>
        ));
      case 'network':
        return data.map((d, i) => (
          <tr key={i}>
            <td>{i + 1}</td>
            <td>
              <AddressContainer
                value={d.base32 || d.hex}
                isMe={
                  accounts && accounts.length > 0
                    ? formatAddress(accounts[0]) ===
                      formatAddress(d.base32 || d.hex)
                    : false
                }
              />
            </td>
            <td className="text-right">
              <Text
                hoverValue={formatNumber(d.gas, {
                  withUnit: false,
                })}
              >
                {formatNumber(d.gas, {
                  withUnit: false,
                  keepDecimal: false,
                })}
              </Text>

              <Text
                hoverValue={
                  (d.gas && totalGas
                    ? new BigNumber(d.gas)
                        .dividedBy(new BigNumber(totalGas))
                        .multipliedBy(100)
                        .toFixed(8)
                    : '-') + '%'
                }
              >
                &nbsp;(
                {d.gas && totalGas
                  ? new BigNumber(d.gas)
                      .dividedBy(new BigNumber(totalGas))
                      .multipliedBy(100)
                      .toFixed(3)
                  : '-'}
                %)
              </Text>
            </td>
          </tr>
        ));
      default:
        return null;
    }
  };

  const chartContent = (category, data: any = []) => {
    switch (category) {
      case 'network': {
        const chartData = data
          .sort((a, b) => b.gas - a.gas >= 0)
          .map((d, i) => ({
            name: '#' + (i + 1),
            address: formatAddress(d.base32 || d.hex),
            value: +d.gas,
          }));
        const CustomTooltip = ({ data }: any) => {
          if (data) {
            return `<div class="tooltip gasused-tooltip">
                <div>
                  <span>${t(
                    translations.statistics.column.address,
                  )}: &nbsp;&nbsp;</span>
                  <span>${data.address.replace(
                    /(.*:.{6}).*(.{6})/,
                    '$1...$2',
                  )}</span>
                </div>
                <div>
                  <span>${t(
                    translations.statistics.column.gasUsed,
                  )}: &nbsp;&nbsp;</span>
                  <span>
                    ${formatNumber(data.value, {
                      withUnit: false,
                      keepDecimal: false,
                    })}
                  </span>
                </div>
              </div>`;
          }
          return '';
        };
        return (
          <ReactECharts
            style={{ height: 450, width: '95%', minWidth: 350 }}
            option={{
              legend: {
                show: false,
              },
              toolbox: {
                show: false,
              },
              tooltip: {
                show: true,
                // position: ['50%', '50%'],
                formatter: CustomTooltip,
                confine: true,
              },
              series: [
                {
                  color: [
                    '#5470c6',
                    '#91cc75',
                    '#fac858',
                    '#ee6666',
                    '#73c0de',
                    '#3ba272',
                    '#fc8452',
                    '#9a60b4',
                    '#ea7ccc',
                  ],
                  type: 'pie',
                  radius: [50, 100],
                  itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 1,
                  },
                  data: chartData,
                },
              ],
            }}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <CardWrapper>
      <h2>{t(translations.statistics[type])}</h2>
      <SkelontonContainer
        shown={loading || (category === 'token' && loadingTokenInfo)}
      >
        <div className={`table-wrapper ${withChart ? 'hasChart' : ''}`}>
          {withChart ? (
            <div className="chart-wrapper">{chartContent(category, data)}</div>
          ) : null}
          <table>
            <thead>
              <tr>
                <th>{t(translations.statistics.column.rank)}</th>
                {tableHeader(category)}
              </tr>
            </thead>
            <tbody>{tableBody(category, data)}</tbody>
          </table>
        </div>
      </SkelontonContainer>
    </CardWrapper>
  );
};

const CardWrapper = styled.div`
  padding: 18px;
  width: 100%;
  min-height: 538px;
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

    &.hasChart {
      display: flex;
      justify-content: center;
      align-items: center;

      ${media.m} {
        flex-direction: column;
      }
    }
  }

  .chart-wrapper {
    width: 100%;
    min-width: 350px;
    min-height: 450px;
    padding-bottom: 16px;
    overflow-x: auto;

    ${media.m} {
      order: 2;
    }

    .tooltip {
      div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0;
        line-height: 2;
        &:first-child {
          border-bottom: 1px solid #ccc;
        }
        & > span {
          &:first-child {
            font-weight: 700;
          }
        }
      }
    }
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

      p.sirius-text {
        font-family: ${monospaceFont};
      }
    }
    td {
      color: #23304f;
    }
    tbody tr:nth-child(odd) {
      background: rgba(250, 251, 252, 0.62);
    }
    .text-right {
      text-align: right;
    }
  }
`;
