import React from 'react';
import { Row, Col } from '@cfxjs/antd';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StyledChartPreviewWrapper } from '../common/StyledChartPreviewWrapper';

import { CumulativeCFXBurn } from './CumulativeCFXBurn';
import { BreakdownByTypes } from './BreakdownByTypes';
import { StatisticsDatas } from './StatisticsData';
import { CFXDailyBurn } from './CFXDailyBurn';
import { BurntRateInDaoVoting } from './BurntRateInDaoVoting';

export function Chart() {
  const { t } = useTranslation();

  return (
    <StyledChartPreviewWrapper>
      <PageHeader
        subtitle={t(translations.highcharts.burntFeesAnalysis.preview.subtitle)}
      >
        {t(translations.highcharts.burntFeesAnalysis.preview.title)}
      </PageHeader>

      <Row gutter={[20, 20]}>
        <Col xxl={8} xl={8} lg={7} md={24} sm={24} xs={24}>
          <StatisticsDatas />
        </Col>
        <Col xxl={16} xl={16} lg={16} md={24} sm={24} xs={24}>
          <BreakdownByTypes />
        </Col>
        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
          <CumulativeCFXBurn />
        </Col>
        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
          <CFXDailyBurn />
        </Col>
        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
          <BurntRateInDaoVoting />
        </Col>
      </Row>
    </StyledChartPreviewWrapper>
  );
}
