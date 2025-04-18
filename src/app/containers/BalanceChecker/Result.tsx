import { translations } from 'locales/i18n';
import { Avatar } from '@cfxjs/sirius-next-common/dist/components/Avatar';
import { Card, Meta } from '@cfxjs/sirius-next-common/dist/components/Card';
import { Spin } from '@cfxjs/sirius-next-common/dist/components/Spin';
import DateIcon from '../../../images/balance-checker/date.png';
import dayjs from 'dayjs';
import BlockIcon from '../../../images/balance-checker/block.png';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import TokenIcon from '../../../images/balance-checker/token-icon.png';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
import { formatNumber } from '../../../utils';
import { useCfxBalance } from '../../../utils/api';
import { fromDripToCfx } from '@cfxjs/sirius-next-common/dist/utils';

const isToday = require('dayjs/plugin/isToday');
dayjs.extend(isToday);

export function Result({ radioValue, resultVisible, formData }) {
  const { t, i18n } = useTranslation();
  const { data } = useCfxBalance(formData);
  const [date, setDate] = useState('');
  const [epoch, setEpoch] = useState('');
  const [balance, setBalance] = useState('');
  const [hoverBalance, setHoverBalance] = useState('');
  const [loading, setLoading] = useState(true);

  const setResultData = data => {
    setDate(data.epoch_dt);
    setEpoch(data.epoch);
    setBalance(
      fromDripToCfx(data.balance, false, { precision: 6, withUnit: false }),
    );
    setHoverBalance(fromDripToCfx(data.balance, true));
  };
  const initResult = () => {
    setDate('');
    setEpoch('');
    setBalance('');
    setHoverBalance('');
    setLoading(true);
  };
  const formatDate = date => {
    return i18n.language.indexOf('en') > -1
      ? dayjs(date).format('MMM DD,YYYY')
      : dayjs(date).format('YYYY-MM-DD');
  };
  useEffect(() => {
    initResult();
    try {
      const { cfxByEpoch, cfxByDt } = data || {};
      if (cfxByEpoch || cfxByDt) {
        if (cfxByEpoch) {
          setResultData({
            ...cfxByEpoch,
            epoch_dt: formData.dt === '' ? cfxByEpoch.epoch_dt : formData.dt,
          });
        } else if (cfxByDt) {
          setResultData({
            ...cfxByDt,
            // @ts-ignore
            epoch_dt: dayjs(formData.dt).isToday()
              ? formData.dt
              : dayjs(formData.dt).add(1, 'day').toString(),
          });
        } else {
          setResultData({
            epoch_dt: '--',
            epoch: '--',
            balance: 0,
          });
        }
        setLoading(false);
      } else {
        setResultData({
          epoch_dt: '--',
          epoch: '--',
          balance: 0,
        });
        setLoading(false);
      } // eslint-disable-next-line react-hooks/exhaustive-deps
    } catch (e) {
      setResultData({
        epoch_dt: '--',
        epoch: '--',
        balance: 0,
      });
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const TokenQuantityCard = (
    <Meta
      avatar={<Avatar src={TokenIcon} />}
      title={t(translations.balanceChecker.tokenQuantity)}
      description={
        // todo 添加单位
        <Text hoverValue={'9441614704711111.123456789'}>
          {formatNumber('9441614704711111.123456789', {
            precision: 6,
            withUnit: false,
          })}
        </Text>
      }
    />
  );
  const CFXCard = (
    <Meta
      avatar={<Avatar src={TokenIcon} />}
      title={t(translations.balanceChecker.cfxBalance)}
      description={
        loading ? (
          <Spin />
        ) : (
          <Text hoverValue={hoverBalance}>{balance} CFX</Text>
        )
      }
    />
  );

  return (
    <ResultWrap
      // @ts-ignore
      visible={resultVisible}
    >
      <CardGroup>
        <Card>
          <Meta
            avatar={<Avatar src={DateIcon} />}
            title={t(translations.balanceChecker.snapshotDate)}
            description={
              loading ? <Spin /> : date === '--' ? date : formatDate(date)
            }
          />
        </Card>
        <Card>
          <Meta
            avatar={<Avatar src={BlockIcon} />}
            title={t(translations.balanceChecker.epoch)}
            description={loading ? <Spin /> : epoch}
          />
        </Card>
        <Card>
          {radioValue === '1' || radioValue === '2'
            ? TokenQuantityCard
            : CFXCard}
        </Card>
      </CardGroup>
    </ResultWrap>
  );
}

const ResultWrap = styled.div<{ visible: string }>`
  font-family: 'Circular Std', 'PingFang SC', -apple-system, BlinkMacSystemFont,
    'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
    'Droid Sans', 'Helvetica Neue', sans-serif;
  font-weight: 450;

  // @ts-ignore
  display: ${props => props.visible};
`;
const CardGroup = styled.div`
  display: flex;

  .sirius-card {
    margin: 0 24px 32px 0;

    .sirius-meta-title {
      font-size: 14px;
    }

    .sirius-meta {
      display: flex;
      flex-direction: row-reverse;

      .sirius-meta-avatar {
        margin-left: 24px;
        padding: 0;

        .sirius-avatar {
          width: 48px;
          height: 48px;
          background: #f5f6fa;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: 60%;
            height: 60%;
          }
        }
      }

      .sirius-meta-description {
        width: 250px;

        p {
          font-weight: 450;
        }
      }
    }
  }
`;
