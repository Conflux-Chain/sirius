import React from 'react';
import { Text } from '../Text/Loadable';
import { Link } from '../Link/Loadable';
import { WithTranslation, withTranslation, Translation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components/macro';
import {
  formatAddress,
  isContractAddress,
  isInnerContractAddress,
  isZeroAddress,
  isAddress,
  formatString,
  isPosAddress,
  getUrl,
} from 'utils';
import { AlertTriangle, File, Bookmark } from '@zeit-ui/react-icons';
import ContractIcon from 'images/contract-icon.png';
import isMeIcon from 'images/me.png';
import InternalContractIcon from 'images/internal-contract-icon.png';
import VerifiedIcon from 'images/verified.png';
import { media, sizes } from 'styles/media';
import {
  NETWORK_TYPE,
  NETWORK_TYPES,
  // CONTRACTS_NAME_LABEL,
} from 'utils/constants';
import { monospaceFont } from 'styles/variable';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { useGlobalData } from 'utils/hooks/useGlobal';
import { LOCALSTORAGE_KEYS_MAP } from 'utils/constants';
import ICON_ENS from 'images/logo-cns.svg';

interface Props {
  value: string; // address value
  alias?: string; // address alias, such as contract name, miner name, default null
  contractCreated?: string; // contract creation address
  maxWidth?: number; // address max width for view, default 200/170 for default, 400 for full
  isFull?: boolean; // show full address, default false
  link?: boolean; // add link to address, default true
  isMe?: boolean; // when `address === portal selected address`, set isMe to true to add special tag, default false
  suffixAddressSize?: number; // suffix address size, default is 8
  showIcon?: boolean; // whether show contract icon, default true
  verify?: boolean; // show verified contract icon or unverified contract icon
  isEspaceAddress?: boolean; // check the address if is a eSpace hex address, if yes, link to https://evm.confluxscan.net/address/{hex_address}
  showAddressLabel?: boolean;
  showENSLabel?: boolean;
}

const defaultPCMaxWidth = 138;
const defaultMobileMaxWidth =
  NETWORK_TYPE === NETWORK_TYPES.mainnet ? 106 : 140;
const defaultPCSuffixAddressSize =
  NETWORK_TYPE === NETWORK_TYPES.mainnet ? 8 : 4;
const defaultPCSuffixPosAddressSize = 10;
const defaultMobileSuffixAddressSize = 4;

const getLabelInfo = (label, type) => {
  if (label) {
    let trans: string = '';
    let icon: React.ReactNode = null;

    if (type === 'tag') {
      trans = translations.profile.tip.label;
      icon = <Bookmark color="var(--theme-color-gray2)" size={16} />;
    } else if (type === 'ens') {
      trans = translations.ens.label;
      icon = (
        <img
          src={ICON_ENS}
          style={{
            marginBottom: '2px',
            marginRight: '2px',
          }}
          alt=""
        />
      );
    }

    // change different label with different style
    // label = <mark>{label}</mark>

    return {
      label,
      icon: (
        <IconWrapper>
          <Text span hoverValue={<Translation>{t => t(trans)}</Translation>}>
            {icon}
          </Text>
        </IconWrapper>
      ),
    };
  }

  return {
    label: '',
    icon: null,
  };
};

// ≈ 2.5 ms
const RenderAddress = ({
  cfxAddress,
  alias,
  hoverValue,
  hrefAddress,
  content,
  link = true,
  isFull = false,
  style = {},
  maxWidth,
  suffixSize = defaultPCSuffixAddressSize,
  prefix = null,
  suffix = null,
  type = 'pow',
  addressLabel = '',
  ENSLabel = '',
}: any) => {
  const aftercontent =
    type === 'pow'
      ? cfxAddress && !isFull && !ENSLabel && !addressLabel && !alias
        ? cfxAddress.substr(-suffixSize)
        : ''
      : '';

  let text: React.ReactNode = null;

  if (link) {
    if (typeof link === 'string') {
      text = (
        <LinkWrapper
          style={style}
          href={link}
          maxwidth={isFull ? 430 : maxWidth}
          alias={alias}
          aftercontent={aftercontent}
        >
          <span>{content || alias || cfxAddress}</span>
        </LinkWrapper>
      );
    } else {
      const href = `/${type === 'pow' ? 'address' : 'pos/accounts'}/${
        hrefAddress || cfxAddress
      }`;
      text = (
        <LinkWrapper
          style={style}
          href={href}
          maxwidth={isFull ? 430 : maxWidth}
          alias={alias}
          aftercontent={aftercontent}
        >
          <span>
            {content || ENSLabel || addressLabel || alias || cfxAddress}
          </span>
        </LinkWrapper>
      );
    }
  } else {
    text = (
      <PlainWrapper
        style={style}
        maxwidth={isFull ? 430 : maxWidth}
        alias={alias}
        aftercontent={aftercontent}
      >
        <span>
          {content || ENSLabel || addressLabel || alias || cfxAddress}
        </span>
      </PlainWrapper>
    );
  }

  return (
    <AddressWrapper>
      {prefix}
      <Text
        span
        hoverValue={
          <>
            {ENSLabel ? (
              <div>
                <span>
                  <Translation>{t => t(translations.ens.tip)}</Translation>
                </span>
                {ENSLabel}
              </div>
            ) : null}
            {addressLabel ? (
              <div>
                <span>
                  <Translation>
                    {t => t(translations.profile.address.myNameTag)}
                  </Translation>
                </span>
                {addressLabel}
              </div>
            ) : null}
            {alias ? (
              <>
                <span>
                  <Translation>
                    {t => t(translations.profile.address.publicNameTag)}
                  </Translation>
                </span>
                {alias}
              </>
            ) : null}
            <div>{hoverValue || cfxAddress}</div>
          </>
        }
      >
        {text}
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
      link = true,
      isMe = false,
      suffixAddressSize,
      showIcon = true,
      t,
      verify = false,
      isEspaceAddress,
      showAddressLabel = true,
      showENSLabel = true,
    }: Props & WithTranslation) => {
      const [globalData = {}] = useGlobalData();

      const suffixSize =
        suffixAddressSize ||
        (window.innerWidth <= sizes.m
          ? defaultMobileSuffixAddressSize
          : defaultPCSuffixAddressSize);

      // check if the address is a contract create address
      if (!value) {
        const txtContractCreation = t(
          translations.transaction.contractCreation,
        );

        if (contractCreated) {
          let prefixIcon: React.ReactNode = null;
          // private name tag
          let addressLabel: React.ReactNode = null;
          // ens name tag
          let ENSLabel: React.ReactNode = null;
          // global ens name tag
          const gENSLabel = globalData.ens[contractCreated];
          // global private name tag
          const gAddressLabel =
            globalData[LOCALSTORAGE_KEYS_MAP.addressLabel][
              formatAddress(contractCreated)
            ];

          if (showAddressLabel && gAddressLabel) {
            const { label, icon } = getLabelInfo(gAddressLabel, 'tag');

            addressLabel = label;
            prefixIcon = icon;
          }

          if (showENSLabel && gENSLabel) {
            const { label, icon } = getLabelInfo(gENSLabel, 'ens');

            ENSLabel = label;
            prefixIcon = icon;
          }

          return RenderAddress({
            cfxAddress: '',
            alias: alias || txtContractCreation,
            addressLabel,
            ENSLabel,
            hoverValue: formatAddress(contractCreated),
            hrefAddress: formatAddress(contractCreated),
            link,
            isFull,
            maxWidth: 160,
            suffixSize,
            prefix: (
              <IconWrapper>
                {prefixIcon}
                <Text span hoverValue={txtContractCreation}>
                  <img src={ContractIcon} alt={txtContractCreation} />
                </Text>
              </IconWrapper>
            ),
          });
        }

        // If a txn receipt has no 'to' address or 'contractCreated', show -- for temp
        return <>--</>;
      }

      if (isEspaceAddress) {
        const tip = t(translations.general.eSpaceAddress);
        const hexAddress = SDK.format.hexAddress(value);
        const netowrkId =
          NETWORK_TYPE === NETWORK_TYPES.mainnet ? '1030' : '71';
        const url = `${window.location.protocol}${getUrl(
          netowrkId,
        )}/address/${hexAddress}`;

        return RenderAddress({
          cfxAddress: hexAddress,
          alias: formatString(hexAddress, 'hexAddress'),
          hoverValue: hexAddress,
          link: url,
          isFull,
          maxWidth,
          suffixSize: 0,
          prefix: (
            <IconWrapper>
              <Text span hoverValue={tip}>
                <File size={16} color="#17B38A" />
              </Text>
            </IconWrapper>
          ),
        });
      }

      // check if the address is a valid conflux address
      if (!isAddress(value)) {
        const tip = t(translations.general.invalidAddress);

        return RenderAddress({
          cfxAddress: value,
          alias,
          hoverValue: `${tip}: ${value}`,
          content: alias ? formatString(alias, 'tag') : value,
          link: false,
          isFull,
          maxWidth,
          suffixSize,
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

      const cfxAddress = formatAddress(value);

      // if (!alias) {
      //   alias = CONTRACTS_NAME_LABEL[cfxAddress]; // may use later
      // }

      // zero address auto set alias
      if (!alias && isZeroAddress(cfxAddress)) {
        alias = t(translations.general.zeroAddress);
      }

      let prefixIcon: React.ReactNode = null;
      // private name tag
      let addressLabel: React.ReactNode = null;
      // ens name tag
      let ENSLabel: React.ReactNode = null;
      // global ens name tag
      const gENSLabel = globalData.ens[cfxAddress];
      // global private name tag
      const gAddressLabel =
        globalData[LOCALSTORAGE_KEYS_MAP.addressLabel][
          formatAddress(cfxAddress)
        ];

      if (showAddressLabel && gAddressLabel) {
        const { label, icon } = getLabelInfo(gAddressLabel, 'tag');

        addressLabel = label;
        prefixIcon = icon;
      }

      if (showENSLabel && gENSLabel) {
        const { label, icon } = getLabelInfo(gENSLabel, 'ens');

        ENSLabel = label;
        prefixIcon = icon;
      }

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
          addressLabel,
          ENSLabel,
          link,
          isFull,
          maxWidth,
          suffixSize,
          prefix: showIcon ? (
            <IconWrapper className={`${isFull ? 'icon' : ''}`}>
              {prefixIcon}
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
          addressLabel,
          ENSLabel,
          link,
          isFull,
          maxWidth,
          suffixSize,
          suffix: (
            <IconWrapper>
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
        addressLabel,
        ENSLabel,
        link,
        isFull,
        maxWidth,
        suffixSize,
        prefix: prefixIcon,
      });
    },
  ),
);

export const PoSAddressContainer = withTranslation()(
  React.memo(
    ({
      value,
      alias,
      maxWidth,
      isFull = false,
      link = true,
      isMe = false,
      suffixAddressSize,
      t,
    }: Props & WithTranslation) => {
      const suffixSize =
        suffixAddressSize ||
        (window.innerWidth <= sizes.m
          ? defaultMobileSuffixAddressSize
          : defaultPCSuffixPosAddressSize);

      if (!value) {
        return <>--</>;
      }

      // first check if the address is a valid conflux address
      if (!isPosAddress(value)) {
        const tip = t(translations.general.invalidPosAddress);
        return RenderAddress({
          cfxAddress: value,
          alias,
          hoverValue: `${tip}: ${value}`,
          content: alias
            ? formatString(alias, 'tag')
            : formatString(value, 'posAddress'),
          link: false,
          isFull,
          maxWidth,
          suffixSize,
          style: { color: '#e00909' },
          prefix: (
            <IconWrapper>
              <Text span hoverValue={tip}>
                <AlertTriangle size={16} color="#e00909" />
              </Text>
            </IconWrapper>
          ),
          type: 'pos',
        });
      }

      const content = formatString(value, 'posAddress');

      // if (!alias) {
      //   alias = CONTRACTS_NAME_LABEL[cfxAddress]; // may use later
      // }

      if (isMe) {
        return RenderAddress({
          cfxAddress: value,
          alias,
          link,
          isFull,
          maxWidth,
          suffixSize,
          suffix: (
            <IconWrapper>
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
          content: content,
          type: 'pos',
        });
      }

      return RenderAddress({
        cfxAddress: value,
        alias,
        link,
        isFull,
        maxWidth,
        suffixSize,
        type: 'pos',
        content: content,
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
`;

const addressStyle = (props: any) => ` 
  position: relative;
  box-sizing: border-box;
  display: inline-flex !important;
  flex-wrap: nowrap;
  max-width: ${
    props.maxwidth || (props.alias ? 160 : defaultPCMaxWidth)
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
      props.maxwidth || (props.alias ? 140 : defaultMobileMaxWidth)
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
