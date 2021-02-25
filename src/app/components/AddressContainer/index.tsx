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
import { AlertTriangle } from '@zeit-ui/react-icons';
import ContractIcon from '../../../images/contract-icon.png';
import InternalContractIcon from '../../../images/internal-contract-icon.png';
import { media } from '../../../styles/media';

interface Props {
  value: string;
  alias?: string;
  contractCreated?: string;
  maxWidth?: number;
  isFull?: boolean;
}

const IconWrapper = styled.span`
  margin-right: 2px;

  svg {
    vertical-align: bottom;
    margin-bottom: 4px;
  }

  img {
    width: 16px;
    height: 16px;
    vertical-align: bottom;
    margin-bottom: 4px;
  }
`;

const FullAddressWrapper = styled.div`
  display: inline-block;
  position: relative;

  .icon {
    position: absolute;
    left: -18px;
    top: -2px;
  }
`;

export const AddressContainer = ({
  value,
  alias,
  contractCreated,
  maxWidth,
  isFull = false,
}: Props) => {
  const { t } = useTranslation();

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
              <img
                src={ContractIcon}
                alt={t(translations.transaction.contractCreation)}
              />
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
            <img
              src={ContractIcon}
              alt={t(translations.transaction.contractCreation)}
            />
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
            <AlertTriangle size={16} color="#e00909" />
          </Text>
        </IconWrapper>
        <Text span hoverValue={`${tip}: ${sourceValue}`}>
          <LinkWrapper style={{ color: '#e00909' }} maxwidth={maxWidth}>
            {alias ? formatString(alias, 'tag') : sourceValue}
          </LinkWrapper>
        </Text>
      </>
    );
  }

  const isContract = isContractAddress(value);
  const isInternalContract = isInnerContractAddress(value);

  if (value && isFull) {
    const typeText = t(
      isInternalContract
        ? translations.general.internalContract
        : translations.general.contract,
    );

    const prefix = () =>
      isContract ? (
        <IconWrapper className="icon">
          <Text span hoverValue={typeText}>
            {isInternalContract ? (
              <img src={InternalContractIcon} alt={typeText} />
            ) : (
              <img src={ContractIcon} alt={typeText} />
            )}
          </Text>
        </IconWrapper>
      ) : null;

    if (alias)
      return (
        <FullAddressWrapper>
          {prefix()}
          <Text span hoverValue={cfxAddress}>
            <FullLinkWrapper href={`/address/${cfxAddress}`}>
              {alias}
            </FullLinkWrapper>
          </Text>
        </FullAddressWrapper>
      );
    return (
      <FullAddressWrapper>
        {prefix()}
        <Text span hoverValue={cfxAddress}>
          <FullLinkWrapper href={`/address/${cfxAddress}`}>
            {cfxAddress}
          </FullLinkWrapper>
        </Text>
      </FullAddressWrapper>
    );
  }

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
            {isInternalContract ? (
              <img src={InternalContractIcon} alt={typeText} />
            ) : (
              <img src={ContractIcon} alt={typeText} />
            )}
          </Text>
        </IconWrapper>
        <Text span hoverValue={cfxAddress}>
          <LinkWrapper href={`/address/${cfxAddress}`} maxwidth={maxWidth}>
            {alias ? formatString(alias, 'tag') : cfxAddress}
          </LinkWrapper>
        </Text>
      </>
    );
  }

  return (
    <Text span hoverValue={cfxAddress}>
      <LinkWrapper href={`/address/${cfxAddress}`} maxwidth={maxWidth}>
        {cfxAddress}
      </LinkWrapper>
    </Text>
  );
};

const LinkWrapper = styled(Link)<{
  maxwidth?: number;
}>`
  display: inline-block !important;
  max-width: ${props => `${props.maxwidth || 130}px !important`};
  outline: none;

  ${media.s} {
    max-width: ${props => `${props.maxwidth || 100}px !important`};
  }
`;

const FullLinkWrapper = styled(Link)`
  display: inline-block !important;
  max-width: 430px !important;
  outline: none;
`;
