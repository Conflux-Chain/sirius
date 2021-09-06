import React from 'react';
import { Text } from '../Text/Loadable';
// import { formatString } from 'utils';
import { Link } from '../Link/Loadable';
import { WithTranslation, withTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components/macro';
import {
  formatAddress,
  isContractAddress,
  isInnerContractAddress,
  // isAddress,
} from 'utils';
// import { AlertTriangle } from '@zeit-ui/react-icons';
import ContractIcon from 'images/contract-icon.png';
import isMeIcon from 'images/me.png';
import InternalContractIcon from 'images/internal-contract-icon.png';
import VerifiedIcon from 'images/verified.png';
import { media, sizes } from 'styles/media';
import {
  NETWORK_TYPE,
  NETWORK_TYPES,
  CONTRACTS_NAME_LABEL,
} from 'utils/constants';
import { monospaceFont } from 'styles/variable';

interface Props {
  value: string; // address value
  alias?: string; // address alias, such as contract name, miner name, default null
  contractCreated?: string; // contract creation address
  maxWidth?: number; // address max width for view, default 200/170 for default, 400 for full
  isFull?: boolean; // show full address, default false
  isLink?: boolean; // add link to address, default true
  isMe?: boolean; // when `address === portal selected address`, set isMe to true to add special tag, default false
  suffixAddressSize?: number; // suffix address size, default is 8
  prefixFloat?: boolean; // prefix icon float or take up space, default false
  showIcon?: boolean; // whether show contract icon, default true
  verify?: boolean; // show verified contract icon or unverified contract icon
}

const defaultPCMaxWidth = 138;
const defaultMobileMaxWidth =
  NETWORK_TYPE === NETWORK_TYPES.mainnet ? 106 : 140;
const defaultPCSuffixAddressSize =
  NETWORK_TYPE === NETWORK_TYPES.mainnet ? 8 : 4;
const defaultMobileSuffixAddressSize = 4;

// ≈ 2.5 ms
const RenderAddress = ({
  cfxAddress,
  alias,
  hoverValue,
  hrefAddress,
  content,
  isLink = true,
  isFull = false,
  style = {},
  maxWidth,
  suffixSize = defaultPCSuffixAddressSize,
  prefix = null,
  suffix = null,
}: any) => {
  return (
    <AddressWrapper>
      {prefix}
      <Text span hoverValue={hoverValue || cfxAddress}>
        {isLink ? (
          <LinkWrapper
            style={style}
            href={`/address/${hrefAddress || cfxAddress}`}
            maxwidth={isFull ? 430 : maxWidth}
            alias={alias}
            aftercontent={
              cfxAddress && !isFull && !alias
                ? cfxAddress.substr(-suffixSize)
                : ''
            }
          >
            <span>{content || alias || cfxAddress}</span>
          </LinkWrapper>
        ) : (
          <PlainWrapper
            style={style}
            maxwidth={isFull ? 430 : maxWidth}
            alias={alias}
            aftercontent={
              cfxAddress && !isFull && !alias
                ? cfxAddress.substr(-suffixSize)
                : ''
            }
          >
            <span>{content || alias || cfxAddress}</span>
          </PlainWrapper>
        )}
      </Text>
      {suffix}
    </AddressWrapper>
  );
};

// TODO code simplify
// TODO new address display format
export const AddressContainer = withTranslation()(
  React.memo(
    ({
      value,
      alias,
      contractCreated,
      maxWidth,
      isFull = false,
      isLink = true,
      isMe = false,
      suffixAddressSize,
      prefixFloat = false,
      showIcon = true,
      t,
      verify = false,
    }: Props & WithTranslation) => {
      const suffixSize =
        suffixAddressSize ||
        (window.innerWidth <= sizes.m
          ? defaultMobileSuffixAddressSize
          : defaultPCSuffixAddressSize);

      const cfxAddress = formatAddress(value);

      if (!alias) {
        alias = CONTRACTS_NAME_LABEL[cfxAddress];
      }

      // contract create txn
      if (!value) {
        const txtContractCreation = t(
          translations.transaction.contractCreation,
        );

        if (contractCreated)
          return RenderAddress({
            cfxAddress,
            alias,
            hoverValue: formatAddress(contractCreated),
            hrefAddress: formatAddress(contractCreated),
            content: txtContractCreation,
            isLink,
            isFull,
            maxWidth: 160,
            suffixSize,
            prefix: (
              <IconWrapper className={prefixFloat ? 'float' : ''}>
                <Text span hoverValue={txtContractCreation}>
                  <img src={ContractIcon} alt={txtContractCreation} />
                </Text>
              </IconWrapper>
            ),
          });

        // If a txn receipt has no 'to' address or 'contractCreated', show -- for temp
        return <>--</>;
        // Contract create fail, no link
        // TODO deal with zero address value
        // return (
        //   <AddressWrapper>
        //     <IconWrapper>
        //       <Text span hoverValue={txtContractCreation}>
        //         <img src={ContractIcon} alt={txtContractCreation} />
        //       </Text>
        //     </IconWrapper>
        //     <Text span>{txtContractCreation}</Text>
        //   </AddressWrapper>
        // );
      }

      // if (cfxAddress.startsWith('invalid-')) {
      //   const sourceValue = cfxAddress.replace('invalid-', '');
      //   const tip = t(translations.general.invalidAddress);
      //   return RenderAddress({
      //     cfxAddress,
      //     alias,
      //     hoverValue: `${tip}: ${sourceValue}`,
      //     content: alias ? formatString(alias, 'tag') : sourceValue,
      //     isLink: false,
      //     isFull,
      //     maxWidth,
      //     suffixSize,
      //     style: { color: '#e00909' },
      //     prefix: (
      //       <IconWrapper className={prefixFloat ? 'float' : ''}>
      //         <Text span hoverValue={tip}>
      //           <AlertTriangle size={16} color="#e00909" />
      //         </Text>
      //       </IconWrapper>
      //     ),
      //   });
      // }

      if (isContractAddress(cfxAddress) || isInnerContractAddress(cfxAddress)) {
        const typeText = t(
          isInnerContractAddress(cfxAddress)
            ? translations.general.internalContract
            : verify
            ? translations.general.verifiedContract
            : translations.general.unverifiedContract,
        );
        return RenderAddress({
          cfxAddress,
          alias,
          isLink,
          isFull,
          maxWidth,
          suffixSize,
          prefix: showIcon ? (
            <IconWrapper
              className={`${isFull ? 'icon' : ''} ${
                prefixFloat ? 'float' : ''
              }`}
            >
              <Text span hoverValue={typeText}>
                <ImgWrapper>
                  {isInnerContractAddress(cfxAddress) ? (
                    <img src={InternalContractIcon} alt={typeText} />
                  ) : (
                    <>
                      <img src={ContractIcon} alt={typeText} />
                      {verify ? (
                        <img
                          className={'verified'}
                          src={VerifiedIcon}
                          alt={''}
                        />
                      ) : null}
                    </>
                  )}
                </ImgWrapper>
              </Text>
            </IconWrapper>
          ) : null,
        });
      }

      if (isMe) {
        return RenderAddress({
          cfxAddress,
          alias,
          isLink,
          isFull,
          maxWidth,
          suffixSize,
          suffix: (
            <IconWrapper className={prefixFloat ? 'float' : ''}>
              <img
                src={isMeIcon}
                alt="is me"
                style={{
                  width: 38.5,
                  marginLeft: 3,
                  marginBottom: isFull ? 6 : 4,
                }}
              />
            </IconWrapper>
          ),
        });
      }

      return RenderAddress({
        cfxAddress,
        alias,
        isLink,
        isFull,
        maxWidth,
        suffixSize,
      });
    },
  ),
);

const ImgWrapper = styled.span`
  position: relative;
  width: 16px;
  height: 16px;

  img {
    width: 16px;
    height: 16px;
    vertical-align: bottom;
    margin-bottom: 5px;
  }

  .verified {
    width: 8px;
    height: 8px;
    position: absolute;
    bottom: -1px;
    right: 1px;
  }
`;
const IconWrapper = styled.span`
  margin-right: 2px;
  flex-shrink: 0;

  &.float {
    margin-left: -18px;
  }

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
  display: inline-flex;
  /* display: inline-block; */
  font-family: ${monospaceFont};

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
  max-width: ${
    props.maxwidth || (props.alias ? 180 : defaultPCMaxWidth)
  }px !important;
  outline: none;
  
  > span {
    flex: 0 1 auto;  
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  ${media.m} {
    max-width: ${
      props.maxwidth || (props.alias ? 160 : defaultMobileMaxWidth)
    }px !important;
  }

  &:after {
    ${!props.aftercontent ? 'display: none;' : ''}
    content: '${props.aftercontent || ''}';
    flex: 1 0 auto; 
    white-space: nowrap;
    margin-left: -1px;
  }
`;

const LinkWrapper = styled(Link)<{
  maxwidth?: number;
  aftercontent?: string;
  alias?: string;
}>`
  ${props => addressStyle(props)}
`;

const PlainWrapper = styled.span<{
  maxwidth?: number;
  aftercontent?: string;
  alias?: string;
}>`
  ${props => addressStyle(props)}

  color: #333;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  vertical-align: bottom;
  cursor: default;
`;
