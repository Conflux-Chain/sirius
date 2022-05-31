import React from 'react';
import { Row, Col, Divider } from '@cfxjs/antd';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import moment from 'moment';

import { StyledChartPreviewWrapper } from '../common/StyledChartPreviewWrapper';
import { BlockTime } from './BlockTime';
import { TPS } from './TPS';
import { HashRate } from './HashRate';
import { TotalSupply } from './TotalSupply';
import { CirculatingSupply } from './CirculatingSupply';
import { Difficulty } from './Difficulty';
import { Tx } from './Tx';
import { CFXTransfer } from './CFXTransfer';
import { TokenTransfer } from './TokenTransfer';
import { CFXHolderAccounts } from './CFXHolderAccounts';
import { AccountGrowth } from './AccountGrowth';
import { ActiveAccounts } from './ActiveAccounts';
import { Contracts } from './Contracts';

export function Chart() {
  const { t, i18n } = useTranslation();
  const iszh = i18n.language.includes('zh');

  const format = iszh ? 'YYYY MMMDD' : 'DD MMM YYYY';
  const current = moment().subtract(1, 'day');
  const oneMonthBefore = current.subtract(30, 'day');

  return (
    <StyledChartPreviewWrapper>
      <PageHeader subtitle={t(translations.highcharts.pow.preview.subtitle)}>
        {t(translations.highcharts.pow.preview.title)}
      </PageHeader>
      <Row justify="space-between">
        <Col>
          <div className="tip">
            {t(translations.highcharts.pow.preview.tip)}
          </div>
        </Col>
        <Col>
          <div className="duration">
            {oneMonthBefore.format(format)} - {current.format(format)}
          </div>
        </Col>
      </Row>
      <Row gutter={[20, 20]}>
        <Divider orientation="left">
          {t(translations.highcharts.pow.preview.marketData)}
        </Divider>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <TotalSupply preview={true} />
        </Col>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <CirculatingSupply preview={true} />
        </Col>
        <Divider orientation="left">
          {t(translations.highcharts.pow.preview.blockchainData)}
        </Divider>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <BlockTime preview={true} />
        </Col>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <TPS preview={true} />
        </Col>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <HashRate preview={true} />
        </Col>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <Difficulty preview={true} />
        </Col>
        <Divider orientation="left">
          {t(translations.highcharts.pow.preview.transaction)}
        </Divider>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <Tx preview={true} />
        </Col>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <TokenTransfer preview={true} />
        </Col>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <CFXTransfer preview={true} />
        </Col>
        <Divider orientation="left">
          {t(translations.highcharts.pow.preview.account)}
        </Divider>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <CFXHolderAccounts preview={true} />
        </Col>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <AccountGrowth preview={true} />
        </Col>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <ActiveAccounts preview={true} />
        </Col>
        <Divider orientation="left">
          {t(translations.highcharts.pow.preview.contracts)}
        </Divider>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
          <Contracts preview={true} />
        </Col>
      </Row>
    </StyledChartPreviewWrapper>
  );
}
