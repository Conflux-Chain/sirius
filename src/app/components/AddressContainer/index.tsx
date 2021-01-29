import React from 'react';
import { Text } from '../Text/Loadable';
import {
  formatString,
  isContractAddress,
  isInnerContractAddress,
} from '../../../utils';
import { Link } from '../Link/Loadable';
import { Translation, useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import styled from 'styled-components/macro';
import { formatAddress } from '../../../utils/cfx';
import { FileText, Info } from '@zeit-ui/react-icons';

interface Props {
  value: string;
  alias?: string;
  contractCreated?: string;
  maxWidth?: number;
  isFull?: boolean;
}

export const AddressContainer = ({
  value,
  alias,
  contractCreated,
  maxWidth,
  isFull = false,
}: Props) => {
  const { t } = useTranslation();

  const LinkWrapper = styled(Link)`
    display: inline-block !important;
    max-width: ${maxWidth || 130}px !important;
    outline: none;
  `;

  const IconWrapper = styled.span`
    margin-right: 2px;

    svg {
      vertical-align: bottom;
      margin-bottom: 6px;
    }
  `;

  if (!value) {
    // contract creation txn to prop is null
    if (contractCreated)
      return (
        <>
          <IconWrapper>
            <Text
              span
              hoverValue={t(translations.transaction.contractCreation)}
            >
              <FileText size={12} color="#0fd44c" />
            </Text>
          </IconWrapper>
          <Text span hoverValue={formatAddress(contractCreated)}>
            <Link href={`/address/${formatAddress(contractCreated)}`}>
              <Translation>
                {t => t(translations.transaction.contractCreation)}
              </Translation>
            </Link>
          </Text>
        </>
      );

    // contract creation fail, no link
    return (
      <>
        <IconWrapper>
          <Text span hoverValue={t(translations.transaction.contractCreation)}>
            <FileText size={12} color="#0fd44c" />
          </Text>
        </IconWrapper>
        <Text span>
          <Translation>
            {t => t(translations.transaction.contractCreation)}
          </Translation>
        </Text>
      </>
    );
  }
  const cfxAddress = formatAddress(value);

  if (cfxAddress.startsWith('invalid-')) {
    const sourceValue = cfxAddress.replace('invalid-', '');
    const tip = t(translations.general.invalidAddress);
    return (
      <>
        <IconWrapper>
          <Text span hoverValue={tip}>
            <Info size={12} color="#e00909" />
          </Text>
        </IconWrapper>
        <Text span hoverValue={`${tip}: ${sourceValue}`}>
          <LinkWrapper style={{ color: '#e00909' }}>
            {alias ? formatString(alias, 'tag') : sourceValue}
          </LinkWrapper>
        </Text>
      </>
    );
  }

  if (value && isFull) {
    return <Link href={`/address/${cfxAddress}`}>{cfxAddress}</Link>;
  }

  const isContract = isContractAddress(value);
  const isInternalContract = isInnerContractAddress(value);

  if (isContract || isInternalContract) {
    const typeText = t(
      isInternalContract
        ? translations.general.internalContract
        : translations.general.contract,
    );
    return (
      <>
        <IconWrapper>
          <Text span hoverValue={typeText}>
            <FileText
              size={12}
              color={isInternalContract ? '#13b5c4' : '#9b9eac'}
            />
          </Text>
        </IconWrapper>
        <Text span hoverValue={cfxAddress}>
          <LinkWrapper href={`/address/${cfxAddress}`}>
            {alias ? formatString(alias, 'tag') : cfxAddress}
          </LinkWrapper>
        </Text>
      </>
    );
  }

  return (
    <Text span hoverValue={cfxAddress}>
      <LinkWrapper href={`/address/${cfxAddress}`}>{cfxAddress}</LinkWrapper>
    </Text>
  );
};
