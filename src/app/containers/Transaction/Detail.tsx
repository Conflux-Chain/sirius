import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { Card, Spinner } from '@cfxjs/react-ui';
import { Description } from 'app/components/Description/Loadable';
import { CopyButton } from 'app/components/CopyButton/Loadable';
import { Link } from 'app/components/Link';
import SkeletonContainer from 'app/components/SkeletonContainer/Loadable';
import { Tooltip } from 'app/components/Tooltip/Loadable';
import { CountDown } from 'app/components/CountDown/Loadable';
import {
  reqContract,
  reqTokenList,
  reqTransactionDetail,
  reqTransferList,
} from 'utils/httpRequest';
import {
  formatBalance,
  formatTimeStamp,
  fromDripToCfx,
  getAddressType,
  getPercent,
  toThousands,
} from 'utils';
import { formatAddress } from 'utils/cfx';
import {
  addressTypeContract,
  addressTypeInternalContract,
  cfxTokenTypes,
} from 'utils/constants';
import { defaultTokenIcon } from '../../../constants';
import { AddressContainer } from 'app/components/AddressContainer';
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
import _ from 'lodash';

import imgChevronDown from 'images/chevronDown.png';
import { renderAddress } from 'utils/tableColumns/token';
import { NFTPreview } from '../../components/NFTPreview/Loadable';

import iconInfo from 'images/info.svg';

const getStorageFee = byteSize =>
  toThousands(new BigNumber(byteSize).dividedBy(1024).toFixed(2));

