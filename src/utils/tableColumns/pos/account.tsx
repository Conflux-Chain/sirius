import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { toThousands, fromDripToCfx, formatNumber } from 'utils';
import { ContentWrapper } from '../utils';
import { Text } from 'app/components/Text/Loadable';
import lodash from 'lodash';
import { PoSAddressContainer } from 'app/components/AddressContainer/Loadable';
import VotingPowerIcon from 'images/voting-power.svg';
import IsActiveIcon from 'images/is-active.svg';
import NotActiveIcon from 'images/not-active.svg';
import ElectedIcon from 'images/elected.svg';
import NotElectedIcon from 'images/not-elected.svg';
import styled from 'styled-components';
import { Tooltip } from '@cfxjs/antd';
import dayjs from 'dayjs';
import { CountDown } from 'app/components/CountDown';
import { CopyButton } from 'app/components/CopyButton';

export const rank = {
  title: (
    <Translation>{t => t(translations.accounts.table.number)}</Translation>
  ),
  dataIndex: 'rank',
  key: 'rank',
  render: value => {
    return '#' + value;
  },
};

const PosNodeAddressWrapper = styled.div`
  display: flex;
  gap: 8px;
`;
export const posNodeAddress = {
  title: (
    <Translation>
      {t => t(translations.pos.accounts.posNodeAddress)}
    </Translation>
  ),
  dataIndex: 'hex',
  key: 'hex',
  width: 1,
  render: (value, row) => {
    return lodash.isNil(value) ? (
      '--'
    ) : (
      <PosNodeAddressWrapper>
        <PoSAddressContainer
          alias={row.byte32NameTagInfo?.nameTag}
          value={value}
        />
        <CopyButton copyText={value} />
      </PosNodeAddressWrapper>
    );
  },
};

const VotingPowerWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  span {
    display: inline-block;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
export const votingPower = {
  title: (
    <Translation>{t => t(translations.pos.accounts.votingPower)}</Translation>
  ),
  dataIndex: 'availableVotesInCfx',
  key: 'availableVotesInCfx',
  width: 1,
  render: value => {
    const power = toThousands(
      formatNumber(value, { keepDecimal: false, withUnit: false }),
    );
    return lodash.isNil(value) ? (
      '--'
    ) : (
      <VotingPowerWrapper>
        <IconWrapper src={VotingPowerIcon} alt="" />
        <Tooltip title={`${power} CFX`}>{power} CFX</Tooltip>
      </VotingPowerWrapper>
    );
  },
};

const ActiveWrapper = styled.div<{
  isActive?: boolean;
}>`
  color: ${({ isActive }) => (isActive ? '#4AC2AB' : '#FA5D5D')};
`;
export const active = {
  title: (
    <Tooltip
      title={
        <Translation>
          {t => t(translations.pos.accounts.hover.active)}
        </Translation>
      }
    >
      <span>
        <Translation>{t => t(translations.pos.accounts.active)}</Translation>
      </span>
    </Tooltip>
  ),
  dataIndex: 'forceRetired',
  key: 'forceRetired',
  width: 1,
  render: value => {
    const notActive = value > 0;
    return (
      <ActiveWrapper isActive={!notActive}>
        <IconWrapper src={notActive ? NotActiveIcon : IsActiveIcon} alt="" />
        <Translation>
          {t =>
            t(translations.pos.accounts[notActive ? 'notActive' : 'isActive'])
          }
        </Translation>
      </ActiveWrapper>
    );
  },
};

const CommitteeMemberWrapper = styled.div<{
  elected?: boolean;
}>`
  color: ${({ elected }) => (elected ? '#4AC2AB' : '#282D30')};
`;
export const committeeMember = {
  title: (
    <Tooltip
      title={
        <Translation>
          {t => t(translations.pos.accounts.hover.committeeMember)}
        </Translation>
      }
    >
      <span>
        <Translation>
          {t => t(translations.pos.accounts.committeeMember)}
        </Translation>
      </span>
    </Tooltip>
  ),
  dataIndex: 'votingPower',
  key: 'votingPower',
  width: 1,
  render: (_, row) => {
    const elected = row.committeeInfo?.votingPower > 0;
    return (
      <CommitteeMemberWrapper elected={elected}>
        <IconWrapper src={elected ? ElectedIcon : NotElectedIcon} alt="" />
        <Translation>
          {t =>
            t(translations.pos.accounts[elected ? 'elected' : 'notElected'])
          }
        </Translation>
      </CommitteeMemberWrapper>
    );
  },
};

export const votingShare = {
  title: (
    <Tooltip
      title={
        <Translation>
          {t => t(translations.pos.accounts.hover.votingShare)}
        </Translation>
      }
    >
      <span>
        <Translation>
          {t => t(translations.pos.accounts.votingShare)}
        </Translation>
      </span>
    </Tooltip>
  ),
  dataIndex: 'votingShare',
  key: 'votingShare',
  width: 1,
  render: (_, row) => {
    const value = row.committeeInfo?.votingShare;
    return lodash.isNil(value) ? (
      '--'
    ) : (
      <ContentWrapper>
        {formatNumber(value * 100, {
          precision: 3,
          withUnit: false,
          keepZero: true,
        }) + '%'}
      </ContentWrapper>
    );
  },
};

export const nodeAge = {
  title: (
    <Tooltip
      title={
        <Translation>
          {t => t(translations.pos.accounts.hover.nodeAge)}
        </Translation>
      }
    >
      <span>
        <Translation>{t => t(translations.pos.accounts.nodeAge)}</Translation>
      </span>
    </Tooltip>
  ),
  dataIndex: 'createdAt',
  key: 'createdAt',
  width: 1,
  render: value => {
    const second = /^\d+$/.test(value) ? value : dayjs(value).unix();

    return (
      <ContentWrapper>
        <CountDown from={second} />
      </ContentWrapper>
    );
  },
};

export const incoming = {
  title: (
    <ContentWrapper right>
      <Translation>
        {t => t(translations.pos.account.incomingHistory.incoming)}
      </Translation>
    </ContentWrapper>
  ),
  dataIndex: 'reward',
  key: 'reward',
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

export const votes = {
  title: (
    <ContentWrapper right>
      <Translation>
        {t => t(translations.pos.account.votingHistory.votes)}
      </Translation>
    </ContentWrapper>
  ),
  dataIndex: 'votes',
  key: 'votes',
  width: 1,
  render: value => {
    return (
      <ContentWrapper right>
        {lodash.isNil(value) ? '--' : toThousands(value)}
      </ContentWrapper>
    );
  },
};

const IconWrapper = styled.img`
  margin-right: 8px;
`;
