import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Row, Col } from '@cfxjs/sirius-next-common/dist/components/Grid';
import { useTranslation } from 'react-i18next';
import { StyledCard as Card } from '@cfxjs/sirius-next-common/dist/components/Card';
import { translations } from 'locales/i18n';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';
import { formatBalance, formatTimeStamp } from 'utils';
import { reqHomeDashboardOfPOSSummary } from 'utils/httpRequest';
import lodash from 'lodash';
import { InfoIconWithTooltip } from '@cfxjs/sirius-next-common/dist/components/InfoIconWithTooltip';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import BigNumber from 'bignumber.js';

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
        <Row gutter={[8, 8]} justify="start" className="stats-container">
          <Col xs={24} sm={24} lg2={3.2}>
            {Info(
              t(translations.statistics.pos.currentBlockNumber),
              POSSummaryInfo.latestCommitted,
            )}
          </Col>
          <Col xs={24} sm={24} lg2={3}>
            {Info(
              t(translations.statistics.pos.votingBlock),
              POSSummaryInfo.latestVoted,
            )}
          </Col>
          <Col xs={24} sm={24} lg2={2}>
            {Info(
              <Link href="/pos-charts/daily-accounts" className="info-link">
                {t(translations.statistics.pos.totalAccountCount)}
              </Link>,
              POSSummaryInfo.posAccountCount,
            )}
          </Col>
          <Col xs={24} sm={24} lg2={3.5}>
            {Info(
              <Link href="/pos-charts/daily-staking" className="info-link">
                {t(translations.statistics.pos.totalLocked)}
              </Link>,
              formatBalance(POSSummaryInfo.totalPosStakingTokens),
            )}
          </Col>
          <Col xs={24} sm={24} lg2={2.5}>
            {Info(
              <InfoIconWithTooltip
                info={t(translations.statistics.pos.apyTip, {
                  rate1: new BigNumber(POSSummaryInfo.baseR).toFixed(1),
                  rate2: new BigNumber(POSSummaryInfo.baseR)
                    .multipliedBy(2)
                    .toFixed(1),
                  rate3: new BigNumber(POSSummaryInfo.baseR)
                    .multipliedBy(3)
                    .toFixed(1),
                })}
              >
                <Link href="/pos-charts/daily-apy" className="info-link">
                  {t(translations.statistics.pos.apy)}
                </Link>
              </InfoIconWithTooltip>,
              lodash.isNil(POSSummaryInfo.apy)
                ? '--'
                : String(POSSummaryInfo.apy).substr(0, 4) + '%',
            )}
          </Col>
          <Col xs={24} sm={24} lg2={3.5}>
            {Info(
              <Link href="/pos-charts/total-reward" className="info-link">
                {t(translations.statistics.pos.totalInterest)}
              </Link>,
              formatBalance(POSSummaryInfo.totalPosRewardDrip),
            )}
          </Col>
          <Col xs={24} sm={24} lg2={5.2}>
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
          </Col>
        </Row>
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

    > .sirius-col {
      &:nth-child(3),
      &:nth-child(5) {
        border-right: 1px solid #e8e9ea;
      }

      &:nth-child(4),
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
