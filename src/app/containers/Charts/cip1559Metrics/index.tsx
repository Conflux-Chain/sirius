import React from 'react';
import { Row, Col } from '@cfxjs/sirius-next-common/dist/components/Grid';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StyledChartPreviewWrapper } from '../common/StyledChartPreviewWrapper';

import { BaseFeePerBlock } from './BaseFeePerBlock';
import { AveragePriorityFeePerBlock } from './AveragePriorityFeePerBlock';
import { GasUsedPerBlock } from './GasUsedPerBlock';
import { PercentageOfTxTypeInBlock } from './PercentageOfTxTypeInBlock';

export function Chart() {
  const { t } = useTranslation();

  return (
    <StyledChartPreviewWrapper>
      <PageHeader
        subtitle={t(
          translations.highcharts.burntFeesAnalysis['CIP-1559MetricsTips'],
        )}
      >
        {t(translations.highcharts.burntFeesAnalysis['CIP-1559Metrics'])}
      </PageHeader>

      <Row gutter={[20, 20]}>
        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
          <BaseFeePerBlock />
        </Col>
        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
          <AveragePriorityFeePerBlock />
        </Col>
        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
          <GasUsedPerBlock />
        </Col>
        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
          <PercentageOfTxTypeInBlock />
        </Col>
      </Row>
    </StyledChartPreviewWrapper>
  );
}
