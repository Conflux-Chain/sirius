import React from 'react';
import { Text } from '../Text/Loadable';
import { formatString, isContractAddress } from '../../../utils';
import { Link } from '../Link/Loadable';
import { Translation } from 'react-i18next';
import { translations } from '../../../locales/i18n';

const getContractName = (value, alias) => {
  if (alias) return formatString(alias, 'tag');
  return formatString(value, 'address');
};

interface Props {
  value: string;
  alias?: string;
  contractCreated?: string;
}

export const AddressContainer = ({ value, alias, contractCreated }: Props) => {
  let isContract = isContractAddress(value);

  if (!value) {
    // contract creation txn to prop is null
    if (contractCreated)
      return (
        <Link href={`/address/${contractCreated}`}>
          <Text span hoverValue={contractCreated}>
            ✔{' '}
            <Translation>
              {t => t(translations.transaction.contractCreation)}
            </Translation>
          </Text>
        </Link>
      );

    // contract creation fail, no link
    return (
      <Text span>
        ✔{' '}
        <Translation>
          {t => t(translations.transaction.contractCreation)}
        </Translation>
      </Text>
    );
  }

  if (isContract)
    return (
      <Link href={`/address/${value}`}>
        <Text span hoverValue={value}>
          ✔ {getContractName(value, alias)}
        </Text>
      </Link>
    );

  return (
    <Link href={`/address/${value}`}>
      <Text span hoverValue={value}>
        ✔ {formatString(value, 'address')}
      </Text>
    </Link>
  );
};
