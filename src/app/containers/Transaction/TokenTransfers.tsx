import React, { memo, useMemo } from 'react';
import { Description } from '@cfxjs/sirius-next-common/dist/components/Description';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components';
import iconInfo from 'images/info.svg';
import {
  AddressNameMap,
  getItemByKey,
  renderAddressWithNameMap,
} from './utils';
import lodash from 'lodash';
import { CFX_TOKEN_TYPES } from 'utils/constants';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { TokenTypeTag } from 'app/components/TxnComponents';
import { NFTPreview } from 'app/components/NFTPreview';
import { formatAddress, isZeroAddress, formatBalance } from 'utils';
import { DefaultTokenIcon } from '@cfxjs/sirius-next-common/dist/components/Icons';

interface TokenTransferItem {
  transactionLogIndex: number;
  address: string;
  from: string;
  to: string;
  value: string;
  transferType: string;
  batch?: TokenTransferItem[];
  // For ERC721 or ERC1155
  tokenId?: string;
  // For ERC1155
  batchIndex?: number;
}

const useTokenInfo = (
  item: TokenTransferItem,
  nameMap?: Record<string, AddressNameMap>,
) => {
  const { t } = useTranslation();
  return useMemo(() => {
    let imgSrc = '';
    let tokenName = 'unknown';
    let tokenSymbol = 'unknown';
    let tokenDecimals = 1;
    const tokenItem = getItemByKey('token', nameMap, item.address);
    if (tokenItem) {
      tokenName = tokenItem.name || t(translations.general.notAvailable);
      tokenSymbol = tokenItem.symbol || t(translations.general.notAvailable);
      tokenDecimals = tokenItem.decimals ?? 1;
      imgSrc = tokenItem.iconUrl ?? '';
    }
    const imgIcon = imgSrc ? (
      <img className="logo" src={imgSrc} alt="logo" />
    ) : (
      <DefaultTokenIcon className="logo" />
    );
    const nameContainer = (
      <Link href={`/token/${item.address}`} className="nameItem">
        {`${tokenName} (${tokenSymbol})`}
      </Link>
    );
    return {
      imgIcon,
      nameContainer,
      tokenDecimals,
    };
  }, [nameMap, item.address, t]);
};

const ERC20TransferItem = ({
  index,
  item,
  nameMap,
}: {
  index: number;
  item: TokenTransferItem;
  nameMap?: Record<string, AddressNameMap>;
}) => {
  const { t, i18n } = useTranslation();
  const renderAddress = renderAddressWithNameMap(nameMap);
  const { imgIcon, nameContainer, tokenDecimals } = useTokenInfo(item, nameMap);
  return (
    <div
      className="lineContainer"
      key={`transfer${CFX_TOKEN_TYPES.erc20}${index}`}
    >
      <span className="index">{index + 1}. </span>
      <span className="from">{t(translations.transaction.from)}</span>
      <InlineWrapper>
        {renderAddress(item.from, item, 'from', false)}
      </InlineWrapper>
      <span className="to">{t(translations.transaction.to)}</span>
      <InlineWrapper>{renderAddress(item.to, item, 'to', false)}</InlineWrapper>
      <span className="for">{t(translations.transaction.for)}</span>
      <span className="value">
        {lodash.isNil(tokenDecimals)
          ? item.value
          : `${formatBalance(item.value, tokenDecimals, true)}`}
      </span>
      <span>{i18n.language === 'zh-CN' ? '个' : null}</span>
      <span>{imgIcon}</span>
      <span>{nameContainer}</span> <TokenTypeTag type="crc20" />
    </div>
  );
};
const ERC721TransferItem = ({
  index,
  item,
  nameMap,
}: {
  index: number;
  item: TokenTransferItem;
  nameMap?: Record<string, AddressNameMap>;
}) => {
  const { t, i18n } = useTranslation();
  const renderAddress = renderAddressWithNameMap(nameMap);
  const { imgIcon, nameContainer } = useTokenInfo(item, nameMap);
  return (
    <div
      className="lineContainer"
      key={`transfer${CFX_TOKEN_TYPES.erc721}${index}`}
    >
      <span className="index">{index + 1}. </span>
      <span className="from">{t(translations.transaction.from)}</span>
      <InlineWrapper>
        {renderAddress(item.from, item, 'from', false)}
      </InlineWrapper>
      <span className="to">{t(translations.transaction.to)}</span>
      <InlineWrapper>{renderAddress(item.to, item, 'to', false)}</InlineWrapper>
      <span className="for">{t(translations.transaction.for)}</span>
      <span className="type">1</span>
      <span>{i18n.language === 'zh-CN' ? '个' : null}</span>
      <span>{imgIcon}</span>
      <span>{nameContainer}</span> <TokenTypeTag type="crc721" />
      <span className="type">
        {item.tokenId && item.tokenId.length > 10 ? (
          <>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
          </>
        ) : (
          <>&nbsp;</>
        )}
        {t(translations.transaction.tokenId)}:
        <span className="tokenId">
          {item.tokenId}
          {!isZeroAddress(formatAddress(item.to)) && (
            <NFTPreview contractAddress={item.address} tokenId={item.tokenId} />
          )}
        </span>
      </span>
    </div>
  );
};

