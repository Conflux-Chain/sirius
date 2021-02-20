import React from 'react';
import dayjs from 'dayjs';
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
// TODO antd slimming
import '../../../styles/antd.custom.css';
import { media } from '../../../styles/media';

interface RouteParams {
  statsType: string;
}

export function Statistics() {
  const { t, i18n } = useTranslation();
  const iszh = i18n.language.includes('zh');
  const { statsType } = useParams<RouteParams>();
  const history = useHistory();

  let { span = '7d' } = queryString.parse(window.location.search);

  if (!['24h', '3d', '7d'].includes(span + '')) span = '7d';

  const title = t(translations.statistics.statistics);

  const tabsChange = val => {
    if (val !== statsType) {
      history.push(`/statistics/${val}`);
    }
  };
  const spanChange = val => {
    if (val !== span) {
      history.push(`/statistics/${statsType}?span=${val}`);
    }
  };
  const renderDateRange = span => {
    let begin = '';
    let end = '';
    const dateFormat = iszh ? 'M月D日' : 'DD MMM';
    switch (span) {
      case '24h':
        begin = dayjs().add(-1, 'day').format(dateFormat);
        end = dayjs().format(dateFormat);
        break;
      case '3d':
        begin = dayjs().add(-3, 'day').format(dateFormat);
        end = dayjs().format(dateFormat);
        break;
      case '7d':
        begin = dayjs().add(-7, 'day').format(dateFormat);
        end = dayjs().format(dateFormat);
        break;
      default:
        break;
    }
    return `${begin} - ${end}`;
  };
  const spanButtons = span => {
    return (
      <SpanButtonsWrapper>
        <span
          className={`btn ${span === '24h' ? 'active' : ''}`}
          onClick={() => spanChange('24h')}
        >
          {t(translations.statistics.span['24h'])}
        </span>
        <span
          className={`btn ${span === '3d' ? 'active' : ''}`}
          onClick={() => spanChange('3d')}
        >
          {t(translations.statistics.span['3d'])}
        </span>
        <span
          className={`btn ${span === '7d' ? 'active' : ''}`}
          onClick={() => spanChange('7d')}
        >
          {t(translations.statistics.span['7d'])}
        </span>
        <span className="date">{renderDateRange(span)}</span>
      </SpanButtonsWrapper>
    );
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
            {spanButtons(span)}
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
          </CardWrapper>
        </Tabs.Item>
        <Tabs.Item label={t(translations.statistics.tokens)} value="tokens">
          <CardWrapper>
            {spanButtons(span)}
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

const SpanButtonsWrapper = styled.div`
  width: 100%;
  padding: 3px;
  margin-bottom: 12px;

  span {
    font-size: 12px;
    line-height: 16px;
    color: #74798c;
  }

  span.btn {
    padding: 3px 16px;
    background: rgba(30, 61, 228, 0.04);
    border-radius: 16px;
    margin-right: 5px;
    cursor: pointer;

    &.active,
    &:hover,
    &:focus {
      color: #fff;
      background: rgba(30, 61, 228, 0.8);
    }
  }

  span.date {
    float: right;
  }

  ${media.s} {
    span.date {
      display: block;
      float: none;
      margin-top: 8px;
      text-align: right;
      width: 100%;
    }
  }
`;
