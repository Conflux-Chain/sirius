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
import isMeIcon from '../../../images/me.png';
import InternalContractIcon from '../../../images/internal-contract-icon.png';
import { media } from '../../../styles/media';
import { zeroAddress } from '../../../utils/constants';

interface Props {
  value: string; // address value
  alias?: string; // address alias, such as contract name, miner name, default null
  contractCreated?: string; // contract creation address
  maxWidth?: number; // address max width for view, default 200/170 for default, 400 for full
  isFull?: boolean; // show full address, default false
  isLink?: boolean; // add link to address, default true
  isMe?: boolean; // when `address === portal selected address`, set isMe to true to add special tag, default false
  zeroAddressAutoShowAlias?: boolean; // is auto show zero address alias
  suffixAddressSize?: number; // suffix address size, default is 8
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
  isMe = false,
  zeroAddressAutoShowAlias = true,
  suffixAddressSize = 8,
}: Props) => {
  const { t } = useTranslation();
  const txtContractCreation = t(translations.transaction.contractCreation);
  const cfxAddress = formatAddress(value);

  // zero address auto set alias
  if (!alias && zeroAddressAutoShowAlias && cfxAddress === zeroAddress) {
    alias = t(translations.general.zeroAddress);
  }

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
    suffix = null,
  }: any) => (
    <AddressWrapper>
      {prefix}
      <Text span hoverValue={hoverValue}>
        {link ? (
          <LinkWrapper
            style={style}
            href={`/address/${hrefAddress}`}
            maxwidth={full ? 430 : maxWidth}
            afterContent={
              cfxAddress && !full && !alias
                ? cfxAddress.substr(-suffixAddressSize)
                : ''
            }
          >
            <span>{content}</span>
          </LinkWrapper>
        ) : (
          <PlainWrapper
            style={style}
            maxwidth={full ? 430 : maxWidth}
            afterContent={
              cfxAddress && !full && !alias
                ? cfxAddress.substr(-suffixAddressSize)
                : ''
            }
          >
            {content}
          </PlainWrapper>
        )}
      </Text>
      {suffix}
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
    // TODO deal with zero address value
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

  if (isMe) {
    return RenderAddress({
      suffix: (
        <IconWrapper>
          <img
            src={isMeIcon}
            alt="is me"
            style={{ width: 38.5, marginLeft: 3, marginBottom: isFull ? 6 : 4 }}
          />
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
  position: relative;
  box-sizing: border-box;
  display: inline-flex !important;
  flex-wrap: nowrap;
  max-width: ${props.maxwidth || 190}px !important;
  outline: none;
  
  > span {
    flex: 0 1 auto;  
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  ${media.m} {
    max-width: ${props.maxwidth || 170}px !important;
  }

  &:after {
    content: '${props.afterContent || ''}';
    flex: 1 0 auto; 
    white-space: nowrap;
    margin-left: -1px;
  }
`;

const LinkWrapper = styled(Link)<{
  maxwidth?: number;
  afterContent?: string;
}>`
  ${props => addressStyle(props)}
`;

const PlainWrapper = styled.span<{
  maxwidth?: number;
  afterContent?: string;
}>`
  ${props => addressStyle(props)}

  color: #333;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  vertical-align: bottom;
  cursor: default;
`;
