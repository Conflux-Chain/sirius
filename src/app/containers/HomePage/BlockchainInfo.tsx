import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Grid } from '@cfxjs/react-ui';
import { useTranslation } from 'react-i18next';
import { Card } from 'sirius-next/packages/common/dist/components/Card';
import { translations } from 'locales/i18n';
import { media } from 'styles/media';
import {
  formatNumber,
  formatBalance,
  formatTimeStamp,
  hideInDotNet,
} from 'utils';
import {
  reqHomeDashboard,
  reqHomeDashboardOfPOSSummary,
  reqTransferTPS,
  reqTransferPlot,
  reqTopStatistics,
} from 'utils/httpRequest';
import { Link } from 'react-router-dom';
import lodash from 'lodash';
import iconPos from 'images/homepage/pos.png';
import iconPow from 'images/homepage/pow.png';
import { InfoIconWithTooltip } from 'sirius-next/packages/common/dist/components/InfoIconWithTooltip';
import { Tx, AccountGrowth } from '../Charts/pow/Loadable';

function Info(title, number: any) {
  return (
    <div className="info">
      <div className="title">{title}</div>
      <div className="number">{number || '--'}</div>
    </div>
  );
}

// TODO redesign
export function BlockchainInfo({ timestamp = 1 }: { timestamp?: number }) {
  const { t } = useTranslation();
  // const iszh = i18n.language.includes('zh');
  const [dashboardData, setDashboardData] = useState<any>({});
  const [POSSummaryInfo, setPOSSummaryInfo] = useState<any>({});
  const [transferData, setTransferData] = useState<any>({});
  const [plotData, setPlotData] = useState<any>({});
  const [topStatisticsData, setTopStatisticsData] = useState<any>({});

  useEffect(() => {
    reqHomeDashboard()
      .then(res => {
        setDashboardData(res || {});
      })
      .catch(e => {
        console.error(e);
      });

    reqHomeDashboardOfPOSSummary()
      .then(res => setPOSSummaryInfo(res))
      .catch(e => {
        console.error('get pos homepage summary info error: ', e);
      });

    reqTransferTPS()
      .then(res => {
        if (Object.keys(res)) {
          setTransferData(res);
        }
      })
      .catch(e => {
        console.log('reqTransferTPS error: ', e);
      });

    reqTransferPlot()
      .then(res => {
        if (res.list?.length) {
          setPlotData({
            tps: formatNumber(res.list[6].tps),
            blockTime: formatNumber(res.list[6].blockTime),
            hashRate: formatNumber(res.list[6].hashRate),
          });
        }
      })
      .catch(e => {
        console.log('reqTransferPlot error: ', e);
      });

    reqTopStatistics({
      action: 'overview',
      span: '24h',
    })
      .then(res => {
        setTopStatisticsData(res?.stat);
      })
      .catch(e => {
        console.log('reqTopStatistics error: ', e);
      });
  }, [timestamp]);

  return (
    <CardWrapper>
      <Card className="homepage-info-pow">
        <Grid.Container
          gap={1}
          justify="flex-start"
          className="stats-container stats-container-pow-top"
        >
          <Grid xs={24} sm={24} md={4}>
            {Info(
              t(translations.statistics.home.currentEpoch),
              `${dashboardData.epochNumber ? dashboardData.epochNumber : '--'}`,
            )}
          </Grid>
          <Grid xs={24} sm={24} md={4}>
            {Info(
              t(translations.statistics.pos.finalizedEpoch),
              POSSummaryInfo.posPivotDecision,
            )}
          </Grid>
          <Grid xs={24} sm={24} md={4}>
            {Info(
              t(translations.statistics.home.currentBlockNumber),
              `${dashboardData.blockNumber ? dashboardData.blockNumber : '--'}`,
            )}
          </Grid>
          <Grid xs={24} sm={24} md={4}>
            {Info(
              t(translations.statistics.home.account),
              `${
                dashboardData.addressCount
                  ? formatNumber(dashboardData.addressCount, {
                      withUnit: false,
                      keepDecimal: false,
                    })
                  : '--'
              }`,
            )}
          </Grid>
          <Grid xs={24} sm={24} md={4}>
            {Info(
              <Link to={'/pow-charts/tx'} className="info-link">
                {t(translations.statistics.home.transactions)}
              </Link>,
              `${
                dashboardData.transactionCount
                  ? formatNumber(dashboardData.transactionCount, {
                      withUnit: false,
                      keepDecimal: false,
                    })
                  : '--'
              }`,
            )}
          </Grid>
          <Grid xs={24} sm={24} md={4}>
            {Info(
              <Link to={'/pow-charts/contracts'} className="info-link">
                {t(translations.statistics.home.contract)}
              </Link>,
              `${
                dashboardData.contractCount
                  ? formatNumber(dashboardData.contractCount, {
                      withUnit: false,
                      keepDecimal: false,
                    })
                  : '--'
              }`,
            )}
          </Grid>
        </Grid.Container>

        <div className="stats-container stats-container-split"></div>

        <Grid.Container
          gap={1}
          justify="flex-start"
          className="stats-container stats-container-pow-bottom"
        >
          <Grid xs={24} sm={24} md={4}>
            {Info(
              <Link to="/pow-charts/tps" className="info-link">
                {t(translations.charts.tps.title)}
              </Link>,
              lodash.isNil(plotData.tps) ? '--' : plotData.tps,
            )}
          </Grid>
          <Grid xs={24} sm={24} md={4}>
            {Info(
              t(translations.charts.tokenTransferTps.title),
              lodash.isNil(transferData?.tps)
                ? '--'
                : formatNumber(transferData?.tps, {
                    withUnit: false,
                  }),
            )}
          </Grid>
          <Grid xs={24} sm={24} md={4}>
            {Info(
              t(translations.statistics.home.gasUsed),
              `${
                dashboardData.gasUsedPerSecond
                  ? formatNumber(dashboardData.gasUsedPerSecond, {
                      withUnit: false,
                      keepDecimal: false,
                    })
                  : '--'
              }`,
            )}
          </Grid>
          <Grid xs={24} sm={24} md={4}>
            {Info(
              <Link to="/pow-charts/blocktime" className="info-link">
                {t(translations.charts.blockTime.title)}
              </Link>,
              lodash.isNil(plotData.blockTime)
                ? '--'
                : plotData.blockTime + 's',
            )}
          </Grid>
          <Grid xs={24} sm={24} md={4}>
            {Info(
              <Link to="/pow-charts/hashrate" className="info-link">
                {t(translations.charts.hashRate.title)}
              </Link>,
              lodash.isNil(plotData.hashRate) ? '--' : plotData.hashRate,
            )}
          </Grid>

          <Grid xs={24} sm={24} md={4}>
            {Info(
              t(translations.statistics.home.minerCount),
              `${
                topStatisticsData.minerCount
                  ? topStatisticsData.minerCount
                  : '--'
              }`,
            )}
          </Grid>
        </Grid.Container>

        <div className="homepage-infoType-container">
          <img src={iconPow} alt=""></img>
        </div>
      </Card>

      <Card className="homepage-info-pos">
        <Grid.Container
          gap={1}
          justify="flex-start"
          className="stats-container"
        >
          <Grid xs={24} sm={24} md={3}>
            {Info(
              t(translations.statistics.pos.currentBlockNumber),
              POSSummaryInfo.latestCommitted,
            )}
          </Grid>
          <Grid xs={24} sm={24} md={3}>
            {Info(
              t(translations.statistics.pos.votingBlock),
              POSSummaryInfo.latestVoted,
            )}
          </Grid>
          <Grid xs={24} sm={24} md={2}>
            {Info(
              <Link to="/pos-charts/daily-accounts" className="info-link">
                {t(translations.statistics.pos.totalAccountCount)}
              </Link>,
              POSSummaryInfo.posAccountCount,
            )}
          </Grid>
          {hideInDotNet(
            <>
              <Grid xs={24} sm={24} md={3}>
                {Info(
                  <Link to="/pos-charts/daily-staking" className="info-link">
                    {t(translations.statistics.pos.totalLocked)}
                  </Link>,
                  formatBalance(POSSummaryInfo.totalPosStakingTokens),
                )}
              </Grid>
              <Grid xs={24} sm={24} md={3}>
                {Info(
                  <InfoIconWithTooltip
                    info={t(translations.statistics.pos.apyTip)}
                  >
                    <Link to="/pos-charts/daily-apy" className="info-link">
                      {t(translations.statistics.pos.apy)}
                    </Link>
                  </InfoIconWithTooltip>,
                  lodash.isNil(POSSummaryInfo.apy)
                    ? '--'
                    : String(POSSummaryInfo.apy).substr(0, 4) + '%',
                )}
              </Grid>
              <Grid xs={24} sm={24} md={3}>
                {Info(
                  <Link to="/pos-charts/total-reward" className="info-link">
                    {t(translations.statistics.pos.totalInterest)}
                  </Link>,
                  formatBalance(POSSummaryInfo.totalPosRewardDrip),
                )}
              </Grid>
            </>,
          )}
          <Grid xs={24} sm={24} md={5.5}>
            {Info(
              t(translations.statistics.pos.lastInterestDistributionEpoch),
              lodash.isNil(POSSummaryInfo.lastDistributeBlock) ? (
                '--'
              ) : (
                <span>
                  <span>{POSSummaryInfo.lastDistributeBlock} </span>
                  {POSSummaryInfo.lastDistributeBlockTime ? (
                    <span className="pos-block-timestamp">
                      {formatTimeStamp(POSSummaryInfo.lastDistributeBlockTime)}
                    </span>
                  ) : null}
                </span>
              ),
            )}
          </Grid>
        </Grid.Container>

        <div className="homepage-infoType-container pos">
          <img src={iconPos} alt=""></img>
        </div>
      </Card>
      <div className="charts">
        <Grid.Container gap={2.7} justify="center">
          <Grid xs={24} sm={24} md={12}>
            <Tx preview={true} />
          </Grid>
          <Grid xs={24} sm={24} md={12}>
            <AccountGrowth preview={true} />
          </Grid>
        </Grid.Container>
      </div>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  margin-top: 20px;
  margin-bottom: 16px;
  width: 100%;

  .card {
    position: relative;

    &.homepage-info-pos,
    &.homepage-info-pow {
      margin-top: 20px;
      position: relative;
    }

    &.homepage-info-pow {
      .stats-container-pow-top {
        .item {
          &:nth-child(3) {
            position: relative;

            &::after {
              content: '';
              position: absolute;
              border-right: 1px solid #e8e9ea;
              height: 70%;
              top: 15%;
              right: 15%;
            }
          }

          /* &:nth-child(4) {
            padding-left: 2rem;
          } */
        }
      }

      .stats-container-pow-bottom {
        .item {
          &:nth-child(3) {
            position: relative;

            &::after {
              content: '';
              position: absolute;
              border-right: 1px solid #e8e9ea;
              height: 70%;
              top: 15%;
              right: 15%;
            }
          }

          /* &:nth-child(3) {
            padding-left: 5rem;
          } */
        }
      }
    }

    &.homepage-info-pos {
      .item {
        &:nth-child(3) {
          position: relative;

          &::after {
            content: '';
            position: absolute;
            border-right: 1px solid #e8e9ea;
            height: 70%;
            top: 15%;
            right: 30%;
          }
        }

        &:nth-child(5) {
          position: relative;

          &::after {
            content: '';
            position: absolute;
            border-right: 1px solid #e8e9ea;
            height: 70%;
            top: 15%;
            right: 25%;
          }
        }
      }

      .pos-block-timestamp {
        font-size: 12px;
        color: #999999;
        padding-left: 10px;
      }
    }

    .homepage-infoType-container {
      position: absolute;
      right: -2px;
      top: -2px;
      bottom: -2px;
      z-index: 1;
      width: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1e3de4;
      border-radius: 0px 5px 5px 0px;

      &.pos {
        background: #309eee;
      }
    }
  }

  .stats-container {
    padding: 12px 0;

    ${media.m} {
      padding: 0;
    }

    &.stats-container-pow-bottom {
      margin-top: 1px solid #e8e9ea;
    }

    &.stats-container-split {
      border-top: 1px solid #e8e9ea;
      padding: 0;
    }

    &.stats-container-pow-bottom {
      margin-top: 1px solid #e8e9ea;
    }

    &.stats-container-split {
      border-top: 1px solid #e8e9ea;
      padding: 0;
    }

    & > .item {
      ${media.m} {
        max-width: 100%;
        border-right: none !important;
        padding-left: 0 !important;
        border-bottom: 1px solid #e8e9ea;
        margin-right: 36px;

        &:last-child {
          border-bottom: none;
        }

        &::after {
          display: none;
        }
      }
    }
  }

  .charts {
    margin-top: 20px;
    width: calc(100% - 1px); // fix shaking

    .overview-chart-item {
      > div {
        padding: 12px 18px;
        width: 100%;
        height: 210px;
        min-height: inherit;
        overflow: hidden;
      }

      ${media.m} {
        > div {
          padding: 10px 12px 5px;
        }
      }
    }
  }

  .info {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    ${media.m} {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .title {
      font-size: 14px;
      font-weight: normal;
      color: #7e8598;
      line-height: 24px;
      white-space: nowrap;

      ${media.s} {
        font-size: 12px;
      }
    }

    .number {
      font-size: 18px;
      font-weight: bold;
      color: #282d30;
      display: flex;
      flex-direction: row;
      align-items: baseline;
      justify-content: flex-start;

      ${media.s} {
        font-size: 16px;
      }

      .trend {
        margin-left: 10px;
      }
    }
  }

  .info-link,
  .chart-link {
    cursor: pointer;

    &:hover {
      border-bottom: 1px solid #1e3de4;
    }
  }
`;
