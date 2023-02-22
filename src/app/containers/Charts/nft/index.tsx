import React from 'react';
import { Row, Col /*, Divider */ } from '@cfxjs/antd';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StyledChartPreviewWrapper } from '../common/StyledChartPreviewWrapper';

import { Assets } from './Assets';
import { Holders } from './Holders';
import { Contracts } from './Contracts';
import { Transfers } from './Transfers';

export function Chart() {
  const { t } = useTranslation();

  return (
    <StyledChartPreviewWrapper>
      <PageHeader subtitle={t(translations.highcharts.nft.preview.subtitle)}>
        {t(translations.highcharts.nft.preview.title)}
      </PageHeader>
      <Row justify="space-between">
        <Col>
          <div className="tip">
            {t(translations.highcharts.nft.preview.tip)}
          </div>
        </Col>
      </Row>
      <Row gutter={[20, 20]}>
        {/* <Divider orientation="left">
          {t(translations.highcharts.nft.preview.finalizedInterval)}
        </Divider> */}
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <Assets preview={true} />
        </Col>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <Holders preview={true} />
        </Col>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <Contracts preview={true} />
        </Col>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <Transfers preview={true} />
        </Col>
      </Row>
    </StyledChartPreviewWrapper>
  );
}
