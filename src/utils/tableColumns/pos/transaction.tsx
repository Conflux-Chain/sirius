import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ContentWrapper } from '../utils';
import { Text } from 'app/components/Text/Loadable';
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

export const txHash = {
  title: (
    <ContentWrapper>
      <Translation>
        {t => t(translations.pos.transactions.poSTxnHash)}
      </Translation>
    </ContentWrapper>
  ),
  dataIndex: 'hash',
  key: 'hash',
  width: 1,
  render: value => {
    return !lodash.isNil(value) ? (
      // @todo, no tx detail now
      // <Link href={`/pos/transactions/${value}`}>
      //   <Text span hoverValue={value} maxWidth="100px">
      //     {value}
      //   </Text>
      // </Link>
      <Text span hoverValue={value} maxWidth="100px">
        {value}
      </Text>
    ) : (
      '--'
    );
  },
};

export const status = {
  title: (
    <Translation>{t => t(translations.pos.transactions.status)}</Translation>
  ),
  dataIndex: 'status',
  key: 'status',
  width: 1,
  render: value => {
    return !lodash.isNil(value) ? (
      <Translation>
        {t => t(translations.pos.common.txStatus[value])}
      </Translation>
    ) : (
      '--'
    );
  },
};

export const type = {
  title: (
    <Translation>{t => t(translations.pos.transactions.type)}</Translation>
  ),
  dataIndex: 'type',
  key: 'type',
  width: 1,
  render: value => {
    return !lodash.isNil(value) ? (
      <Translation>{t => t(translations.pos.common.txType[value])}</Translation>
    ) : (
      '--'
    );
  },
};
