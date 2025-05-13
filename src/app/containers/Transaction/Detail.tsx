import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { Spinner } from '@cfxjs/react-ui';
import { Card } from '@cfxjs/sirius-next-common/dist/components/Card';
import { Description } from '@cfxjs/sirius-next-common/dist/components/Description';
import { CopyButton } from '@cfxjs/sirius-next-common/dist/components/CopyButton';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { SkeletonContainer } from '@cfxjs/sirius-next-common/dist/components/SkeletonContainer';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';
import { Age } from '@cfxjs/sirius-next-common/dist/components/Age';
import {
  reqContract,
  reqTokenList,
  reqTransferList,
  reqTransactionEventlogs,
} from 'utils/httpRequest';
import {
  formatBalance,
  formatTimeStamp,
  getPercent,
  toThousands,
  isCoreContractAddress,
  isZeroAddress,
  hideInDotNet,
} from 'utils';
import { formatAddress } from 'utils';
import { CFX_TOKEN_TYPES } from 'utils/constants';
import { ICON_DEFAULT_TOKEN } from 'utils/constants';
import { CoreAddressContainer } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/CoreAddressContainer';
import clsx from 'clsx';
import BigNumber from 'bignumber.js';
import { Security } from 'app/components/Security/Loadable';
import {
  GasFee,
  InputDataNew,
  Status,
  StorageFee,
  TokenTypeTag,
} from 'app/components/TxnComponents';
import { TransactionAction } from '@cfxjs/sirius-next-common/dist/components/TransactionAction/coreTransactionAction';
import _ from 'lodash';
import imgChevronDown from 'images/chevronDown.png';
import { renderAddress } from 'utils/tableColumns/token';
import { NFTPreview } from '../../components/NFTPreview/Loadable';
import { useGlobalData } from 'utils/hooks/useGlobal';
import { CreateTxNote } from '../Profile/CreateTxNote';
import { useNametag } from 'utils/hooks/useNametag';
import iconInfo from 'images/info.svg';
import { LOCALSTORAGE_KEYS_MAP } from 'utils/enum';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
import {
  fromDripToCfx,
  fromDripToGdrip,
} from '@cfxjs/sirius-next-common/dist/utils';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';
import dayjs from 'dayjs';
import { StyledHighlight } from './EventLogs/StyledComponents';

const getStorageFee = byteSize =>
  toThousands(new BigNumber(byteSize).dividedBy(1024).toFixed(2));

