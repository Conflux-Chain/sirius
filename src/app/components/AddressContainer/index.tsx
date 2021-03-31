import React from 'react';
import { Text } from '../Text/Loadable';
import {
  formatString,
  isContractAddress,
  isInnerContractAddress,
} from '../../../utils';
import { Link } from '../Link/Loadable';
import { useTranslation } from 'react-i18next';
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
  isLink?: boolean;
}

// TODO code simplify
// TODO new address display format
export const AddressContainer = ({
  value,
  alias,
  contractCreated,
  maxWidth,
  isFull = false,
  isLink = true,
}: Props) => {
  const { t } = useTranslation();
  const txtContractCreation = t(translations.transaction.contractCreation);
  const cfxAddress = formatAddress(value);

  const RenderAddress = ({
    hoverValue = cfxAddress,
    hrefAddress = cfxAddress,
    content = alias
      ? isFull
        ? alias
        : formatString(alias, 'tag')
      : cfxAddress,
    link = isLink,
    full = isFull,
    style = {},
    prefix = null,
  }: any) => (
    <AddressWrapper>
      {prefix}
      <Text span hoverValue={hoverValue}>
        {link ? (
          <LinkWrapper
            style={style}
            href={`/address/${hrefAddress}`}
            maxwidth={full ? 430 : maxWidth}
          >
            {content}
          </LinkWrapper>
        ) : (
          <PlainWrapper style={style} maxwidth={full ? 430 : maxWidth}>
            {content}
          </PlainWrapper>
        )}
      </Text>
    </AddressWrapper>
  );

  if (!value) {
    // Contract Registration txn to prop is null
    if (contractCreated)
      return RenderAddress({
        hoverValue: formatAddress(contractCreated),
        hrefAddress: formatAddress(contractCreated),
        content: txtContractCreation,
        prefix: (
          <IconWrapper>
            <Text span hoverValue={txtContractCreation}>
              <img src={ContractIcon} alt={txtContractCreation} />
            </Text>
          </IconWrapper>
        ),
      });

    // Contract Registration fail, no link
    // TODO deal with null address value
    return (
      <AddressWrapper>
        <IconWrapper>
          <Text span hoverValue={txtContractCreation}>
            <img src={ContractIcon} alt={txtContractCreation} />
          </Text>
        </IconWrapper>
        <Text span>{txtContractCreation}</Text>
      </AddressWrapper>
    );
  }

  if (cfxAddress.startsWith('invalid-')) {
    const sourceValue = cfxAddress.replace('invalid-', '');
    const tip = t(translations.general.invalidAddress);
    return RenderAddress({
      hoverValue: `${tip}: ${sourceValue}`,
      content: alias ? formatString(alias, 'tag') : sourceValue,
      link: false,
      style: { color: '#e00909' },
      prefix: (
        <IconWrapper>
          <Text span hoverValue={tip}>
            <AlertTriangle size={16} color="#e00909" />
          </Text>
        </IconWrapper>
      ),
    });
  }

  const isContract = isContractAddress(value);
  const isInternalContract = isInnerContractAddress(value);

  if (isContract || isInternalContract) {
    const typeText = t(
      isInternalContract
        ? translations.general.internalContract
        : translations.general.contract,
    );
    return RenderAddress({
      prefix: (
        <IconWrapper className={isFull ? 'icon' : ''}>
          <Text span hoverValue={typeText}>
            {isInternalContract ? (
              <img src={InternalContractIcon} alt={typeText} />
            ) : (
              <img src={ContractIcon} alt={typeText} />
            )}
          </Text>
        </IconWrapper>
      ),
    });
  }

  return RenderAddress({});
};

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

const AddressWrapper = styled.div`
  display: inline-block;

  // TODO icon position
  //position: relative;

  //.icon {
  //  position: absolute;
  //  left: -18px;
  //  top: -2px;
  //}
`;

const addressStyle = (props: any) => ` 
  display: inline-block !important;
  max-width: ${props.maxwidth || 130}px !important;
  outline: none;

  ${media.s} {
    max-width: ${props.maxwidth || 100}px !important;
  }
`;

const LinkWrapper = styled(Link)<{
  maxwidth?: number;
}>`
  ${props => addressStyle(props)}
`;

const PlainWrapper = styled.span<{
  maxwidth?: number;
}>`
  ${props => addressStyle(props)}

  color: #333;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  vertical-align: bottom;
  cursor: default;
`;
