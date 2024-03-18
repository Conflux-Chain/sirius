import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import SkelontonContainer from '../SkeletonContainer';
import { reqTokenList, reqTopStatistics } from '../../../utils/httpRequest';
import {
  formatNumber,
  fromDripToCfx,
  hideInDotNet,
  toThousands,
} from '../../../utils';
import { AddressContainer } from '../AddressContainer';
import { formatAddress } from '../../../utils';
import { token } from '../../../utils/tableColumns/token';
import { Text } from '../Text/Loadable';
import BigNumber from 'bignumber.js';
import { usePortal } from '../../../utils/hooks/usePortal';
import { media } from '../../../styles/media';
import { monospaceFont } from '../../../styles/variable';
import { Link } from '../Link';
import { Description } from '../Description/Loadable';
import lodash from 'lodash';
import { NetworkPie } from './NetworkPie';
import { HIDE_IN_DOT_NET } from '../../../utils/constants';
import { IS_TESTNET } from 'env';

export enum StatsType {
  overviewTransactions = 'overviewTransactions',
  overviewTokens = 'overviewTokens',
  overviewMiners = 'overviewMiners',
  overviewNetwork = 'overviewNetwork',
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
  highestNodes = 'highestNodes',
}

interface Props {
  span: string;
  type: StatsType;
  withChart?: boolean;
  tabsChange?: any;
  statsData?: any;
}

