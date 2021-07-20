import { Card } from '../../components/Card';
import SuccessIcon from '../../../images/balance-checker/success.png';
import { translations } from '../../../locales/i18n';
import { Card as AntdCard, Avatar } from '@jnoodle/antd';
import DateIcon from '../../../images/balance-checker/date.png';
import dayjs from 'dayjs';
import BlockIcon from '../../../images/balance-checker/block.png';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import TokenIcon from '../../../images/balance-checker/token-icon.png';
import { Text } from '../../components/Text/Loadable';
import { formatNumber, fromDripToCfx } from '../../../utils';
import { useCfxBalance } from '../../../utils/api';
import { Empty } from '../../components/Empty';

export function Result({ radioValue, resultVisible, formData }) {
  const { t, i18n } = useTranslation();
  const { data } = useCfxBalance(formData);
  const [date, setDate] = useState('');
  const [epoch, setEpoch] = useState('');
  const [balance, setBalance] = useState('');
  const [isEmpty, setIsEmpty] = useState(false);

  const setFormData = data => {
    setDate(data.epoch_dt);
    setEpoch(data.epoch);
    setBalance(fromDripToCfx(data.balance, true));
  };

  useEffect(() => {
    if (data && data.code === 0) {
      const { cfxByEpoch, cfxByDt } = data;
      setIsEmpty(false); // 重新搜索后重置isEmpty状态
      if (cfxByEpoch) {
        setFormData(cfxByEpoch);
      } else if (cfxByDt) {
        setFormData(cfxByDt);
      } else {
        setIsEmpty(true);
      }
    }
  }, [data]);

  const TokenQuantityCard = (
    <AntdCard.Meta
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
    <AntdCard.Meta
      avatar={<Avatar src={TokenIcon} />}
      title={t(translations.balanceChecker.cfxBalance)}
      description={<Text hoverValue={balance}>{balance} CFX</Text>}
    />
  );

  return (
    <ResultWrap
      // @ts-ignore
      visible={resultVisible}
    >
      <Card>
        <TopLine>
          <TopLineTitle>
            <img src={SuccessIcon} alt={''} />
            {t(translations.balanceChecker.tokenQuantityForAccountAddress)}：
          </TopLineTitle>
          <TopLineValue>{formData.accountBase32}</TopLineValue>
        </TopLine>
        {isEmpty ? (
          <Empty show={true} />
        ) : (
          <CardGroup>
            <AntdCard>
              <AntdCard.Meta
                avatar={<Avatar src={DateIcon} />}
                title={t(translations.balanceChecker.snapshotDate)}
                description={
                  i18n.language.indexOf('en') > -1
                    ? dayjs(date).format('MMM DD,YYYY')
                    : dayjs(date).format('YYYY-MM-DD')
                }
              />
            </AntdCard>
            <AntdCard>
              <AntdCard.Meta
                avatar={<Avatar src={BlockIcon} />}
                title={t(translations.balanceChecker.block)}
                description={epoch}
              />
            </AntdCard>
            <AntdCard>
              {radioValue === 1 || radioValue === 2
                ? TokenQuantityCard
                : CFXCard}
            </AntdCard>
          </CardGroup>
        )}
      </Card>
    </ResultWrap>
  );
}

const ResultWrap = styled.div`
  font-family: 'Circular Std', 'PingFang SC', -apple-system, BlinkMacSystemFont,
    'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
    'Droid Sans', 'Helvetica Neue', sans-serif;
  font-weight: 450;

  // @ts-ignore
  display: ${props => props.visible};
`;
const TopLineTitle = styled.span`
  color: #002257;

  img {
    margin-right: 4px;
  }
`;
const TopLineValue = styled.span`
  color: #97a3b4;
`;
const TopLine = styled.div`
  padding: 24px 0;
`;
const CardGroup = styled.div`
  display: flex;

  .ant-card {
    margin: 0 24px 32px 0;

    .ant-card-meta-title {
      font-size: 14px;
    }

    .ant-card-meta {
      display: flex;
      flex-direction: row-reverse;

      .ant-card-meta-avatar {
        margin-left: 24px;
        padding: 0;

        .ant-avatar {
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

      .ant-card-meta-description {
        width: 300px;

        p {
          font-weight: 450;
        }
      }
    }
  }
`;
