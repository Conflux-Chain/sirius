import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ColumnAge } from '../utils';
import { CoreAddressContainer } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/CoreAddressContainer';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
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
    return lodash.isNil(value) ? (
      '--'
    ) : (
      <CoreAddressContainer value={value} isPosAddress={true} />
    );
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
        <Text tag="span" hoverValue={value} maxWidth="100px">
          {value}
        </Text>
      </Link>
    ) : (
      '--'
    );
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
        <Text tag="span" hoverValue={value} maxWidth="100px">
          {value}
        </Text>
      </Link>
    ) : (
      '--'
    );
  },
};
