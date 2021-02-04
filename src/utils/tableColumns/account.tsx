import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from '../../locales/i18n';
import { toThousands, formatNumber } from '../../utils/';

export const rank = {
  title: (
    <Translation>{t => t(translations.accounts.table.number)}</Translation>
  ),
  dataIndex: 'rank',
  key: 'rank',
  width: 1,
};

export const address = {
  title: (
    <Translation>{t => t(translations.accounts.table.address)}</Translation>
  ),
  dataIndex: 'base32address',
  key: 'base32address',
  width: 1,
  render: (value, row: any) => row.name || value,
};

export const balance = {
  title: (
    <Translation>{t => t(translations.accounts.table.balance)}</Translation>
  ),
  dataIndex: 'valueN',
  key: 'valueN',
  width: 1,
  render: value => (value === null ? '--' : `${toThousands(value)} CFX`),
};

export const percentage = {
  title: (
    <Translation>{t => t(translations.accounts.table.percentage)}</Translation>
  ),
  dataIndex: 'percent',
  key: 'percent',
  width: 1,
  render: value => formatNumber(value, { precision: 9, withUnit: false }) + '%',
};

export const count = {
  title: <Translation>{t => t(translations.accounts.table.count)}</Translation>,
  dataIndex: 'value2', // txn count key name is value2
  key: 'value2',
  width: 1,
  render: value => toThousands(Number(value)) || '--',
};
