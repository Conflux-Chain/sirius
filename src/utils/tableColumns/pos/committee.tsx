import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from 'sirius-next/packages/common/dist/locales/i18n';
import { ContentWrapper } from '../utils';
import lodash from 'lodash';
import { Link } from 'app/components/Link/Loadable';

export const epoch = {
  title: (
    <ContentWrapper>
      <Translation>
        {t => t(translations.pos.committees.committeeEpoch)}
      </Translation>
    </ContentWrapper>
  ),
  dataIndex: 'epochNumber',
  key: 'epochNumber',
  width: 1,
  render: (value, row) => {
    return lodash.isNil(value) ? (
      '--'
    ) : (
      <ContentWrapper>
        <Link href={`/pos/committees/${row.blockNumber}`}>{value}</Link>
      </ContentWrapper>
    );
  },
};

export const nodesCount = {
  title: (
    <ContentWrapper right>
      <Translation>
        {t => t(translations.pos.committees.numberOfMembers)}
      </Translation>
    </ContentWrapper>
  ),
  dataIndex: 'nodesCount',
  key: 'nodesCount',
  width: 1,
  render: value => {
    return (
      <ContentWrapper right>
        {lodash.isNil(value) ? '--' : value}
      </ContentWrapper>
    );
  },
};

export const totalVotes = {
  title: (
    <ContentWrapper right>
      <Translation>
        {t => t(translations.pos.committees.totalVotes)}
      </Translation>
    </ContentWrapper>
  ),
  dataIndex: 'totalVotingPower',
  key: 'totalVotingPower',
  width: 1,
  render: value => {
    return (
      <ContentWrapper right>
        {lodash.isNil(value) ? '--' : value}
      </ContentWrapper>
    );
  },
};

export const votes = {
  title: (
    <ContentWrapper right>
      <Translation>
        {t => t(translations.pos.block.votingAddress.votingNumber)}
      </Translation>
    </ContentWrapper>
  ),
  dataIndex: 'votes',
  key: 'votes',
  width: 1,
  render: value => {
    return (
      <ContentWrapper right>
        {lodash.isNil(value) ? '--' : value}
      </ContentWrapper>
    );
  },
};

export const rightStatus = {
  title: (
    <ContentWrapper>
      <Translation>
        {t => t(translations.pos.account.votingStatus.status)}
      </Translation>
    </ContentWrapper>
  ),
  dataIndex: 'type',
  key: 'type',
  width: 1,
  render: value => {
    return (
      <ContentWrapper>
        {lodash.isNil(value) ? (
          '--'
        ) : (
          <Translation>
            {t => t(translations.pos.account.votingStatus[value])}
          </Translation>
        )}
      </ContentWrapper>
    );
  },
};

export const deadline = {
  title: (
    <ContentWrapper right>
      <Translation>
        {t => t(translations.pos.account.votingStatus.blockNumberDeadline)}
      </Translation>
    </ContentWrapper>
  ),
  dataIndex: 'endBlockNumber',
  key: 'endBlockNumber',
  width: 1,
  render: value => {
    return (
      <ContentWrapper right>
        {lodash.isNil(value) ? '--' : value}
      </ContentWrapper>
    );
  },
};

export const right = {
  title: (
    <ContentWrapper right>
      <Translation>
        {t => t(translations.pos.account.votingStatus.rights)}
      </Translation>
    </ContentWrapper>
  ),
  dataIndex: 'power',
  key: 'power',
  width: 1,
  render: value => {
    return (
      <ContentWrapper right>
        {lodash.isNil(value) ? '--' : value}
      </ContentWrapper>
    );
  },
};
