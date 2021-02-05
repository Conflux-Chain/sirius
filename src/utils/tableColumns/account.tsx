import React from 'react';
import { Translation } from 'react-i18next';
import { Link } from '../../app/components/Link/Loadable';
import { translations } from '../../locales/i18n';
import { toThousands, formatNumber } from '../../utils/';
import { ContentWrapper } from './utils';

export const rank = {
  title: (
    <Translation>{t => t(translations.accounts.table.number)}</Translation>
  ),
  dataIndex: 'rank',
  key: 'rank',
};

export const address = {
  title: (
    <Translation>{t => t(translations.accounts.table.address)}</Translation>
  ),
  dataIndex: 'base32address',
  key: 'base32address',
  render: (value, row: any) => (
    <Link href={`/address/${value}`}>{row.name || value}</Link>
  ),
};

export const balance = {
  title: (
    <ContentWrapper right>
      <Translation>{t => t(translations.accounts.table.balance)}</Translation>
    </ContentWrapper>
  ),
  dataIndex: 'valueN',
  key: 'valueN',
  render: value => (
    <ContentWrapper right>
      {value === null
        ? '--'
        : `${toThousands(
            formatNumber(value, { keepDecimal: false, withUnit: false }),
          )} CFX`}
    </ContentWrapper>
  ),
};

export const percentage = {
  title: (
    <ContentWrapper right>
      <Translation>
        {t => t(translations.accounts.table.percentage)}
      </Translation>
    </ContentWrapper>
  ),
  dataIndex: 'percent',
  key: 'percent',
  render: value => (
    <ContentWrapper right>
      {formatNumber(value, { precision: 3, withUnit: false, keepZero: true }) +
        '%'}
    </ContentWrapper>
  ),
};

export const count = {
  title: (
    <ContentWrapper right>
      <Translation>{t => t(translations.accounts.table.count)}</Translation>
    </ContentWrapper>
  ),
  dataIndex: 'valueN', // txn count key name is valueN
  key: 'valueN',
  render: value => (
    <ContentWrapper right>{toThousands(Number(value)) || '--'}</ContentWrapper>
  ),
};
