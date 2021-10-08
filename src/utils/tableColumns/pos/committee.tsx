import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ContentWrapper } from '../utils';
import lodash from 'lodash';

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
  render: value => {
    return lodash.isNil(value) ? (
      '--'
    ) : (
      <ContentWrapper>{value}</ContentWrapper>
    );
  },
};

export const nodesCount = {
  title: (
    <ContentWrapper right>
      <Translation>
        {t => t(translations.pos.committees.numberOfMumbers)}
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
