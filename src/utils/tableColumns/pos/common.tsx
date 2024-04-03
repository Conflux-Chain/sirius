import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from 'sirius-next/packages/common/dist/locales/i18n';
import { ColumnAge } from '../utils';
import {
  PoSAddressContainer,
  AddressContainer,
} from 'app/components/AddressContainer/Loadable';
import { Text } from 'app/components/Text/Loadable';
import { Link } from 'app/components/Link/Loadable';
import lodash from 'lodash';

export const age = (
  ageFormat,
  toggleAgeFormat,
  dataIndex = 'createdAt',
  key = 'createdAt',
) =>
  ColumnAge({
    ageFormat,
    toggleAgeFormat,
    right: true,
    dataIndex,
    key,
  });

export const posAddress = {
  title: (
    <Translation>{t => t(translations.pos.common.posAddress)}</Translation>
  ),
  dataIndex: 'hex',
  key: 'hex',
  width: 1,
  render: value => {
    return lodash.isNil(value) ? '--' : <PoSAddressContainer value={value} />;
  },
};

export const posBlockHash = {
  title: (
    <Translation>{t => t(translations.pos.common.posBlockHash)}</Translation>
  ),
  dataIndex: 'posBlockHash',
  key: 'posBlockHash',
  width: 1,
  render: (value, row) => {
    return !lodash.isNil(value) ? (
      <Link
        href={`/pos/blocks/${value || row.hash || row.block?.hash}?height=${
          row.height || row.block?.height
        }`}
      >
        <Text span hoverValue={value} maxWidth="100px">
          {value}
        </Text>
      </Link>
    ) : (
      '--'
    );
  },
};

export const powAddress = {
  title: (
    <Translation>{t => t(translations.pos.common.powAddress)}</Translation>
  ),
  dataIndex: 'hex',
  key: 'hex',
  width: 1,
  render: value => {
    return lodash.isNil(value) ? '--' : <AddressContainer value={value} />;
  },
};

export const powBlockHash = {
  title: (
    <Translation>{t => t(translations.pos.common.powBlockHash)}</Translation>
  ),
  dataIndex: 'powBlockHash',
  key: 'powBlockHash',
  width: 1,
  render: value => {
    return !lodash.isNil(value) ? (
      <Link href={`/block/${value}`}>
        <Text span hoverValue={value} maxWidth="100px">
          {value}
        </Text>
      </Link>
    ) : (
      '--'
    );
  },
};