const cfxValue = (value, opt: any = { showUnit: false }) => (
  <Text hoverValue={`${fromDripToCfx(value, true)} CFX`}>
    {fromDripToCfx(value, false, {
      withUnit: false,
      keepDecimal: false,
      ...opt,
    })}
    {opt.showUnit ? ' CFX' : ''}
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
  tabsChange = () => {},
  statsData = null,
}: Partial<Props>) => {
  const { t } = useTranslation();
  const [data, setData] = useState<any>([]);
  const [totalDifficulty, setTotalDifficulty] = useState<string>('');
  const [totalGas, setTotalGas] = useState<number>(Infinity);
  const [loading, setLoading] = useState(true);
  const [loadingTokenInfo, setLoadingTokenInfo] = useState(true);
  const [totalTopCfxSent, setTotalTopCfxSent] = useState(new BigNumber(0));
  const [totalTopCfxReceived, setTotalTopCfxReceived] = useState(
    new BigNumber(0),
  );
  const [totalTopTxnSent, setTotalTopTxnSent] = useState(new BigNumber(0));
  const [totalTopTxnReceived, setTotalTopTxnReceived] = useState(
    new BigNumber(0),
  );

  // get portal selected address
  const { accounts } = usePortal();

  let columns: any[] = [];
  let action = '';
  let category = '';
  switch (type) {
    case StatsType.overviewTransactions:
      columns = [
        {
          title: t(translations.statistics.overviewColumns.totalTxnCount),
          more: '/pow-charts/tx',
          index: 'cfxTxn',
        },
      ];

      if (!HIDE_IN_DOT_NET) {
        columns.unshift({
          title: t(translations.statistics.overviewColumns.totalCFXSent),
          index: 'cfxAmount',
          more: '/pow-charts/cfx-transfer',
          unit: 'CFX',
        });
      }

      action = 'transactions';
      category = 'overview';
      break;
    case StatsType.overviewTokens:
      columns = [
        {
          title: t(
            translations.statistics.overviewColumns.totalTokenTransfersCount,
          ),
          more: '/pow-charts/token-transfer',
          index: 'tokenTransfer',
        },
        {
          title: t(
            translations.statistics.overviewColumns
              .totalTokenTransfersAccountsCount,
          ),
          more: '/pow-charts/token-transfer',
          index: 'tokenAccount',
        },
      ];
      action = 'tokens';
      category = 'overview';
      break;
    case StatsType.overviewMiners:
      columns = [
        {
          title: t(translations.statistics.overviewColumns.totalMiners),
          index: 'minerCount',
        },
      ];

      // only show in coreSpace testnet
      if (IS_TESTNET) {
        columns.unshift({
          title: t(translations.statistics.overviewColumns.highestNodes),
          index: 'highestNodes',
        });
      }

      action = 'miners';
      category = 'overview';
      break;
    case StatsType.overviewNetwork:
      columns = [
        {
          title: t(translations.statistics.overviewColumns.totalGasUsed),
          index: 'gasUsed',
        },
      ];
      action = 'network';
      category = 'overview';
      break;
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
        t(translations.statistics.column.hashRate),
      ];

      if (!HIDE_IN_DOT_NET) {
        columns.splice(
          3,
          2,
          t(translations.statistics.column.totalRewards),
          t(translations.statistics.column.totalTxnFees),
        );
      }

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
    setTotalTopCfxSent(new BigNumber(0));
    setTotalTopCfxReceived(new BigNumber(0));
    setTotalTopTxnSent(new BigNumber(0));
    setTotalTopTxnReceived(new BigNumber(0));
  }, [span]);
  useEffect(() => {
    if (category === 'overview') {
      if (statsData) {
        setLoading(false);
      }
    } else if (action) {
      setLoading(true);
      setLoadingTokenInfo(true);
      reqTopStatistics({
        span,
        action,
      })
        .then((res = {}) => {
          if (Object.keys(res)) {
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
                  fields: 'iconUrl',
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
  }, [action, category, span, statsData, type]);

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
        return data.map((d, i) => {
          switch (action) {
            case 'cfxSend':
              setTotalTopCfxSent(oldValue => BigNumber.sum(d.value, oldValue));
              break;
            case 'cfxReceived':
              setTotalTopCfxReceived(oldValue =>
                BigNumber.sum(d.value, oldValue),
              );
              break;
            case 'txnSend':
              setTotalTopTxnSent(oldValue => BigNumber.sum(d.value, oldValue));
              break;
            case 'txnReceived':
              setTotalTopTxnReceived(oldValue =>
                BigNumber.sum(d.value, oldValue),
              );
              break;
          }
          let verify = false;
          if (d.contractInfo && d.contractInfo.verify) {
            verify = d.contractInfo.verify.result !== 0;
          }
          return (
            <tr key={i}>
              <td>{i + 1}</td>
              <td className="address">
                <AddressContainer
                  value={d.base32}
                  alias={
                    d.contractInfo && d.contractInfo.name
                      ? d.contractInfo.name
                      : d.tokenInfo && d.tokenInfo.name
                      ? d.tokenInfo.name
                      : null
                  }
                  isMe={
                    accounts && accounts.length > 0
                      ? formatAddress(accounts[0]) === formatAddress(d.base32)
                      : false
                  }
                  verify={verify}
                />
              </td>
              <td className="text-right">
                {action === 'cfxSend' || action === 'cfxReceived'
                  ? cfxValue(d.value)
                  : intValue(d.value)}
              </td>
              <td className="text-right">{percentageValue(d.percent)}</td>
            </tr>
          );
        });
      case 'token':
        return data.map((d, i) => (
          <tr key={i}>
            <td>{i + 1}</td>
            <td className="address">
              {d.token ? (
                token.render(d.token)
              ) : (
                <AddressContainer
                  value={d.base32address}
                  isMe={
                    accounts && accounts.length > 0
                      ? formatAddress(accounts[0]) ===
                        formatAddress(d.base32address)
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
            <td className="address">
              <AddressContainer
                value={d.base32}
                isMe={
                  accounts && accounts.length > 0
                    ? formatAddress(accounts[0]) === formatAddress(d.base32)
                    : false
                }
              />
            </td>
            <td className="text-right">{intValue(d.blockCount)}</td>
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
            {hideInDotNet(
              <>
                <td className="text-right">
                  {cfxValue(d.totalReward, { showUnit: true })}
                </td>
                <td className="text-right">
                  {cfxValue(d.txFee, {
                    keepDecimal: true,
                    keepZero: true,
                    showUnit: true,
                  })}
                </td>
              </>,
            )}
          </tr>
        ));
      case 'network':
        return data.map((d, i) => (
          <tr key={i}>
            <td>{i + 1}</td>
            <td className="address">
              <AddressContainer
                value={d.base32}
                isMe={
                  accounts && accounts.length > 0
                    ? formatAddress(accounts[0]) === formatAddress(d.base32)
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
  const account = accounts[0];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tableBodyMemo = useMemo(() => tableBody(category, data), [
    category,
    data,
    action,
    account,
    totalDifficulty,
    totalGas,
  ]);

  const chartContent = (category, data: any = []) => {
    switch (category) {
      case 'network': {
        const chartData = data
          .sort((a, b) => b.gas - a.gas >= 0)
          .map((d, i) => ({
            name: i + 1,
            address: formatAddress(d.base32),
            value: +d.gas,
          }));
        return <NetworkPie data={chartData} />;
      }
      default:
        return null;
    }
  };

  let total;
  if (action === 'cfxSend') {
    total = (
      <span>
        {t(translations.statistics.valueInTotal)}：
        {fromDripToCfx(totalTopCfxSent.toString(), false, {
          withUnit: false,
          keepDecimal: false,
        })}{' '}
        CFX
      </span>
    );
  } else if (action === 'cfxReceived') {
    total = (
      <span>
        {t(translations.statistics.valueInTotal)}：
        {fromDripToCfx(totalTopCfxReceived.toString(), false, {
          withUnit: false,
          keepDecimal: false,
        })}{' '}
        CFX
      </span>
    );
  } else if (action === 'txnSend') {
    total = (
      <span>
        {t(translations.statistics.txnCountInTotal)}：
        {toThousands(totalTopTxnSent.toString())}
      </span>
    );
  } else if (action === 'txnReceived') {
    total = (
      <span>
        {t(translations.statistics.txnCountInTotal)}：
        {toThousands(totalTopTxnReceived.toString())}
      </span>
    );
  }

  return (
    <CardWrapper className={category}>
      <HeaderWrapper>
        {t(translations.statistics[type])}{' '}
        {category === 'overview' ? (
          <Link
            href="#"
            onClick={e => {
              e.preventDefault();
              tabsChange && tabsChange(action);
            }}
          >
            {t(translations.statistics.overviewColumns.top10)}
          </Link>
        ) : null}
        {category === 'transaction' ? total : null}
      </HeaderWrapper>
      <SkelontonContainer
        shown={loading || (category === 'token' && loadingTokenInfo)}
      >
        <div
          className={`table-wrapper ${withChart ? 'hasChart' : ''} ${category}`}
        >
          {withChart ? (
            <div className="chart-wrapper">{chartContent(category, data)}</div>
          ) : null}
          {category === 'overview' ? (
            <>
              {columns.map(c => (
                <Description
                  title={
                    <>
                      {c['title']}
                      {c['more'] ? (
                        <Link href={c['more']} style={{ marginLeft: 8 }}>
                          {t(translations.statistics.overviewMore)}
                        </Link>
                      ) : null}
                    </>
                  }
                  key={c['title']}
                >
                  <SkelontonContainer
                    shown={lodash.isNil(statsData[c['index']])}
                  >
                    {lodash.isNil(statsData[c['index']])
                      ? '--'
                      : c['unit'] === 'CFX'
                      ? cfxValue(statsData[c['index']], { showUnit: true })
                      : formatNumber(statsData[c['index']], {
                          withUnit: false,
                        })}
                  </SkelontonContainer>
                </Description>
              ))}
            </>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>{t(translations.statistics.column.rank)}</th>
                  {tableHeader(category)}
                </tr>
              </thead>
              <tbody>{tableBodyMemo}</tbody>
            </table>
          )}
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

  &.overview {
    min-height: unset;
    padding-bottom: 10px;
  }

  h2 {
    font-size: 16px;
    font-weight: 500;
    color: #000000;
    line-height: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e8e9ea;

    a {
      font-size: 16px;
      float: right;
      font-weight: normal;
    }
  }

  .table-wrapper {
    width: 100%;
    min-height: 450px;
    padding-bottom: 16px;
    overflow-x: auto;

    &.overview {
      min-height: unset;
      padding-bottom: 0;

      .description {
        .left {
          width: auto;
          max-width: unset;
          white-space: nowrap;
        }

        .right {
          text-align: right;
          width: auto;
        }

        ${media.s} {
          .right {
            text-align: left;
          }
        }

        &:last-child {
          border-bottom: none;
        }
      }
    }

    &.hasChart {
      display: flex;
      justify-content: center;
      align-items: center;

      ${media.m} {
        flex-direction: column;
        align-items: baseline;
      }
    }
  }

  .chart-wrapper {
    width: 100%;
    min-width: 300px;
    min-height: 400px;
    padding: 16px;
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

      &.address {
        min-width: 200px;
      }

      p.sirius-text {
        font-family: ${monospaceFont};
      }
    }

    td {
      color: #23304f;
      font-family: ${monospaceFont};
    }

    tbody tr:nth-child(odd) {
      background: rgba(250, 251, 252, 0.62);
    }

    .text-right {
      text-align: right;
    }
  }
`;
const HeaderWrapper = styled.h2`
  display: flex;
  justify-content: space-between;
`;
