import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Grid } from '@cfxjs/react-ui';
import { Card } from '../../components/Card/Loadable';
import { Tooltip } from '../../components/Tooltip/Loadable';
import Balance from '../../../images/contract-address/balance.svg';
import { translations } from '../../../locales/i18n';
import { useTranslation } from 'react-i18next';
import { media } from '../../../styles/media';
import { reqCfxSupply } from '../../../utils/httpRequest';
import { formatBalance, formatNumber } from '../../../utils';

function Info(icon, title, tooltip, number) {
  return (
    <Grid xs={24} sm={8} className="info">
      <div>
        <div className="icon">
          <img src={icon} alt={title} />
        </div>
        <div className="info-content">
          <Tooltip
            hoverable
            text={
              <div
                dangerouslySetInnerHTML={{
                  __html: tooltip,
                }}
              />
            }
            placement="top"
          >
            <span className="title">{title}</span>
          </Tooltip>
          <div className="number">{number}</div>
        </div>
      </div>
    </Grid>
  );
}

export function MarketInfo() {
  const { t } = useTranslation();
  const [marketInfo, setMarketInfo] = useState<any>({});
  useEffect(() => {
    reqCfxSupply().then(res => {
      setMarketInfo(res || {});
    });
  }, []);

  // TODO icon
  return marketInfo.totalCirculating ? (
    <CardWrapper>
      <Card>
        <Grid.Container gap={3} justify="center">
          {Info(
            Balance,
            t(translations.charts.cfxPrice.title),
            t(translations.charts.cfxPrice.description),
            `$${marketInfo.price || 0}`,
          )}
          {Info(
            Balance,
            t(translations.charts.cfxMarketCap.title),
            t(translations.charts.cfxMarketCap.description),
            `$${formatNumber(marketInfo.totalPrice, {
              withUnit: false,
              keepDecimal: false,
            })}`,
          )}
          {Info(
            Balance,
            t(translations.charts.cfxCirculatingSupply.title),
            t(translations.charts.cfxCirculatingSupply.description),
            `${formatBalance(marketInfo.totalCirculating, 18, false, {
              withUnit: false,
              keepDecimal: false,
            })} CFX`,
          )}
        </Grid.Container>
      </Card>
    </CardWrapper>
  ) : null;
}

const CardWrapper = styled.div`
  margin-top: 24px;
  width: 100%;

  .info {
    > div {
      padding: 0 10px;
      width: 100%;
      display: flex;
      align-items: center;
      border-right: 1px solid #e8e9ea;

      ${media.s} {
        border-right: none;
      }

      .icon {
        width: 60px;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 60px;
        background-color: rgba(138, 130, 255, 0.06);

        img {
          width: 16px;
          height: 16px;
        }
      }

      .info-content {
        padding-left: 24px;

        .title {
          font-size: 14px;
          font-weight: normal;
          color: #7e8598;
          line-height: 24px;
        }

        .number {
          font-size: 18px;
          font-weight: bold;
          color: #282d30;
          line-height: 30px;
        }
      }
    }

    &:nth-of-type(2) {
      .icon {
        background-color: rgba(79, 158, 255, 0.06);
      }
    }

    &:nth-of-type(3) {
      .icon {
        background-color: rgba(116, 219, 88, 0.06);
      }
    }

    &:last-of-type {
      > div {
        border-right: none;
      }
    }
  }
`;
