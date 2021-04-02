import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader/Loadable';
import { Card, Spinner } from '@cfxjs/react-ui';
import { Select } from '../../components/Select';
import { Description } from '../../components/Description/Loadable';
import { useParams } from 'react-router-dom';
import { CopyButton } from '../../components/CopyButton/Loadable';
import { Link } from '../../components/Link';
import SkeletonContainer from '../../components/SkeletonContainer/Loadable';
import { Status } from '../../components/Status/Loadable';
import { Tooltip } from '../../components/Tooltip/Loadable';
import { InputData } from '../../components/InputData/Loadable';
import { CountDown } from '../../components/CountDown/Loadable';
import {
  reqTransactionDetail,
  reqContract,
  reqTransferList,
  reqConfirmationRiskByHash,
  reqTokenList,
} from '../../../utils/httpRequest';
import {
  delay,
  getAddressType,
  formatTimeStamp,
  formatBalance,
  fromDripToCfx,
  getPercent,
  toThousands,
} from '../../../utils';
import { decodeContract, formatAddress } from '../../../utils/cfx';
import {
  addressTypeContract,
  addressTypeInternalContract,
  cfxTokenTypes,
} from '../../../utils/constants';
import { Security } from '../../components/Security/Loadable';
import { defaultContractIcon, defaultTokenIcon } from '../../../constants';
import { AddressContainer } from '../../components/AddressContainer';
import clsx from 'clsx';
import { TableCard } from './TableCard';
import BigNumber from 'bignumber.js';

import imgWarning from 'images/warning.png';
import imgChevronDown from 'images/chevronDown.png';
import imgSponsored from 'images/sponsored.png';

const getStorageFee = byteSize =>
  toThousands(new BigNumber(byteSize).dividedBy(1024).toFixed(2));

