import React from 'react';
import { Translation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ContentWrapper } from '../utils';
import lodash from 'lodash';
import { fromDripToCfx } from 'utils';
import { Text } from 'app/components/Text/Loadable';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';

export const totalIncoming = {
  title: (
    <ContentWrapper right>
      <Translation>
        {t => t(translations.pos.incomingRank.totalIncoming)}
      </Translation>
    </ContentWrapper>
  ),
  dataIndex: 'totalReward',
  key: 'totalReward',
  width: 1,
  render: value => {
    return (
      <ContentWrapper right>
        {!lodash.isNil(value) ? (
          <Text span hoverValue={`${fromDripToCfx(value, true)} CFX`}>
            {`${fromDripToCfx(value)} CFX`}
          </Text>
        ) : (
          '--'
        )}
      </ContentWrapper>
    );
  },
};

export const accountId = {
  title: (
    <ContentWrapper>
      <Translation>
        {t => t(translations.pos.incomingRank.rewardRank.id)}
      </Translation>
    </ContentWrapper>
  ),
  dataIndex: 'accountId',
  key: 'accountId',
  width: 1,
  render: value => {
    return <ContentWrapper>{value}</ContentWrapper>;
  },
};

export const day = (number: number | 'all') => {
  const dataIndex = number === 'all' ? 'all' : `day${number}`;
  return {
    title: (
      <ContentWrapper right>
        {number === 'all' ? (
          <Translation>
            {t => t(translations.pos.incomingRank.rewardRank.all)}
          </Translation>
        ) : (
          // @ts-ignore
          <Trans i18nKey="pos.incomingRank.rewardRank.day" count={number}>
            {/* @ts-ignore */}
            {{ number }} Day
          </Trans>
        )}
      </ContentWrapper>
    ),
    dataIndex: dataIndex,
    key: dataIndex,
    width: 1,
    render: (_, row) => {
      const cfx = fromDripToCfx(
        number === 'all' ? row.accountInfo?.totalReward : row[`day${number}`],
      );

      return (
        <ContentWrapper right>
          <StyledDayWrapper>
            {cfx !== '0' && <PlusOutlined className="icon" />}
            {cfx}
          </StyledDayWrapper>
        </ContentWrapper>
      );
    },
  };
};

const StyledDayWrapper = styled.div`
  display: inline-flex;
  align-items: center;

  .icon {
    font-size: 10px;
    font-weight: bold;
    margin-right: 1px;
  }
`;
