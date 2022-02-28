import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Grid } from '@cfxjs/react-ui';
import { useTranslation } from 'react-i18next';
import { Card } from 'app/components/Card/Loadable';
import { translations } from 'locales/i18n';
import { media } from 'styles/media';
import { formatBalance, formatTimeStamp } from 'utils';
import { reqHomeDashboardOfPOSSummary } from 'utils/httpRequest';
import lodash from 'lodash';
import { InfoIconWithTooltip } from 'app/components/InfoIconWithTooltip';

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
  const [POSSummaryInfo, setPOSSummaryInfo] = useState<any>({});

  useEffect(() => {
    reqHomeDashboardOfPOSSummary()
      .then(res => setPOSSummaryInfo(res))
      .catch(e => {
        console.error('get pos homepage summary info error: ', e);
      });
  }, [timestamp]);

  return (
    <CardWrapper>
      <Card className="homepage-info-pos">
        <Grid.Container
          gap={1}
          justify="flex-start"
          className="stats-container"
        >
          <Grid xs={24} sm={24} md={3.2}>
            {Info(
              t(translations.statistics.pos.currentBlockNumber),
              POSSummaryInfo.latestCommitted,
            )}
          </Grid>
          <Grid xs={24} sm={24} md={2.6}>
            {Info(
              t(translations.statistics.pos.totalLocked),
              formatBalance(POSSummaryInfo.totalPosStakingTokens),
            )}
          </Grid>
          <Grid xs={24} sm={24} md={3.5}>
            {Info(
              <InfoIconWithTooltip info={t(translations.statistics.pos.apyTip)}>
                {t(translations.statistics.pos.apy)}
              </InfoIconWithTooltip>,
              lodash.isNil(POSSummaryInfo.apy)
                ? '--'
                : String(POSSummaryInfo.apy).substr(0, 4) + '%',
            )}
          </Grid>
          <Grid xs={24} sm={24} md={3.5}>
            {Info(
              t(translations.statistics.pos.totalInterest),
              formatBalance(POSSummaryInfo.totalPosRewardDrip),
            )}
          </Grid>
          <Grid xs={24} sm={24} md={5.2}>
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
          <Grid xs={24} sm={24} md={2.5}>
            {Info(
              t(translations.statistics.pos.totalAccountCount),
              POSSummaryInfo.posAccountCount,
            )}
          </Grid>
          <Grid xs={24} sm={24} md={2.5}>
            {Info(
              t(translations.statistics.pos.votingBlock),
              POSSummaryInfo.latestVoted,
            )}
          </Grid>
        </Grid.Container>
      </Card>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  margin-top: 20px;
  margin-bottom: 16px;
  width: 100%;

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

  .stats-container {
    padding: 12px 0;

    ${media.m} {
      padding: 0;
    }

    > .item {
      &:nth-child(2),
      &:nth-child(5) {
        border-right: 1px solid #e8e9ea;
      }

      &:nth-child(3),
      &:nth-child(6) {
        padding-left: 3rem;
      }

      ${media.m} {
        max-width: 100%;
        border-right: none !important;
        padding-left: 0 !important;
        border-bottom: 1px solid #e8e9ea;

        &:last-child {
          border-bottom: none;
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

  .pos-block-timestamp {
    font-size: 12px;
    color: #999999;
    padding-left: 10px;
  }
`;