// Transaction Detail Page
export const Transaction = () => {
  const { t } = useTranslation();
  const [risk, setRisk] = useState('');
  const [isContract, setIsContract] = useState(false);
  const [transactionDetail, setTransactionDetail] = useState<any>({});
  const [decodedData, setDecodedData] = useState({});
  const [contractInfo, setContractInfo] = useState({});
  const [transferList, setTransferList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [partLoading, setPartLoading] = useState(false); // partial update indicator
  const [tokenList, setTokenList] = useState([]);
  const [dataTypeList, setDataTypeList] = useState(['original', 'utf8']);
  const [detailsInfoSetHash, setDetailsInfoSetHash] = useState('');
  const history = useHistory();
  const intervalToClear = useRef(false);
  const { hash: routeHash } = useParams<{
    hash: string;
  }>();
  const [dataType, setDataType] = useState('original');
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
  const [warningMessage, setWarningMessage] = useState('');
  const [isAbiError, setIsAbiError] = useState(false);
  const [folded, setFolded] = useState(true);

  // get riskLevel
  const getConfirmRisk = async blockHash => {
    intervalToClear.current = true;
    let riskLevel;
    while (intervalToClear.current) {
      riskLevel = await reqConfirmationRiskByHash(blockHash);
      setRisk(riskLevel);
      if (riskLevel === '') {
        await delay(1000);
      } else if (riskLevel === 'lv0') {
        // auto refresh riskLevel until risLevel is high
        intervalToClear.current = false;
      } else {
        await delay(10 * 1000);
      }
    }
  };

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

          if (body.blockHash) {
            getConfirmRisk(body.blockHash);
          }

          let toAddress = txDetailDta.to;
          if (
            getAddressType(toAddress) === addressTypeContract ||
            getAddressType(toAddress) === addressTypeInternalContract
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
            proArr.push(reqContract({ address: toAddress, fields: fields }));
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
                setContractInfo(contractResponse);
                const transferListReponse = proRes[1];
                let decodedData = {};
                try {
                  decodedData = decodeContract({
                    abi: JSON.parse(contractResponse['abi']),
                    address: contractResponse['address'],
                    transacionData: txDetailDta.data,
                  });
                  if (!decodedData) setIsAbiError(true);
                } catch {
                  setIsAbiError(true);
                }
                setDecodedData(decodedData);
                setDataTypeList(['original', 'utf8', 'decodeInputData']);
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
                  .catch(() => {
                    //TODO: In the first stage, a temporary solution:no need to cancel loading
                    // setLoading(false);
                  });
              })
              .catch(() => {
                //TODO: In the first stage, a temporary solution:no need to cancel loading
                // setLoading(false);
              });
          } else {
            setLoading(false);
          }
        }
      });
    },
    [history, routeHash, detailsInfoSetHash],
  );

  const handleDataTypeChange = type => {
    setDataType(type);
  };
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
  useEffect(() => {
    if (dataType === 'decodeInputData') {
      if (contractInfo['abi']) {
        if (isAbiError) {
          setWarningMessage('contract.abiError');
        } else {
          setWarningMessage('');
        }
      } else {
        setWarningMessage('contract.abiNotUploaded');
      }
    } else {
      setWarningMessage('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataType, contractInfo, isAbiError]);

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
              {contractInfo && contractInfo['name'] && (
                <>
                  <img
                    className="logo"
                    src={
                      (contractInfo && contractInfo['icon']) ||
                      defaultContractIcon
                    }
                    alt="icon"
                  />{' '}
                  <Link href={`/address/${formatAddress(to)}`}>
                    {contractInfo && contractInfo['name']}
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
              <AddressContainer value={transferItem['from']} />
              <span className="to">{t(translations.transaction.to)}</span>
              <AddressContainer value={transferItem['to']} />
              <span className="for">{t(translations.transaction.for)}</span>
              <span className="type">CRC721</span>
              <span>{imgIcon}</span>
              <span>{nameContainer}</span>
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
              <AddressContainer value={transferItem['from']} />
              <span className="to">{t(translations.transaction.to)}</span>
              <AddressContainer value={transferItem['to']} />
              <span className="type">CRC1155</span>
              <span>{imgIcon}</span>
              <span>{nameContainer}</span>
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
                    <span className="tokenId">{item['tokenId']}</span>
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
              <AddressContainer value={transferItem['from']} />
              <span className="to">{t(translations.transaction.to)}</span>
              <AddressContainer value={transferItem['to']} />
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
              <span>{nameContainer}</span>
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
      transferListContainerStyle = { height: '120px', overflow: 'auto' };
    }
    return (
      <Description
        title={
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
    <>
      <Helmet>
        <title>{t(translations.transaction.title)}</title>
        <meta
          name="description"
          content={t(translations.transaction.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.transaction.title)}</PageHeader>
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
              <Link href={`/epoch/${epochNumber}`}>
                {toThousands(epochNumber)}
              </Link>
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
              <Link href={`/block/${blockHash}`}>{blockHash}</Link>{' '}
              <CopyButton copyText={blockHash} />
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
            <SkeletonContainer shown={loading || syncTimestamp === undefined}>
              <CountDown from={syncTimestamp} retainDurations={4} />
              {` (${formatTimeStamp(syncTimestamp * 1000, 'timezone')})`}
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
              {!loading && <Status type={status}>{statusErrorMessage}</Status>}
            </SkeletonContainer>
          </Description>
          <Description
            title={
              <Tooltip
                text={t(translations.toolTip.tx.security)}
                placement="top"
              >
                {t(translations.block.security)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={loading}>
              <Security type={risk}></Security>
              <StyledEpochConfirmationsWrapper>
                {t(translations.transaction.epochConfirmations, {
                  count: confirmedEpochCount || '-',
                })}
                {partLoading ? (
                  <Spinner
                    size="small"
                    style={{ display: 'inline-block', marginLeft: 5 }}
                  />
                ) : null}
              </StyledEpochConfirmationsWrapper>
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
              {`${toThousands(gasFee)} drip`}{' '}
              {gasCoveredBySponsor && (
                <img
                  src={imgSponsored}
                  alt="sponsored"
                  className="icon-sponsored"
                />
              )}
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
                  text={t(translations.toolTip.tx.storageLimit)}
                  placement="top"
                >
                  {t(translations.transaction.storageLimit)}
                </Tooltip>
              }
            >
              <SkeletonContainer shown={loading}>
                {toThousands(storageLimit)}
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
                {getStorageFee(storageCollateralized)} CFX{' '}
                {storageCoveredBySponsor && (
                  <img
                    src={imgSponsored}
                    alt="sponsored"
                    className="icon-sponsored"
                  />
                )}
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
                <Tooltip
                  text={t(translations.toolTip.tx.gasUsedLimit)}
                  placement="top"
                >
                  {t(translations.transaction.gasUsed)}
                </Tooltip>
              }
            >
              <SkeletonContainer shown={loading}>
                {`${gasUsed}/${gas} (${getPercent(gasUsed, gas)})`}
              </SkeletonContainer>
            </Description>
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
                  text={t(translations.toolTip.tx.nonce)}
                  placement="top"
                >
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
                {!loading && transactionIndex}
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
                <InputData
                  byteCode={data}
                  inputType={dataType}
                  decodedDataStr={JSON.stringify(decodedData)}
                ></InputData>
                <Select
                  value={dataType}
                  onChange={handleDataTypeChange}
                  disableMatchWidth
                  size="small"
                  className="btnSelectContainer"
                >
                  {dataTypeList.map(dataTypeItem => {
                    return (
                      <Select.Option key={dataTypeItem} value={dataTypeItem}>
                        {`${t(translations.transaction.select[dataTypeItem])}`}
                      </Select.Option>
                    );
                  })}
                </Select>
                {warningMessage ? (
                  <div className="warningContainer shown">
                    <img
                      src={imgWarning}
                      alt="warning"
                      className="warningImg"
                    />
                    <span className="text">{t(warningMessage)}</span>
                  </div>
                ) : null}
              </SkeletonContainer>
            </Description>
          </div>
          <StyledFoldButtonWrapper>
            <Description noBorder title="">
              <div
                className={clsx('detailResetFoldButton', {
                  folded: folded,
                })}
                onClick={handleFolded}
              >
                {t(translations.general[folded ? 'viewMore' : 'showLess'])}
              </div>
            </Description>
          </StyledFoldButtonWrapper>
        </Card>
        <TableCard
          from={fromContent()}
          to={toContent()}
          hash={routeHash}
        ></TableCard>
      </StyledCardWrapper>
    </>
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
    font-size: 1rem;
    color: #002257;
    line-height: 1.5714rem;
    height: 1.5714rem;
    display: inline-flex;
    align-items: center;
    justify-items: center;
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
