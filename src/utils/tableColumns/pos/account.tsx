import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { toThousands, formatNumber } from 'utils';
import { ColumnAge, ContentWrapper } from '../utils';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
import lodash from 'lodash';
import { CoreAddressContainer } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/CoreAddressContainer';
import VotingPowerIcon from 'images/voting-power.svg';
import IsActiveIcon from 'images/is-active.svg';
import NotActiveIcon from 'images/not-active.svg';
import ElectedIcon from 'images/elected.svg';
import NotElectedIcon from 'images/not-elected.svg';
import styled from 'styled-components';
import { CopyButton } from '@cfxjs/sirius-next-common/dist/components/CopyButton';
import { InfoIconWithTooltip } from '@cfxjs/sirius-next-common/dist/components/InfoIconWithTooltip';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';
import { fromDripToCfx } from '@cfxjs/sirius-next-common/dist/utils';

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
        <CoreAddressContainer
          alias={row.byte32NameTagInfo?.nameTag}
          value={value}
          hideAliasPrefixInHover
          isPosAddress={true}
        ></CoreAddressContainer>
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
    <InfoIconWithTooltip
      info={
        <Translation>
          {t => t(translations.pos.accounts.hover.active)}
        </Translation>
      }
    >
      <span>
        <Translation>{t => t(translations.pos.accounts.active)}</Translation>
      </span>
    </InfoIconWithTooltip>
  ),
  dataIndex: 'forceRetired',
  key: 'forceRetired',
  width: 1,
  render: (value, row) => {
    const notActive =
      value > 0 || !row.availableVotesInCfx || row.availableVotesInCfx === 0;
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
    <InfoIconWithTooltip
      info={
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
    </InfoIconWithTooltip>
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
    <InfoIconWithTooltip
      info={
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
    </InfoIconWithTooltip>
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
          precision: 2,
          withUnit: false,
          keepZero: true,
        }) + '%'}
      </ContentWrapper>
    );
  },
};

export const nodeAge = (ageFormat, toggleAgeFormat) =>
  ColumnAge({
    ageFormat,
    toggleAgeFormat,
    key: 'createdAt',
    dataIndex: 'createdAt',
    ageI18n: translations.pos.accounts.nodeAge,
  });

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
          <Text tag="span" hoverValue={`${fromDripToCfx(value, true)} CFX`}>
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