// Transaction Detail Page
export const Detail = ({
  data: transactionDetail,
  loading: outerLoading,
  partLoading,
}) => {
  const [visible, setVisible] = useState(false);
  const [globalData] = useGlobalData();
  const { t, i18n } = useTranslation();
  const [isContract, setIsContract] = useState(false);
  const [eventlogs, setEventlogs] = useState<any>([]);
  const [contractInfo, setContractInfo] = useState({});
  const [transferList, setTransferList] = useState([]);
  const [innerLoading, setInnerLoading] = useState(false);
  const [tokenList, setTokenList] = useState([]);
  const { hash: routeHash } = useParams<{
    hash: string;
  }>();
  const {
    epochHeight,
    from,
    to,
    value,
    gasPrice,
    gas,
    nonce,
    blockHash,
    storageLimit,
    chainId,
    transactionIndex,
    epochNumber,
    syncTimestamp,
    gasFee,
    gasUsed,
    gasCharged,
    status,
    data,
    contractCreated,
    confirmedEpochCount,
    txExecErrorInfo,
    gasCoveredBySponsor,
    storageCoveredBySponsor,
    storageReleased,
    storageCollateralized,
    baseFeePerGas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    burntGasFee,
    type,
    typeDesc,
    txExecErrorMsg,
  } = transactionDetail;
  const [folded, setFolded] = useState(true);
  const nametags = useNametag([from, to]);

  const loading = innerLoading || outerLoading;
  const notEnoughCash = txExecErrorMsg && /^NotEnoughCash/.test(txExecErrorMsg);
  const isValidGasCharged =
    !notEnoughCash || new BigNumber(gasCharged).isEqualTo(gas);

  const fetchTxTransfer = async toCheckAddress => {
    setInnerLoading(true);

    try {
      const proArr: Promise<any>[] = [];
      const _isContract =
        isContract ||
        (typeof toCheckAddress === 'string' &&
          isCoreContractAddress(toCheckAddress));
      if (_isContract) {
        setIsContract(true);

        const contractFields = [
          'address',
          'type',
          'name',
          'website',
          'tokenName',
          'tokenSymbol',
          'token',
          'tokenDecimal',
          'abi',
          'bytecode',
          'iconUrl',
          'sourceCode',
          'typeCode',
        ];

        proArr.push(
          reqContract({ address: toCheckAddress, fields: contractFields }),
        );
      }

      const transferFields = 'token';
      proArr.push(
        reqTransferList({
          transactionHash: routeHash,
          fields: transferFields,
          limit: 100,
          reverse: false,
        }),
      );

      proArr.push(
        reqTransactionEventlogs({
          transactionHash: routeHash,
          aggregate: false,
        }),
      );

      const proRes = await Promise.all(proArr);

      if (_isContract) {
        const contractResponse = proRes.shift();
        setContractInfo(contractResponse);
      }

      const transferListResponse = proRes[0];
      const list = transferListResponse.list || [];
      setTransferList(list);

      const eventlogsResponse = proRes[1];
      setEventlogs(eventlogsResponse.list);

      let addressList = list.map(v => v.address);
      addressList = Array.from(new Set(addressList));
      const tokenListResponse = await reqTokenList({
        addressArray: addressList,
        fields: ['iconUrl'],
      });

      setTokenList(tokenListResponse.list || []);
    } catch (e) {
      console.error('fetchTxTransfer error: ', e);
    } finally {
      setInnerLoading(false);
    }
  };

  useEffect(() => {
    if (!to) return;
    fetchTxTransfer(to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to]);

  const addressContent = useCallback(
    (isFull = false, address) => {
      const addr = formatAddress(address);
      return (
        <span>
          <StyledHighlight scope="address" value={addr}>
            <CoreAddressContainer value={addr} isFull={isFull} />
          </StyledHighlight>{' '}
          {nametags[addr]?.nameTag ? `(${nametags[addr]?.nameTag})` : null}{' '}
          <CopyButton copyText={addr} />
        </span>
      );
    },
    [nametags],
  );

  const generatedDiv = () => {
    if (to) {
      if (isContract) {
        return (
          <Description
            title={
              <Tooltip title={t(translations.toolTip.tx.to)}>
                {t(translations.transaction.to)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={loading}>
              {t(translations.transaction.contract)}{' '}
              {contractInfo && (
                <>
                  {contractInfo['token'] && contractInfo['token']['iconUrl'] ? (
                    <img
                      className="logo"
                      src={
                        contractInfo['token'] &&
                        contractInfo['token']['iconUrl']
                      }
                      alt="icon"
                    />
                  ) : null}
                  <Link href={`/address/${formatAddress(to)}`}>
                    {contractInfo['name'] ||
                      (contractInfo['token'] && contractInfo['token']['name']
                        ? `${contractInfo['token']['name']}`
                        : '')}
                  </Link>{' '}
                </>
              )}
              {addressContent(true, to)}
            </SkeletonContainer>
          </Description>
        );
      } else {
        return (
          <Description
            title={
              <Tooltip title={t(translations.toolTip.tx.to)}>
                {t(translations.transaction.to)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={loading}>
              {addressContent(true, to)}
            </SkeletonContainer>
          </Description>
        );
      }
    } else if (contractCreated) {
      return (
        <Description
          title={
            <Tooltip title={t(translations.toolTip.tx.to)}>
              {t(translations.transaction.to)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            <span className="label">
              {t(translations.transaction.contract)}
            </span>
            <CoreAddressContainer
              value={transactionDetail['contractCreated']}
              isFull={true}
            />{' '}
            <CopyButton
              copyText={formatAddress(transactionDetail['contractCreated'])}
            />
            &nbsp; {t(translations.transaction.created)}
          </SkeletonContainer>
        </Description>
      );
    } else {
      return (
        <Description
          title={
            <Tooltip title={t(translations.toolTip.tx.to)}>
              {t(translations.transaction.to)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {t(translations.transaction.contractCreation)}
          </SkeletonContainer>
        </Description>
      );
    }
  };
  const getItemByKey = (key, list, value) => {
    for (let i = 0; i < list.length; i++) {
      if (list[i][key] === value) {
        return list[i];
      }
    }
    return {};
  };
  const transferToken = useMemo(() => {
    let transferListInfo: Array<any> = [];
    // combine erc1155 batch transfer with batchIndex field
    let batchCombinedTransferList: any = [];
    if (transferList && transferList.length > 0) {
      transferList.forEach((transfer: any) => {
        if (transfer.transferType === CFX_TOKEN_TYPES.erc1155) {
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
            batchCombinedTransferList[
              batchCombinedTransferListIndex
            ].batch.push(transfer);
          }
        } else {
          batchCombinedTransferList.push(transfer);
        }
      });
    }

    for (let i = 0; i < batchCombinedTransferList.length; i++) {
      const transferItem: any = batchCombinedTransferList[i];

      const tokenItem = getItemByKey(
        'address',
        tokenList,
        transferItem['address'],
      );

      transferListInfo.push({
        token: tokenItem,
      });
    }

    if (_.isObject(contractInfo) && !_.isEmpty(contractInfo)) {
      let contractInfoCopy: any = contractInfo;
      if (contractInfoCopy.token && contractInfoCopy.address) {
        contractInfoCopy.token.address = contractInfoCopy.address;
      }

      transferListInfo.push(contractInfoCopy);
    }
    return transferListInfo;
  }, [contractInfo, tokenList, transferList]);
  // support erc20/721/1155
  const getTransferListDiv = () => {
    if (!isContract) {
      return null;
    }
    if (transferList.length <= 0) {
      return null;
    }
    let transferListContainer: Array<any> = [];
    let transferListContainerStyle = {};

    // combine erc1155 batch transfer with batchIndex field
    let batchCombinedTransferList: any = [];

    transferList.forEach((transfer: any) => {
      if (transfer.transferType === CFX_TOKEN_TYPES.erc1155) {
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
      const tokenItem = getItemByKey(
        'address',
        tokenList,
        transferItem['address'],
      );
      if (tokenItem) {
        tokenName = tokenItem['name'] || t(translations.general.notAvailable);
        tokenSymbol =
          tokenItem['symbol'] || t(translations.general.notAvailable);
        tokenDecimals = tokenItem['decimals'];
        imgSrc = tokenItem['iconUrl'];
      }
      const imgIcon = (
        <img
          className="logo"
          src={`${imgSrc || ICON_DEFAULT_TOKEN}`}
          alt="logo"
        />
      );
      const nameContainer = (
        <Link href={`/token/${transferItem['address']}`} className="nameItem">
          {`${tokenName} (${tokenSymbol})`}
        </Link>
      );
      // do not deal with erc721
      switch (transferItem['transferType']) {
        case CFX_TOKEN_TYPES.erc721: {
          transferListContainer.push(
            <div
              className="lineContainer"
              key={`transfer${CFX_TOKEN_TYPES.erc721}${i + 1}`}
            >
              <span className="index">{index++}. </span>
              <span className="from">{t(translations.transaction.from)}</span>
              <InlineWrapper>
                {renderAddress(
                  transferItem['from'],
                  transferItem,
                  'from',
                  false,
                )}
              </InlineWrapper>
              <span className="to">{t(translations.transaction.to)}</span>
              <InlineWrapper>
                {renderAddress(transferItem['to'], transferItem, 'to', false)}
              </InlineWrapper>
              <span className="for">{t(translations.transaction.for)}</span>
              <span className="type">1</span>
              <span>{i18n.language === 'zh-CN' ? '个' : null}</span>
              <span>{imgIcon}</span>
              <span>{nameContainer}</span> <TokenTypeTag type="crc721" />
              <span className="type">
                {transferItem['tokenId'].length > 10 ? (
                  <>
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                  </>
                ) : (
                  <>&nbsp;</>
                )}
                {t(translations.transaction.tokenId)}:
                <span className="tokenId">
                  {transferItem['tokenId']}
                  {!isZeroAddress(formatAddress(transferItem['to'])) && (
                    <NFTPreview
                      contractAddress={transferItem['address']}
                      tokenId={transferItem['tokenId']}
                    />
                  )}
                </span>
              </span>
            </div>,
          );
          break;
        }
        case CFX_TOKEN_TYPES.erc1155: {
          transferListContainer.push(
            <div
              className="lineContainer"
              key={`transfer${CFX_TOKEN_TYPES.erc1155}${i + 1}`}
            >
              <span className="index">{index++}. </span>
              <span className="from">{t(translations.transaction.from)}</span>
              <InlineWrapper>
                {renderAddress(
                  transferItem['from'],
                  transferItem,
                  'from',
                  false,
                )}
              </InlineWrapper>
              <span className="to">{t(translations.transaction.to)}</span>
              <InlineWrapper>
                {renderAddress(transferItem['to'], transferItem, 'to', false)}
              </InlineWrapper>
              <span>{imgIcon}</span>
              <span>{nameContainer}</span> <TokenTypeTag type="crc1155" />
              {transferItem['batch'].map((item, index) => {
                return (
                  <span
                    key={`transfer${CFX_TOKEN_TYPES.erc1155}${i + 1}${index}`}
                  >
                    <br />
                    <span className="batch">
                      - {t(translations.transaction.for)}{' '}
                      <span className="value">
                        {_.isNil(tokenDecimals)
                          ? item['value']
                          : `${formatBalance(
                              item['value'],
                              tokenDecimals,
                              true,
                            )}`}
                      </span>
                      <span>{i18n.language === 'zh-CN' ? '个' : null}</span>
                      &nbsp;&nbsp;{t(translations.transaction.tokenId)}:{' '}
                      <span className="tokenId">
                        {item['tokenId']}
                        {!isZeroAddress(formatAddress(transferItem['to'])) && (
                          <NFTPreview
                            contractAddress={transferItem['address']}
                            tokenId={item['tokenId']}
                          />
                        )}
                      </span>
                    </span>
                  </span>
                );
              })}
            </div>,
          );
          break;
        }
        case CFX_TOKEN_TYPES.erc20: {
          transferListContainer.push(
            <div
              className="lineContainer"
              key={`transfer${CFX_TOKEN_TYPES.erc20}${i + 1}`}
            >
              <span className="index">{index++}. </span>
              <span className="from">{t(translations.transaction.from)}</span>
              <InlineWrapper>
                {renderAddress(
                  transferItem['from'],
                  transferItem,
                  'from',
                  false,
                )}
              </InlineWrapper>
              <span className="to">{t(translations.transaction.to)}</span>
              <InlineWrapper>
                {renderAddress(transferItem['to'], transferItem, 'to', false)}
              </InlineWrapper>
              <span className="for">{t(translations.transaction.for)}</span>
              <span className="value">
                {_.isNil(tokenDecimals)
                  ? transferItem['value']
                  : `${formatBalance(
                      transferItem['value'],
                      tokenDecimals,
                      true,
                    )}`}
              </span>
              <span>{i18n.language === 'zh-CN' ? '个' : null}</span>
              <span>{imgIcon}</span>
              <span>{nameContainer}</span> <TokenTypeTag type="crc20" />
            </div>,
          );
          break;
        }
        // not deal with erc721
        default:
          break;
      }
    }
    if (transferList.length > 5) {
      transferListContainerStyle = { height: '8.5714rem', overflow: 'auto' };
    }
    return (
      <Description
        title={
          <>
            <Tooltip title={t(translations.toolTip.tx.tokenTransferred)}>
              {`${t(translations.transaction.tokenTransferred)} ${
                transferListContainer.length > 1
                  ? `(${transferListContainer.length})`
                  : ''
              }`}
            </Tooltip>
            {transferListContainer.length > 1 ? (
              <Tooltip
                title={t(translations.transaction.tipOfTokenTransferCount)}
              >
                <IconImg
                  src={iconInfo}
                  alt="warning-icon"
                  className="download-svg-img"
                />
              </Tooltip>
            ) : null}
          </>
        }
      >
        <SkeletonContainer shown={loading}>
          <div
            style={transferListContainerStyle}
            className={`transferListContainer ${
              transferListContainer.length === 1 ? 'onlyOne' : ''
            }`}
          >
            {transferListContainer}
          </div>
        </SkeletonContainer>
      </Description>
    );
  };

  const handleFolded = () => setFolded(folded => !folded);

  const storageReleasedTotal = storageReleased
    ? getStorageFee(
        storageReleased.reduce((prev, curr) => {
          return prev + curr.collaterals ? Number(curr.collaterals) : 0;
        }, 0),
      )
    : 0;
  const txNoteMap = globalData[LOCALSTORAGE_KEYS_MAP.txPrivateNote];
  const txNote = txNoteMap?.[routeHash];

  const txNoteProps = {
    stage: txNote ? 'edit' : 'create',
    visible,
    data: {
      hash: routeHash,
    },
    onOk: () => {
      setVisible(false);
    },
    onCancel: () => {
      setVisible(false);
    },
  };

  const transactionActionElement = useMemo(
    () =>
      TransactionAction({
        transaction: transactionDetail,
        event: eventlogs,
        customInfo: transferToken,
      }),
    [transactionDetail, eventlogs, transferToken],
  );

  return (
    <StyledCardWrapper>
      <Card>
        <Description
          title={
            <Tooltip title={t(translations.toolTip.tx.transactionHash)}>
              {t(translations.transaction.hash)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {routeHash} <CopyButton copyText={routeHash} />
          </SkeletonContainer>
        </Description>
        <Description
          title={
            <Tooltip title={t(translations.toolTip.tx.executedEpoch)}>
              {t(translations.transaction.executedEpoch)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {_.isNil(epochNumber) ? (
              '--'
            ) : (
              <>
                <Link href={`/epoch/${epochNumber}`}>
                  {toThousands(epochNumber)}
                </Link>{' '}
                <CopyButton copyText={epochNumber} />
              </>
            )}
          </SkeletonContainer>
        </Description>
        <Description
          title={
            <Tooltip title={t(translations.toolTip.tx.proposedEpoch)}>
              {t(translations.transaction.proposedEpoch)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            <Link href={`/epoch/${epochHeight}`}>
              {toThousands(epochHeight)}
            </Link>{' '}
            <CopyButton copyText={epochHeight} />
          </SkeletonContainer>
        </Description>
        <Description
          title={
            <Tooltip title={t(translations.toolTip.tx.blockHash)}>
              {t(translations.transaction.blockHash)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {_.isNil(blockHash) ? (
              '--'
            ) : (
              <>
                <Link href={`/block/${blockHash}`}>{blockHash}</Link>{' '}
                <CopyButton copyText={blockHash} />
              </>
            )}
          </SkeletonContainer>
        </Description>
        <Description
          title={
            <Tooltip title={t(translations.toolTip.tx.timestamp)}>
              {t(translations.transaction.timestamp)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {_.isNil(syncTimestamp) ? (
              '--'
            ) : (
              <>
                <Age
                  from={syncTimestamp}
                  retainDurations={4}
                  to={dayjs().valueOf()}
                />
                {` (${formatTimeStamp(syncTimestamp * 1000, 'timezone')})`}
              </>
            )}
          </SkeletonContainer>
        </Description>
        {status === 0 && transactionActionElement.show && (
          <Description
            title={
              <>
                <Tooltip title={t(translations.transaction.action.tooltip)}>
                  {t(translations.transaction.action.title)}
                </Tooltip>
              </>
            }
          >
            {loading ? (
              <SkeletonContainer shown={true}></SkeletonContainer>
            ) : (
              transactionActionElement.content
            )}
          </Description>
        )}
        <Description
          title={
            <Tooltip title={t(translations.toolTip.tx.status)}>
              {t(translations.transaction.status)}
            </Tooltip>
          }
        >
          {loading ? (
            <SkeletonContainer shown={loading}></SkeletonContainer>
          ) : (
            <Status
              type={status}
              txExecErrorInfo={txExecErrorInfo}
              address={from}
              hash={routeHash}
            ></Status>
          )}
        </Description>
        <Description
          title={
            <Tooltip title={t(translations.toolTip.tx.security)}>
              {t(translations.block.security)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {_.isNil(blockHash) ? (
              '--'
            ) : (
              <>
                <Security
                  blockHash={blockHash}
                  epochNumber={epochNumber}
                ></Security>
                <StyledEpochConfirmationsWrapper>
                  {t(translations.transaction.epochConfirmations, {
                    count: _.isNil(confirmedEpochCount)
                      ? '--'
                      : confirmedEpochCount,
                  })}
                  {partLoading ? (
                    <Spinner
                      size="small"
                      style={{ display: 'inline-block', marginLeft: 5 }}
                    />
                  ) : null}
                </StyledEpochConfirmationsWrapper>
              </>
            )}
          </SkeletonContainer>
        </Description>
        <Description
          title={
            <Tooltip title={t(translations.toolTip.tx.from)}>
              {t(translations.transaction.from)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {addressContent(true, from)}
          </SkeletonContainer>
        </Description>
        {generatedDiv()}

        {/* @todo check if can be use new TokenTransfer component to instead of getTransferListDiv() */}
        {/* {isContract ? (
          <TokenTransfer tokenList={tokenList} transferList={transferList} />
        ) : null} */}
        {getTransferListDiv()}
        {hideInDotNet(
          <>
            <Description
              title={
                <Tooltip title={t(translations.toolTip.tx.value)}>
                  {t(translations.transaction.value)}
                </Tooltip>
              }
            >
              <SkeletonContainer shown={loading}>
                {value ? `${fromDripToCfx(value, true)} CFX` : '--'}
              </SkeletonContainer>
            </Description>
            <Description
              title={
                <Tooltip title={t(translations.toolTip.tx.transactionFee)}>
                  {t(translations.transaction.transactionFee)}
                </Tooltip>
              }
            >
              <SkeletonContainer shown={loading}>
                <GasFee fee={gasFee} sponsored={gasCoveredBySponsor} />
              </SkeletonContainer>
            </Description>
          </>,
        )}
        <div
          className={clsx('detailResetWrapper', {
            folded: folded,
          })}
        >
          <Description
            title={
              <Tooltip title={t(translations.toolTip.tx.gasPrice)}>
                {t(translations.transaction.gasPrice)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={loading}>
              {`${fromDripToGdrip(gasPrice, false, {
                precision: 9,
                minNum: 1e-9,
              })} Gdrip`}
            </SkeletonContainer>
          </Description>
          <Description
            title={
              <Tooltip
                title={
                  <StyleToolTipText>
                    {t(translations.toolTip.tx.gasLimitTip)}
                    <br />
                    <br />
                    {t(translations.toolTip.tx.gasUsedTip)}
                    <br />
                    <br />
                    {t(translations.toolTip.tx.gasChargedip)}
                  </StyleToolTipText>
                }
              >
                {t(translations.transaction.gasUsed)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={loading}>
              {!_.isNil(gasUsed) && gasUsed !== '0' && gas ? (
                <>
                  {`${toThousands(gas)} | ${toThousands(gasUsed)} (${getPercent(
                    gasUsed,
                    gas,
                  )}) | ${isValidGasCharged ? toThousands(gasCharged) : '--'}`}
                </>
              ) : (
                <>--</>
              )}
            </SkeletonContainer>
          </Description>
          <Description
            title={
              <Tooltip
                title={
                  <>
                    {t(translations.toolTip.tx.baseFee)}
                    <br />
                    {t(translations.toolTip.tx.maxFee)}
                  </>
                }
              >
                {t(translations.transaction.gasFee)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={loading}>
              <GasFeeLabelWrapper>
                {t(translations.transaction.baseFee)}
              </GasFeeLabelWrapper>
              {fromDripToGdrip(baseFeePerGas, true)} Gdrip
              {type !== 0 && type !== 1 && (
                <>
                  {' | '}
                  <GasFeeLabelWrapper>
                    {t(translations.transaction.maxFee)}
                  </GasFeeLabelWrapper>
                  {fromDripToGdrip(maxFeePerGas, true)} Gdrip
                  {' | '}
                  <GasFeeLabelWrapper>
                    {t(translations.transaction.maxPriorityFee)}
                  </GasFeeLabelWrapper>
                  {fromDripToGdrip(maxPriorityFeePerGas, true)} Gdrip
                </>
              )}
            </SkeletonContainer>
          </Description>
          <Description
            title={
              <Tooltip title={t(translations.toolTip.tx.burntFees)}>
                {t(translations.transaction.burntFees)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={loading}>
              {burntGasFee
                ? `🔥 ${fromDripToCfx(burntGasFee, true)} CFX`
                : '--'}
            </SkeletonContainer>
          </Description>
          {hideInDotNet(
            <Description
              title={
                <Tooltip
                  title={t(translations.toolTip.tx.storageCollateralized)}
                >
                  {t(translations.transaction.storageCollateralized)}
                </Tooltip>
              }
            >
              <SkeletonContainer shown={loading}>
                <StorageFee
                  fee={storageCollateralized}
                  sponsored={storageCoveredBySponsor}
                />
              </SkeletonContainer>
            </Description>,
          )}
          <Description
            title={
              <Tooltip title={t(translations.toolTip.tx.storageLimit)}>
                {t(translations.transaction.storageLimit)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={loading}>
              {_.isNil(storageCollateralized)
                ? '--'
                : toThousands(storageCollateralized)}
              /{toThousands(storageLimit)}
            </SkeletonContainer>
          </Description>
          {hideInDotNet(
            <Description
              title={
                <Tooltip title={t(translations.toolTip.tx.storageReleased)}>
                  {t(translations.transaction.storageReleased)}
                </Tooltip>
              }
            >
              <SkeletonContainer shown={loading}>
                {storageReleasedTotal} CFX
              </SkeletonContainer>
            </Description>,
          )}
          <Description
            title={
              <Tooltip title={t(translations.toolTip.tx.transactionAttributes)}>
                {t(translations.transaction.transactionAttributes)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={loading}>
              <AttributeWrapper>
                <Text
                  className="attribute"
                  hoverValue={t(translations.toolTip.tx.txnType[type])}
                  tag="span"
                >
                  {t(translations.transaction.txnType, {
                    type: _.isNil(type) ? '--' : type,
                    typeDesc: _.isNil(typeDesc) ? '' : `(${typeDesc})`,
                  })}
                </Text>
                <Text
                  className="attribute"
                  hoverValue={t(translations.toolTip.tx.nonce)}
                  tag="span"
                >
                  {t(translations.transaction.nonce, {
                    num: toThousands(nonce),
                  })}
                </Text>
                <Text
                  className="attribute"
                  hoverValue={t(translations.toolTip.tx.position)}
                  tag="span"
                >
                  {t(translations.transaction.position, {
                    num: _.isNil(transactionIndex) ? '--' : transactionIndex,
                  })}
                </Text>
                <Text
                  className="attribute"
                  hoverValue={t(translations.toolTip.tx.chainID)}
                  tag="span"
                >
                  {t(translations.transaction.chainID, {
                    num: _.isNil(chainId) ? '--' : chainId,
                  })}
                </Text>
              </AttributeWrapper>
            </SkeletonContainer>
          </Description>
          {/* only send to user type will with empty data */}
          {!data || data === '0x' ? null : (
            <Description
              title={
                <Tooltip title={t(translations.transaction.inputTips)}>
                  {t(translations.transaction.inputData)}
                </Tooltip>
              }
              className="inputLine"
            >
              <SkeletonContainer shown={loading}>
                <InputDataNew
                  txnHash={routeHash}
                  toHash={to}
                  data={data}
                  isContractCreated={!!contractCreated}
                ></InputDataNew>
              </SkeletonContainer>
            </Description>
          )}
        </div>
        <Description
          title={
            <StyledFoldButtonWrapper>
              <div
                className={clsx('detailResetFoldButton', {
                  folded: folded,
                })}
                onClick={handleFolded}
              >
                {t(translations.general[folded ? 'viewMore' : 'showLess'])}
              </div>
            </StyledFoldButtonWrapper>
          }
        >
          {' '}
        </Description>
        <Description
          noBorder
          title={
            <Tooltip title={t(translations.profile.tip.note)}>
              {t(translations.transaction.note)}
            </Tooltip>
          }
        >
          {
            <div>
              {txNote ? <span className="tx-note">{txNote}</span> : null}
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setVisible(true);
                }}
                href=""
              >
                {t(translations.transaction[txNote ? 'updateNote' : 'addNote'])}
              </a>
            </div>
          }
        </Description>
      </Card>
      <CreateTxNote {...txNoteProps}></CreateTxNote>
    </StyledCardWrapper>
  );
};

const GasFeeLabelWrapper = styled.span`
  color: #74798c;
`;

const AttributeWrapper = styled.div`
  display: flex;
  gap: 12px;
  ${media.s} {
    flex-direction: column;
  }
  .attribute {
    border: 1px solid #ebeced;
    height: 30px;
    padding: 4px 16px 4px 16px;
    border-radius: 2px;
  }
`;

const IconImg = styled.img`
  width: 1.2857rem;
  margin-left: 0.3571rem;
  padding-right: 0.2857rem;
  margin-top: -0.2765rem;
`;

const StyledCardWrapper = styled.div`
  .inputLine {
    .tooltip-wrapper {
      width: 100% !important;
    }
  }
  .card.sirius-Transactions-table-card {
    margin-top: 1.4286rem;
  }
  .logo {
    width: 1.1429rem;
    margin: 0 0.5714rem 0.2143rem;
  }
  .linkMargin {
    margin-left: 0.5714rem;
  }
  .transferListContainer {
    &.onlyOne {
      .lineContainer .index {
        display: none;
      }
    }
    .lineContainer {
      line-height: 1.7143rem;
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
  }
  .label {
    margin-right: 0.2857rem;
  }
  .btnSelectContainer {
    margin-top: 0.8571rem;
  }
  .warningContainer {
    margin-top: 0.5714rem;
    display: flex;
    align-items: center;
    .warningImg {
      width: 1rem;
    }
    .text {
      margin-left: 0.5714rem;
      font-size: 1rem;
      color: #ffa500;
    }
  }
  .shown {
    visibility: visible;
  }
  .hidden {
    visibility: hidden;
  }

  .detailResetWrapper {
    height: inherit;
    overflow: hidden;

    &.folded {
      height: 0;
    }
  }

  .icon-sponsored {
    height: 1.4286rem;
    margin-left: 0.5714rem;
  }

  .tx-note {
    font-style: italic;
    margin-right: 10px;
  }
`;

const StyledEpochConfirmationsWrapper = styled.span`
  margin-left: 1rem;
  vertical-align: middle;
`;

const StyledFoldButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;

  .detailResetFoldButton {
    display: flex;
    align-items: center;
    justify-items: center;
    padding: 0.8571rem 0;
    font-size: 1rem;
    color: #002257;
    cursor: pointer;
    padding: 0;

    &::after {
      content: '';
      background-image: url(${imgChevronDown});
      transform: rotate(180deg);
      width: 1.1429rem;
      height: 1.1429rem;
      display: inline-block;
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
      margin-left: 0.3571rem;
    }

    &.folded::after {
      transform: rotate(0);
    }
  }
`;

const InlineWrapper = styled.div`
  display: inline-block;
  margin-left: 3px;
  margin-right: 3px;
`;

const StyleToolTipText = styled.div`
  font-size: 12px;
  font-weight: 500;
  font-family: PingFang SC;
  color: #ececec;
`;
