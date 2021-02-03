import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from '../../locales/i18n';
// import styled from 'styled-components/macro';
// import { Text } from '../../app/components/Text/Loadable';
// import { Link } from '../../app/components/Link/Loadable';
// import { CountDown } from '../../app/components/CountDown/Loadable';
import { getPercent, toThousands } from '../../utils/';
// import imgPivot from 'images/pivot.svg';
// import { AddressContainer } from '../../app/components/AddressContainer';

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
  render: value => `${value === null ? 0 : toThousands(value)} CFX`,
};

export const percentage = {
  title: (
    <Translation>{t => t(translations.accounts.table.percentage)}</Translation>
  ),
  dataIndex: 'percentage',
  key: 'percentage',
  width: 1,
  render(value, row: any) {
    return Number(Math.random().toFixed(2).substr(2)) + '%';
  },
};

export const count = {
  title: <Translation>{t => t(translations.accounts.table.count)}</Translation>,
  dataIndex: 'count',
  key: 'count',
  width: 1,
  render: value => toThousands(value) || 0,
};