// Transaction Detail Page
export const Detail = () => {
  const { t } = useTranslation();
  const [isContract, setIsContract] = useState(false);
  const [transactionDetail, setTransactionDetail] = useState<any>({});
  const [contractInfo, setContractInfo] = useState({});
  const [transferList, setTransferList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [partLoading, setPartLoading] = useState(false); // partial update indicator
  const [tokenList, setTokenList] = useState([]);
  const [detailsInfoSetHash, setDetailsInfoSetHash] = useState('');
  const history = useHistory();
  const intervalToClear = useRef(false);
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
    status,
    data,
    contractCreated,
    confirmedEpochCount,
    txExecErrorInfo,
    gasCoveredBySponsor,
    storageCoveredBySponsor,
    storageReleased,
    storageCollateralized,
  } = transactionDetail;
  const [folded, setFolded] = useState(true);

  // get txn detail info
  const fetchTxDetail = useCallback(
    txnhash => {
      if (!detailsInfoSetHash || detailsInfoSetHash !== txnhash) {
        setLoading(true);
      } else {
        setPartLoading(true);
      }
      reqTransactionDetail({
        hash: txnhash,
      }).then(body => {
        if (body && !body?.hash) {
          history.push(`/notfound/${routeHash}`, {
            type: 'transaction',
          });
        }

        if (body.code) {
          switch (body.code) {
            case 30404:
              setLoading(false);
              setPartLoading(false);
              history.push(`/notfound/${routeHash}`, {
                type: 'transaction',
              });
              break;
          }
        } else {
          //success
          const txDetailDta = body;
          setTransactionDetail(txDetailDta || {});
          if (txnhash !== routeHash) {
            return;
          }
          if (detailsInfoSetHash === txnhash) {
            // only update timestamp & confirmedEpochCount
            setPartLoading(false);
            return;
          }
          setDetailsInfoSetHash(txnhash);

          let toCheckAddress = txDetailDta.to;

          if (
            getAddressType(toCheckAddress) === addressTypeContract ||
            getAddressType(toCheckAddress) === addressTypeInternalContract
          ) {
            setIsContract(true);
            const fields = [
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
              'icon',
              'sourceCode',
              'typeCode',
            ];
            const proArr: Array<any> = [];
            proArr.push(
              reqContract({ address: toCheckAddress, fields: fields }),
            );
            proArr.push(
              reqTransferList({
                transactionHash: txnhash,
                fields: 'token',
                limit: 100,
                reverse: true,
              }),
            );
            Promise.all(proArr)
              .then(proRes => {
                const contractResponse = proRes[0];
                // update contract info
                setContractInfo(contractResponse);
                const transferListReponse = proRes[1];
                const resultTransferList = transferListReponse;
                const list = resultTransferList['list'];
                setTransferList(list);
                let addressList = list.map(v => v.address);
                addressList = Array.from(new Set(addressList));
                reqTokenList({
                  addressArray: addressList,
                  fields: ['icon'],
                })
                  .then(res => {
                    setLoading(false);
                    setTokenList(res.list);
                  })
                  .catch(() => {});
              })
              .catch(() => {});
          } else {
            setLoading(false);
          }
        }
      });
    },
    [history, routeHash, detailsInfoSetHash],
  );

  useEffect(() => {
    fetchTxDetail(routeHash);

    // auto update tx detail info
    const autoUpdateDetailIntervalId = setInterval(() => {
      fetchTxDetail(routeHash);
    }, 10 * 1000);
    return () => {
      clearInterval(autoUpdateDetailIntervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTxDetail, routeHash]);

  useEffect(() => {
    return () => {
      intervalToClear.current = false;
    };
  }, [intervalToClear]);

  const fromContent = (isFull = false) => (
    <span>
      <AddressContainer value={from} isFull={isFull} />{' '}
      <CopyButton copyText={formatAddress(from)} />
    </span>
  );
  const toContent = (isFull = false) => (
    <span>
      <AddressContainer value={to} isFull={isFull} />{' '}
      <CopyButton copyText={formatAddress(to)} />
    </span>
  );

  const generatedDiv = () => {
    if (to) {
      if (isContract) {
        return (
          <Description
            title={
              <Tooltip text={t(translations.toolTip.tx.to)} placement="top">
                {t(translations.transaction.to)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={loading}>
              {t(translations.transaction.contract)}{' '}
              {contractInfo && (
                <>
                  {contractInfo['token'] && contractInfo['token']['icon'] ? (
                    <img
                      className="logo"
                      src={
                        contractInfo['token'] && contractInfo['token']['icon']
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
              {toContent(true)}
            </SkeletonContainer>
          </Description>
        );
      } else {
        return (
          <Description
            title={
              <Tooltip text={t(translations.toolTip.tx.to)} placement="top">
                {t(translations.transaction.to)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={loading}>
              {toContent(true)}
            </SkeletonContainer>
          </Description>
        );
      }
    } else if (contractCreated) {
      return (
        <Description
          title={
            <Tooltip text={t(translations.toolTip.tx.to)} placement="top">
              {t(translations.transaction.to)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            <span className="label">
              {t(translations.transaction.contract)}
            </span>
            <AddressContainer
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
            <Tooltip text={t(translations.toolTip.tx.to)} placement="top">
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
        imgSrc = tokenItem['icon'];
      }
      const imgIcon = (
        <img
          className="logo"
          src={`${imgSrc || defaultTokenIcon}`}
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
        case cfxTokenTypes.erc721: {
          transferListContainer.push(
            <div
              className="lineContainer"
              key={`transfer${cfxTokenTypes.erc721}${i + 1}`}
            >
              <span className="index">{index++}. </span>
              <span className="from">{t(translations.transaction.from)}</span>
              {/*<AddressContainer value={transferItem['from']} />*/}
              <InlineWrapper>
                {renderAddress(
                  transferItem['from'],
                  transferItem,
                  'from',
                  false,
                )}
              </InlineWrapper>
              <span className="to">{t(translations.transaction.to)}</span>
              {/*<AddressContainer value={transferItem['to']} />*/}
              <InlineWrapper>
                {renderAddress(transferItem['to'], transferItem, 'to', false)}
              </InlineWrapper>
              <span className="for">{t(translations.transaction.for)}</span>
              <span className="type">1</span>
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
                <span className="tokenId">{transferItem['tokenId']}</span>
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
              <span className="index">{index++}. </span>
              <span className="from">{t(translations.transaction.from)}</span>
              {/*<AddressContainer value={transferItem['from']} />*/}
              <InlineWrapper>
                {renderAddress(
                  transferItem['from'],
                  transferItem,
                  'from',
                  false,
                )}
              </InlineWrapper>
              <span className="to">{t(translations.transaction.to)}</span>
              {/*<AddressContainer value={transferItem['to']} />*/}
              <InlineWrapper>
                {renderAddress(transferItem['to'], transferItem, 'to', false)}
              </InlineWrapper>
              <span>{imgIcon}</span>
              <span>{nameContainer}</span> <TokenTypeTag type="crc1155" />
              {transferItem['batch'].map((item, index) => (
                <span key={`transfer${cfxTokenTypes.erc1155}${i + 1}${index}`}>
                  <br />
                  <span className="batch">
                    - {t(translations.transaction.for)}{' '}
                    <span className="value">
                      {typeof tokenDecimals !== 'undefined'
                        ? `${formatBalance(item['value'], tokenDecimals, true)}`
                        : item['value']}
                    </span>
                    &nbsp;&nbsp;{t(translations.transaction.tokenId)}:{' '}
                    <span className="tokenId">
                      {item['tokenId']}
                      <NFTPreview
                        contractAddress={transferItem['address']}
                        tokenId={item['tokenId']}
                      />
                    </span>
                  </span>
                </span>
              ))}
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
              <span className="index">{index++}. </span>
              <span className="from">{t(translations.transaction.from)}</span>
              {/*<AddressContainer value={transferItem['from']} />*/}
              <InlineWrapper>
                {renderAddress(
                  transferItem['from'],
                  transferItem,
                  'from',
                  false,
                )}
              </InlineWrapper>
              <span className="to">{t(translations.transaction.to)}</span>
              {/*<AddressContainer value={transferItem['to']} />*/}
              <InlineWrapper>
                {renderAddress(transferItem['to'], transferItem, 'to', false)}
              </InlineWrapper>
              <span className="for">{t(translations.transaction.for)}</span>
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
            <Tooltip
              text={t(translations.toolTip.tx.tokenTransferred)}
              placement="top"
            >
              {`${t(translations.transaction.tokenTransferred)} ${
                transferListContainer.length > 1
                  ? `(${transferListContainer.length})`
                  : ''
              }`}
            </Tooltip>
            {transferListContainer.length > 1 ? (
              <Tooltip
                className="download-csv-tooltip"
                text={t(translations.transaction.tipOfTokenTransferCount)}
                placement="top"
              >
                <IconWrapper>
                  <img
                    src={iconInfo}
                    alt="warning-icon"
                    className="download-svg-img"
                  ></img>
                </IconWrapper>
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

  // txn status error detail info
  let statusErrorMessage = '';
  if (txExecErrorInfo) {
    if (txExecErrorInfo?.type === 1) {
      statusErrorMessage = `${t(
        translations.transaction.statusError[txExecErrorInfo?.type],
      )}${txExecErrorInfo.message}`;
    } else {
      statusErrorMessage = t(
        translations.transaction.statusError[txExecErrorInfo?.type],
      );
    }
  }

  const handleFolded = () => setFolded(folded => !folded);

  const storageReleasedTotal = storageReleased
    ? getStorageFee(
        storageReleased.reduce((prev, curr) => {
          return prev + curr.collaterals ? Number(curr.collaterals) : 0;
        }, 0),
      )
    : 0;

  return (
    <StyledCardWrapper>
      <Card className="sirius-Transactions-card">
        <Description
          title={
            <Tooltip
              text={t(translations.toolTip.tx.transactionHash)}
              placement="top"
            >
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
            <Tooltip
              text={t(translations.toolTip.tx.executedEpoch)}
              placement="top"
            >
              {t(translations.transaction.executedEpoch)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {_.isNil(epochNumber) ? (
              '--'
            ) : (
              <Link href={`/epoch/${epochNumber}`}>
                {toThousands(epochNumber)}
              </Link>
            )}
          </SkeletonContainer>
        </Description>
        <Description
          title={
            <Tooltip
              text={t(translations.toolTip.tx.proposedEpoch)}
              placement="top"
            >
              {t(translations.transaction.proposedEpoch)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            <Link href={`/epoch/${epochHeight}`}>
              {toThousands(epochHeight)}
            </Link>
          </SkeletonContainer>
        </Description>
        <Description
          title={
            <Tooltip
              text={t(translations.toolTip.tx.blockHash)}
              placement="top"
            >
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
            <Tooltip
              text={t(translations.toolTip.tx.timestamp)}
              placement="top"
            >
              {t(translations.transaction.timestamp)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {_.isNil(syncTimestamp) ? (
              '--'
            ) : (
              <>
                <CountDown from={syncTimestamp} retainDurations={4} />
                {` (${formatTimeStamp(syncTimestamp * 1000, 'timezone')})`}
              </>
            )}
          </SkeletonContainer>
        </Description>
        <Description
          title={
            <Tooltip text={t(translations.toolTip.tx.status)} placement="top">
              {t(translations.transaction.status)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            <Status type={status}>{statusErrorMessage}</Status>
          </SkeletonContainer>
        </Description>
        <Description
          title={
            <Tooltip text={t(translations.toolTip.tx.security)} placement="top">
              {t(translations.block.security)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {_.isNil(blockHash) ? (
              '--'
            ) : (
              <>
                <Security blockHash={blockHash}></Security>
                <StyledEpochConfirmationsWrapper>
                  {t(translations.transaction.epochConfirmations, {
                    count: confirmedEpochCount || '--',
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
            <Tooltip text={t(translations.toolTip.tx.from)} placement="top">
              {t(translations.transaction.from)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {fromContent(true)}
          </SkeletonContainer>
        </Description>
        {generatedDiv()}

        {/* @todo check if can be use new TokenTransfer component to instead of getTransferListDiv() */}
        {/* {isContract ? (
          <TokenTransfer tokenList={tokenList} transferList={transferList} />
        ) : null} */}
        {getTransferListDiv()}

        <Description
          title={
            <Tooltip text={t(translations.toolTip.tx.value)} placement="top">
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
            <Tooltip text={t(translations.toolTip.tx.gasFee)} placement="top">
              {t(translations.transaction.gasFee)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            <GasFee fee={gasFee} sponsored={gasCoveredBySponsor} />
          </SkeletonContainer>
        </Description>
        <div
          className={clsx('detailResetWrapper', {
            folded: folded,
          })}
        >
          <Description
            title={
              <Tooltip
                text={t(translations.toolTip.tx.gasPrice)}
                placement="top"
              >
                {t(translations.transaction.gasPrice)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={loading}>
              {`${toThousands(gasPrice)} drip`}
            </SkeletonContainer>
          </Description>
          <Description
            title={
              <Tooltip
                text={t(translations.toolTip.tx.gasUsedLimit)}
                placement="top"
              >
                {t(translations.transaction.gasUsed)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={loading}>
              {`${gasUsed || '--'}/${gas} (${getPercent(gasUsed, gas)})`}
            </SkeletonContainer>
          </Description>
          <Description
            title={
              <Tooltip
                text={t(translations.toolTip.tx.gasCharged)}
                placement="top"
              >
                {t(translations.transaction.gasCharged)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={loading}>
              {gasUsed && gas ? Math.max(+gasUsed, (+gas * 3) / 4) : '--'}
            </SkeletonContainer>
          </Description>
          <Description
            title={
              <Tooltip
                text={t(translations.toolTip.tx.storageCollateralized)}
                placement="top"
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
          </Description>
          <Description
            title={
              <Tooltip
                text={t(translations.toolTip.tx.storageLimit)}
                placement="top"
              >
                {t(translations.transaction.storageLimit)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={loading}>
              {_.isNil(storageCollateralized) ? '--' : storageCollateralized}/
              {toThousands(storageLimit)}
            </SkeletonContainer>
          </Description>
          <Description
            title={
              <Tooltip
                text={t(translations.toolTip.tx.storageReleased)}
                placement="top"
              >
                {t(translations.transaction.storageReleased)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={loading}>
              {storageReleasedTotal} CFX
            </SkeletonContainer>
          </Description>
          <Description
            title={
              <Tooltip text={t(translations.toolTip.tx.nonce)} placement="top">
                {t(translations.transaction.nonce)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={loading}>
              {toThousands(nonce)}
            </SkeletonContainer>
          </Description>
          <Description
            title={
              <Tooltip
                text={t(translations.toolTip.tx.position)}
                placement="top"
              >
                {t(translations.transaction.position)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={loading}>
              {_.isNil(transactionIndex) ? '--' : !loading && transactionIndex}
            </SkeletonContainer>
          </Description>
          <Description
            title={
              <Tooltip
                text={t(translations.toolTip.tx.chainID)}
                placement="top"
              >
                {t(translations.transaction.chainID)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={loading}>{chainId}</SkeletonContainer>
          </Description>
          {/* only send to user type will with empty data */}
          {!data || data === '0x' ? null : (
            <Description
              title={
                <Tooltip
                  text={t(translations.transaction.inputTips)}
                  placement="top"
                >
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
      </Card>
    </StyledCardWrapper>
  );
};

const StyledCardWrapper = styled.div`
  .inputLine {
    .tooltip-wrapper {
      width: 100% !important;
    }
  }
  .card.sirius-Transactions-card {
    .content {
      padding: 0 1.2857rem;
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
`;

const StyledEpochConfirmationsWrapper = styled.span`
  margin-left: 1rem;
  vertical-align: middle;
`;

const StyledFoldButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;

  .detailResetFoldButton {
    display: flex;
    align-items: center;
    justify-items: center;
    padding: 0.8571rem 0;
    font-size: 1rem;
    color: #002257;
    cursor: pointer;

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

const IconWrapper = styled.div`
  padding-right: 0.2857rem;
  width: 1.2857rem;
  cursor: pointer;

  .download-svg-img {
    margin-left: 0.3571rem;
  }
`;
