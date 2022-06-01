import React from 'react';
import { Row, Col, Divider } from '@cfxjs/antd';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import moment from 'moment';
import { StyledChartPreviewWrapper } from '../common/StyledChartPreviewWrapper';

import { FinalizedInterval } from './FinalizedInterval';
import { DailyAccounts } from './DailyAccounts';
import { DailyStaking } from './DailyStaking';
import { DailyAPY } from './DailyAPY';
import { TotalReward } from './TotalReward';
import { DailyRewardRank } from './DailyRewardRank';
import { DailyDeposit } from './DailyDeposit';

export function Chart() {
  const { t, i18n } = useTranslation();
  const iszh = i18n.language.includes('zh');

  const format = iszh ? 'YYYY MMMDD' : 'DD MMM YYYY';
  const current = moment().subtract(1, 'day');
  const oneMonthBefore = current.subtract(30, 'day');

  return (
    <StyledChartPreviewWrapper>
      <PageHeader subtitle={t(translations.highcharts.pos.preview.subtitle)}>
        {t(translations.highcharts.pos.preview.title)}
      </PageHeader>
      <Row justify="space-between">
        <Col>
          <div className="tip">
            {t(translations.highcharts.pos.preview.tip)}
          </div>
        </Col>
        <Col>
          <div className="duration">
            {oneMonthBefore.format(format)} - {current.format(format)}
          </div>
        </Col>
      </Row>
      <Row gutter={[20, 20]}>
        {/* <Divider orientation="left">
          {t(translations.highcharts.pos.preview.finalizedInterval)}
        </Divider> */}
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <FinalizedInterval preview={true} />
        </Col>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <DailyAccounts preview={true} />
        </Col>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <DailyStaking preview={true} />
        </Col>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <DailyAPY preview={true} />
        </Col>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <TotalReward preview={true} />
        </Col>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <DailyRewardRank preview={true} />
        </Col>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <DailyDeposit preview={true} />
        </Col>
      </Row>
    </StyledChartPreviewWrapper>
  );
}
