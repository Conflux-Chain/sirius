import React from 'react';
import styled from 'styled-components/macro';
import { Helmet } from 'react-helmet-async';
import { LineChart as Chart, PieChart } from '../../components/Chart/Loadable';
import { media } from 'styles/media';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { Row, Col } from '@jnoodle/antd';
import { Link } from 'react-router-dom';

export function Charts() {
  const { t } = useTranslation();
  const clientWidth = document.body.clientWidth;
  let chartWidth = clientWidth - 36;

  if (chartWidth > 1368) chartWidth = 1368;
  if (chartWidth < 365) chartWidth = 365;

  return (
    <>
      <Helmet>
        <title>{t(translations.charts.title)}</title>
        <meta name="description" content={t(translations.charts.description)} />
      </Helmet>
      <PageWrap>
        <HeaderWrap>
          <div className="title">{t(translations.charts.subtitle1)}</div>
        </HeaderWrap>
        <ChartsWrap>
          <Row gutter={[24, 24]}>
            <Col span={24} sm={12} lg={8}>
              <Link to="/chart/circulating">
                <PieChart
                  width={chartWidth}
                  indicator="circulating"
                  isThumb={true}
                />
              </Link>
            </Col>
            <Col span={24} sm={12} lg={8}>
              <Link to="/chart/issued">
                <PieChart
                  width={chartWidth}
                  indicator="issued"
                  isThumb={true}
                />
              </Link>
            </Col>
          </Row>
        </ChartsWrap>
        <HeaderWrap>
          <div className="title">{t(translations.charts.subtitle2)}</div>
        </HeaderWrap>
        <ChartsWrap>
          <Row gutter={[24, 24]}>
            <Col span={24} sm={12} lg={8}>
              <Link to="/chart/blockTime">
                <Chart
                  width={chartWidth}
                  indicator="blockTime"
                  isThumb={true}
                />
              </Link>
            </Col>
            <Col span={24} sm={12} lg={8}>
              <Link to="/chart/tps">
                <Chart width={chartWidth} indicator="tps" isThumb={true} />
              </Link>
            </Col>
            <Col span={24} sm={12} lg={8}>
              <Link to="/chart/difficulty">
                <Chart
                  width={chartWidth}
                  indicator="difficulty"
                  isThumb={true}
                />
              </Link>
            </Col>
            <Col span={24} sm={12} lg={8}>
              <Link to="/chart/hashRate">
                <Chart width={chartWidth} indicator="hashRate" isThumb={true} />
              </Link>
            </Col>
          </Row>
        </ChartsWrap>
        <HeaderWrap>
          <div className="title">{t(translations.charts.subtitle3)}</div>
        </HeaderWrap>
        <ChartsWrap>
          <Row gutter={[24, 24]}>
            <Col span={24} sm={12} lg={8}>
              <Link to="/chart/dailyTransaction">
                <Chart
                  width={chartWidth}
                  indicator="dailyTransaction"
                  isThumb={true}
                />
              </Link>
            </Col>
            <Col span={24} sm={12} lg={8}>
              <Link to="/chart/dailyTransactionCFX">
                <Chart
                  width={chartWidth}
                  indicator="dailyTransactionCFX"
                  isThumb={true}
                />
              </Link>
            </Col>
            <Col span={24} sm={12} lg={8}>
              <Link to="/chart/dailyTransactionTokens">
                <Chart
                  width={chartWidth}
                  indicator="dailyTransactionTokens"
                  isThumb={true}
                />
              </Link>
            </Col>
          </Row>
        </ChartsWrap>
        <HeaderWrap>
          <div className="title">{t(translations.charts.subtitle4)}</div>
        </HeaderWrap>
        <ChartsWrap>
          <Row gutter={[24, 24]}>
            <Col span={24} sm={12} lg={8}>
              <Link to="/chart/cfxHoldingAccounts">
                <Chart
                  width={chartWidth}
                  indicator="cfxHoldingAccounts"
                  isThumb={true}
                />
              </Link>
            </Col>
            <Col span={24} sm={12} lg={8}>
              <Link to="/chart/accountGrowth">
                <Chart
                  width={chartWidth}
                  indicator="accountGrowth"
                  isThumb={true}
                />
              </Link>
            </Col>
          </Row>
        </ChartsWrap>
      </PageWrap>
    </>
  );
}

const ChartsWrap = styled.div`
  .ant-row {
    margin-bottom: 24px;

    a {
      display: block;
      width: 100%;

      canvas {
        cursor: pointer;
      }

      > div {
        transition: 0.3s all;

        &:hover {
          box-shadow: 0.8571rem 0.5714rem 1.7143rem -0.8571rem rgba(20, 27, 50, 0.24);
          transform: translateY(-5px);
          ${media.s} {
            transform: none;
          }
        }
      }
    }
  }
`;

const PageWrap = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px 0 8px;
  ${media.s} {
    padding: 32px 0;
  }
`;

const HeaderWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.1429rem;
  padding: 0;

  .subtitle {
    font-size: 1rem;
    color: #7e8598;
    line-height: 1.7143rem;
    margin-bottom: 0.8571rem;
  }
  .title {
    font-size: 1.7143rem;
    font-weight: 700;
    color: #1a1a1a;
    line-height: 2.2857rem;
  }
`;
