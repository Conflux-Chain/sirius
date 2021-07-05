import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components/macro';
import { formatBalance } from 'utils';
import { Link } from 'app/components/Link';
import { cfxTokenTypes } from 'utils/constants';
import { defaultTokenIcon } from '../../../constants';
import { AddressContainer } from 'app/components/AddressContainer';
import { renderAddress } from 'utils/tableColumns/token';
import clsx from 'clsx';
import { TokenTypeTag } from './TokenTypeTag';

interface Props {
  transferList: Array<any>;
  tokenList?: Array<any>;
  tokenInfoMap?: any;
  type?: string;
}

export const getItemByKey = (key, list, value) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i][key] === value) {
      return list[i];
    }
  }
  return {};
};

// support erc20/721/1155
export const TokenTransfer = ({
  transferList,
  tokenList,
  tokenInfoMap,
  type,
}: Props) => {
  const { t } = useTranslation();

  if (!transferList.length) {
    return null;
  }
  let transferListContainer: Array<any> = [];

  // combine erc1155 batch transfer with batchIndex field
  let batchCombinedTransferList: any = [];

  transferList.forEach((transfer: any) => {
    if (transfer.transferType === cfxTokenTypes.erc1155) {
      // find batch transfers
      const batchCombinedTransferListIndex = batchCombinedTransferList.findIndex(
        trans =>
          trans.transferType === transfer.transferType &&
          trans.address === transfer.address &&
          trans.transactionHash === transfer.transactionHash &&
          trans.from === transfer.from &&
          trans.to === transfer.to,
      );
      if (batchCombinedTransferListIndex < 0) {
        batchCombinedTransferList.push({
          batch: [transfer],
          ...transfer,
        });
      } else {
        batchCombinedTransferList[batchCombinedTransferListIndex].batch.push(
          transfer,
        );
      }
    } else {
      batchCombinedTransferList.push(transfer);
    }
  });

  let index = 1;

  for (let i = 0; i < batchCombinedTransferList.length; i++) {
    const transferItem: any = batchCombinedTransferList[i];
    let imgSrc = '';
    let tokenName = '';
    let tokenSymbol = '';
    let tokenDecimals = 0;
    let tokenItem = {};

    // @todo txn detail page will use aggregated api, and remove tokenList
    if (tokenList) {
      tokenItem = getItemByKey('address', tokenList, transferItem['address']);
    } else if (tokenInfoMap) {
      tokenItem = tokenInfoMap[transferItem['address']] || {};
    }

    if (tokenItem) {
      tokenName = tokenItem['name'] || t(translations.general.notAvailable);
      tokenSymbol = tokenItem['symbol'] || t(translations.general.notAvailable);
      tokenDecimals = tokenItem['decimals'];
      imgSrc = tokenItem['icon'];
    }
    const imgIcon = (
      <img className="logo" src={`${imgSrc || defaultTokenIcon}`} alt="logo" />
    );
    const nameContainer = (
      <Link href={`/token/${transferItem['address']}`} className="nameItem">
        {`${tokenName} (${tokenSymbol})`}
      </Link>
    );
    // do not deal with erc721
    switch (transferItem['transferType']) {
      case cfxTokenTypes.erc721: {
        transferListContainer.push(
          <div
            className="lineContainer"
            key={`transfer${cfxTokenTypes.erc721}${i + 1}`}
          >
            <span className="transfer-item-group">
              <span className="index">{index++}. </span>
              <span className="from">{t(translations.transaction.from)} </span>
              <AddressContainer value={transferItem['from']} />
            </span>
            <span className="transfer-item-group">
              <span className="to"> {t(translations.transaction.to)} </span>
              <AddressContainer value={transferItem['to']} />
            </span>
            <span className="transfer-item-group">
              <span className="for"> {t(translations.transaction.for)} </span>
              <span className="type">1</span>
              <span>{imgIcon}</span>
              <span>{nameContainer}</span> <TokenTypeTag type="crc721" />
              <span className="type">
                &nbsp;
                {t(translations.transaction.tokenId)}:
                <span className="tokenId">{transferItem['tokenId']}</span>
              </span>
            </span>
          </div>,
        );
        break;
      }
      case cfxTokenTypes.erc1155: {
        transferListContainer.push(
          <div
            className="lineContainer"
            key={`transfer${cfxTokenTypes.erc1155}${i + 1}`}
          >
            <span className="transfer-item-group">
              <span className="index">{index++}. </span>
              <span className="from">{t(translations.transaction.from)} </span>
              <AddressContainer value={transferItem['from']} />
            </span>
            <span className="transfer-item-group">
              <span className="to"> {t(translations.transaction.to)} </span>
              <AddressContainer value={transferItem['to']} />
              <span>{imgIcon}</span>
              <span>{nameContainer}</span> <TokenTypeTag type="crc1155" />
            </span>
            <span className="transfer-item-group">
              {transferItem['batch'].map((item, index) => (
                <span key={`transfer${cfxTokenTypes.erc1155}${i + 1}${index}`}>
                  <span className="batch">
                    - {t(translations.transaction.for)}{' '}
                    <span className="value">
                      {typeof tokenDecimals !== 'undefined'
                        ? `${formatBalance(item['value'], tokenDecimals, true)}`
                        : item['value']}
                    </span>
                    &nbsp;&nbsp;{t(translations.transaction.tokenId)}:{' '}
                    <span className="tokenId">{item['tokenId']}</span>
                  </span>
                </span>
              ))}
            </span>
          </div>,
        );
        break;
      }
      case cfxTokenTypes.erc20: {
        transferListContainer.push(
          <div
            className="lineContainer"
            key={`transfer${cfxTokenTypes.erc20}${i + 1}`}
          >
            <span className="transfer-item-group">
              <span className="index">{index++}. </span>
              <span className="from">{t(translations.transaction.from)} </span>
              {/* <AddressContainer value={transferItem['from']} /> */}
              <InlineWrapper>
                {renderAddress(
                  transferItem['from'],
                  transferItem,
                  'from',
                  false,
                )}
              </InlineWrapper>
            </span>
            <span className="transfer-item-group">
              <span className="to">{t(translations.transaction.to)} </span>
              {/* <AddressContainer value={transferItem['to']} /> */}
              <InlineWrapper>
                {renderAddress(transferItem['to'], transferItem, 'to', false)}
              </InlineWrapper>
            </span>
            <span className="transfer-item-group">
              <span className="for">{t(translations.transaction.for)} </span>
              <span className="value">
                {typeof tokenDecimals !== 'undefined'
                  ? `${formatBalance(
                      transferItem['value'],
                      tokenDecimals,
                      true,
                    )}`
                  : transferItem['value']}
              </span>
              <span>{imgIcon}</span>
              <span>{nameContainer}</span>
            </span>
          </div>,
        );
        break;
      }
      // not deal with erc721
      default:
        break;
    }
  }

  return (
    <StyledTokenTransferWrapper
      // style={transferListContainerStyle}
      className={
        clsx('transferListContainer', type, {
          onlyOne: transferListContainer.length === 1,
          moreThanFive: transferList.length > 5,
        })
        // `transferListContainer ${
        // transferListContainer.length === 1 ? 'onlyOne' : ''
        // }`
      }
    >
      {transferListContainer}
    </StyledTokenTransferWrapper>
  );
};
TokenTransfer.defaultProps = {
  transferList: [],
  tokenInfoMap: {},
};

const StyledTokenTransferWrapper = styled.div`
  &.onlyOne {
    .lineContainer .index {
      display: none;
    }
  }

  &.moreThanFive {
    height: '8.5714rem';
    overflow: 'auto';
  }

  &.overview {
    .transfer-item-group {
      flex-grow: 1;
      width: 100%;

      .to {
        margin: 0;
      }
      .for {
        margin: 0;
      }
    }
  }

  .logo {
    width: 1.1429rem;
    margin: 0 0.5714rem 0.2143rem;
  }

  .lineContainer {
    line-height: 1.7143rem;
    display: flex;
    flex-wrap: wrap;
  }
  .from {
    margin-right: 0.1429rem;
  }
  .to {
    margin: 0 0.1429rem;
  }
  .for {
    margin: 0 0.1429rem;
  }
  .value {
    margin: 0 0.1429rem;
    color: #002257;
  }
  .type {
    margin: 0 0.1429rem;
  }
  .tokenId {
    margin: 0 0.1429rem;
    color: #002257;
  }
  .batch {
    margin: 0 0.1429rem 0 1.1429rem;
  }
`;

const InlineWrapper = styled.div`
  display: inline-block;
  margin-left: 3px;
  margin-right: 3px;
`;
