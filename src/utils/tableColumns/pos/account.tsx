import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { toThousands, fromDripToCfx } from 'utils';
import { ContentWrapper } from '../utils';
import { Text } from 'sirius-next/packages/common/dist/components/Text';
import lodash from 'lodash';

export const availableVotes = {
  title: (
    <ContentWrapper right>
      <Translation>
        {t => t(translations.pos.accounts.availableVotes)}
      </Translation>
    </ContentWrapper>
  ),
  dataIndex: 'availableVotes',
  key: 'availableVotes',
  width: 1,
  render: value => {
    return (
      <ContentWrapper right>
        {lodash.isNil(value) ? '--' : toThousands(value)}
      </ContentWrapper>
    );
  },
};

export const votesInCommittee = {
  title: (
    <ContentWrapper right>
      <Translation>
        {t => t(translations.pos.accounts.votesInCommittee)}
      </Translation>
    </ContentWrapper>
  ),
  dataIndex: 'votesInCommittee',
  key: 'votesInCommittee',
  width: 1,
  render: (_, row) => {
    return (
      <ContentWrapper right>
        {lodash.isNil(row?.committeeInfo)
          ? '--'
          : toThousands(row.committeeInfo?.votingPower)}
      </ContentWrapper>
    );
  },
};

export const currentCommitteeMember = {
  title: (
    <Translation>
      {t => t(translations.pos.accounts.currentCommitteeMember)}
    </Translation>
  ),
  dataIndex: 'currentCommitteeMember',
  key: 'currentCommitteeMember',
  width: 1,
  render: (_, row) => {
    return lodash.isNil(row?.committeeInfo) ? (
      '--'
    ) : row.committeeInfo?.votingPower > 0 ? (
      <Translation>{t => t(translations.general.yes)}</Translation>
    ) : (
      <Translation>{t => t(translations.general.no)}</Translation>
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
