import React from 'react';
import { Row, Col } from '@cfxjs/sirius-next-common/dist/components/Grid';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StyledChartPreviewWrapper } from '../common/StyledChartPreviewWrapper';

import { DailyCFXTransfer } from './DailyCFXTransfer';
import { DailyCFXTransferCount } from './DailyCFXTransferCount';

export function Chart() {
  const { t } = useTranslation();

  return (
    <StyledChartPreviewWrapper>
      <PageHeader
        subtitle={t(translations.highcharts.crossSpace.preview.subtitle)}
      >
        {t(translations.highcharts.crossSpace.preview.title)}
      </PageHeader>
      <Row justify="space-between">
        <Col>
          <div className="tip">
            {t(translations.highcharts.crossSpace.preview.tip)}
          </div>
        </Col>
      </Row>
      <Row gutter={[20, 20]}>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <DailyCFXTransfer preview={true} />
        </Col>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <DailyCFXTransferCount preview={true} />
        </Col>
      </Row>
    </StyledChartPreviewWrapper>
  );
}
