import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from 'sirius-next/packages/common/dist/locales/i18n';
import { ContentWrapper } from '../utils';
import lodash from 'lodash';

export const blockHeight = {
  title: (
    <ContentWrapper>
      <Translation>{t => t(translations.pos.blocks.blockHeight)}</Translation>
    </ContentWrapper>
  ),
  dataIndex: 'height',
  key: 'height',
  width: 1,
  render: value => {
    return lodash.isNil(value) ? (
      '--'
    ) : (
      <ContentWrapper>{value}</ContentWrapper>
    );
  },
};

export const txn = {
  title: (
    <ContentWrapper>
      <Translation>{t => t(translations.pos.blocks.txn)}</Translation>
    </ContentWrapper>
  ),
  dataIndex: 'transactionCount',
  key: 'transactionCount',
  width: 1,
  render: value => {
    return lodash.isNil(value) ? (
      '--'
    ) : (
      <ContentWrapper>{value}</ContentWrapper>
    );
  },
};
