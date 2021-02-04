import React from 'react';
import { Card } from '../../components/Card';
import { Tabs } from '../../components/Tabs';
import { Col, Row } from 'antd';
import { StatsCard } from '../../components/StatsCard/Loadable';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { translations } from '../../../locales/i18n';
import { Helmet } from 'react-helmet-async';
import { PageHeader } from '../../components/PageHeader/Loadable';
import styled from 'styled-components/macro';
import queryString from 'query-string';
import { StatsType } from '../../components/StatsCard';

interface RouteParams {
  statsType: string;
}

export function Statistics() {
  const { t } = useTranslation();
  const { statsType } = useParams<RouteParams>();
  const history = useHistory();

  let { span = '7d' } = queryString.parse(window.location.search);

  if (!['24h', '3d', '7d'].includes(span + '')) span = '7d';

  const title = t(translations.statistics.statistics);

  const tabsChange = val => {
    if (val !== statsType) {
      history.push('/statistics/' + val);
    }
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={t(title)} />
      </Helmet>
      <StyledPageHeaderWrapper>
        <PageHeader>{title}</PageHeader>
      </StyledPageHeaderWrapper>
      <TabsWrapper initialValue={statsType} onChange={tabsChange}>
        <Tabs.Item
          label={t(translations.statistics.transactions)}
          value="transactions"
        >
          <CardWrapper>
            <Row gutter={[24, 24]}>
              <Col span={24} lg={12}>
                <StatsCard
                  span={span as string}
                  type={StatsType.topTxnCountSent}
                />
              </Col>
              <Col span={24} lg={12}>
                <StatsCard
                  span={span as string}
                  type={StatsType.topTxnCountReceived}
                />
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <Col span={24} lg={12}>
                <StatsCard span={span as string} type={StatsType.topCFXSend} />
              </Col>
              <Col span={24} lg={12}>
                <StatsCard
                  span={span as string}
                  type={StatsType.topCFXReceived}
                />
              </Col>
            </Row>
          </CardWrapper>
        </Tabs.Item>
        <Tabs.Item label={t(translations.statistics.tokens)} value="tokens">
          <CardWrapper>
            <Row gutter={[24, 24]}>
              <Col span={24} lg={12}>
                <StatsCard
                  span={span as string}
                  type={StatsType.topTokensBySenders}
                />
              </Col>
              <Col span={24} lg={12}>
                <StatsCard
                  span={span as string}
                  type={StatsType.topTokensByReceivers}
                />
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <Col span={24} lg={12}>
                <StatsCard
                  span={span as string}
                  type={StatsType.topTokensByTxnCount}
                />
              </Col>
              <Col span={24} lg={12}>
                <StatsCard
                  span={span as string}
                  type={StatsType.topTokensByTxnAccountsCount}
                />
              </Col>
            </Row>
          </CardWrapper>
        </Tabs.Item>
      </TabsWrapper>
    </>
  );
}

const StyledPageHeaderWrapper = styled.div`
  margin-top: 32px;
  > div {
    margin-bottom: 12px;
  }
`;

const TabsWrapper = styled(Tabs)`
  margin-bottom: 32px;
`;

const CardWrapper = styled(Card)`
  padding: 18px 18px 0 !important;
`;