const ERC1155TransferItem = ({
  index,
  item,
  nameMap,
}: {
  index: number;
  item: TokenTransferItem;
  nameMap?: Record<string, AddressNameMap>;
}) => {
  const { t, i18n } = useTranslation();
  const renderAddress = renderAddressWithNameMap(nameMap);
  const { imgIcon, nameContainer, tokenDecimals } = useTokenInfo(item, nameMap);
  return (
    <div
      className="lineContainer"
      key={`transfer${CFX_TOKEN_TYPES.erc1155}${index}`}
    >
      <span className="index">{index + 1}. </span>
      <span className="from">{t(translations.transaction.from)}</span>
      <InlineWrapper>
        {renderAddress(item.from, item, 'from', false)}
      </InlineWrapper>
      <span className="to">{t(translations.transaction.to)}</span>
      <InlineWrapper>{renderAddress(item.to, item, 'to', false)}</InlineWrapper>
      <span>{imgIcon}</span>
      <span>{nameContainer}</span> <TokenTypeTag type="crc1155" />
      {item.batch?.map((item, i) => {
        return (
          <span key={`transfer${CFX_TOKEN_TYPES.erc1155}${index}${i}`}>
            <br />
            <span className="batch">
              - {t(translations.transaction.for)}{' '}
              <span className="value">
                {lodash.isNil(tokenDecimals)
                  ? item.value
                  : `${formatBalance(item.value, tokenDecimals, true)}`}
              </span>
              <span>{i18n.language === 'zh-CN' ? '个' : null}</span>
              &nbsp;&nbsp;{t(translations.transaction.tokenId)}:{' '}
              <span className="tokenId">
                {item.tokenId}
                {!isZeroAddress(formatAddress(item.to)) && (
                  <NFTPreview
                    contractAddress={item.address}
                    tokenId={item.tokenId}
                  />
                )}
              </span>
            </span>
          </span>
        );
      })}
    </div>
  );
};

const TransferItem = ({
  item,
  nameMap,
  index,
}: {
  item: TokenTransferItem;
  nameMap?: Record<string, AddressNameMap>;
  index: number;
}) => {
  if (item.transferType === CFX_TOKEN_TYPES.erc20) {
    return <ERC20TransferItem item={item} nameMap={nameMap} index={index} />;
  }
  if (item.transferType === CFX_TOKEN_TYPES.erc721) {
    return <ERC721TransferItem item={item} nameMap={nameMap} index={index} />;
  }
  if (item.transferType === CFX_TOKEN_TYPES.erc1155) {
    return <ERC1155TransferItem item={item} nameMap={nameMap} index={index} />;
  }
  return null;
};
export const TokenTransfers = memo(
  ({
    transferList = [],
    nameMap,
  }: {
    transferList?: TokenTransferItem[];
    nameMap?: Record<string, AddressNameMap>;
  }) => {
    const { t } = useTranslation();
    if (transferList.length === 0) return null;
    return (
      <Description
        title={
          <>
            <Tooltip title={t(translations.toolTip.tx.tokenTransferred)}>
              {`${t(translations.transaction.tokenTransferred)} ${
                transferList.length > 1 ? `(${transferList.length})` : ''
              }`}
            </Tooltip>
            {transferList.length > 1 ? (
              <Tooltip
                title={t(translations.transaction.tipOfTokenTransferCount)}
              >
                <IconImg src={iconInfo} alt="warning-icon" />
              </Tooltip>
            ) : null}
          </>
        }
      >
        <div
          style={
            transferList.length > 5
              ? { height: '8.5714rem', overflow: 'auto' }
              : undefined
          }
          className={`transferListContainer ${
            transferList.length === 1 ? 'onlyOne' : ''
          }`}
        >
          {transferList.map((item, index) => (
            <TransferItem
              key={index}
              item={item}
              nameMap={nameMap}
              index={index}
            />
          ))}
        </div>
      </Description>
    );
  },
  lodash.isEqual,
);

const IconImg = styled.img`
  width: 1.2857rem;
  margin-left: 0.3571rem;
  padding-right: 0.2857rem;
  margin-top: -0.2765rem;
`;

const InlineWrapper = styled.div`
  display: inline-block;
  margin-left: 3px;
  margin-right: 3px;
`;
