import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader/Loadable';
import { media } from '../../../styles/media';
import { Card } from '@cfxjs/react-ui';
import { Select } from '../../components/Select';
import { Description } from '../../components/Description/Loadable';
import { useParams } from 'react-router-dom';
import { CopyButton } from '../../components/CopyButton/Loadable';
import { Link } from '../../components/Link';
import SkeletonContainer from '../../components/SkeletonContainer/Loadable';
import { Status } from '../../components/Status/Loadable';
import { Tooltip } from '../../components/Tooltip/Loadable';
import { Text } from '../../components/Text/Loadable';
import { InputData } from '../../components/InputData/Loadable';
import { CountDown } from '../../components/CountDown/Loadable';
import imgWarning from 'images/warning.png';
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
  formatString,
  getPercent,
  toThousands,
} from '../../../utils';
import { decodeContract } from '../../../utils/cfx';
import {
  addressTypeContract,
  addressTypeInternalContract,
} from '../../../utils/constants';
import { Security } from '../../components/Security/Loadable';
import { defaultContractIcon, defaultTokenIcon } from '../../../constants';
export const Transaction = () => {
  const { t } = useTranslation();
  const [risk, setRisk] = useState('');
  const [isContract, setIsContract] = useState(false);
  const [transactionDetail, setTransactionDetail] = useState<any>({});
  const [decodedData, setDecodedData] = useState({});
  const [contractInfo, setContractInfo] = useState({});
  const [transferList, setTransferList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tokenList, setTokenList] = useState([]);
  const [dataTypeList, setDataTypeList] = useState(['original', 'utf8']);
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
  } = transactionDetail;
  const [warningMessage, setWarningMessage] = useState('');
  const [isAbiError, setIsAbiError] = useState(false);
  const getConfirmRisk = async blockHash => {
    intervalToClear.current = true;
    let riskLevel;
    while (intervalToClear.current) {
      riskLevel = await reqConfirmationRiskByHash(blockHash);
      setRisk(riskLevel);
      if (riskLevel === '') {
        await delay(1000);
      } else if (riskLevel === 'lv0') {
        intervalToClear.current = false;
      } else {
        await delay(10 * 1000);
      }
    }
  };
  const fetchTxDetail = useCallback(
    txnhash => {
      setLoading(true);
      reqTransactionDetail({
        hash: txnhash,
      }).then(body => {
        if (body.code) {
          switch (body.code) {
            case 30404:
              setLoading(false);
              history.replace(`/packing/${txnhash}`);
              break;
          }
        } else {
          //success
          const txDetailDta = body;
          setTransactionDetail(txDetailDta || {});
          if (txnhash !== routeHash) {
            return;
          }
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
                revert: false,
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
    [history, routeHash],
  );

  const handleDataTypeChange = type => {
    setDataType(type);
  };
  useEffect(() => {
    fetchTxDetail(routeHash);
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
                  <Link href={`/address/${to}`}>
                    {contractInfo && contractInfo['name']}
                  </Link>{' '}
                </>
              )}
              <Link href={`/address/${to}`}>{to}</Link>{' '}
              <CopyButton copyText={to} />
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
              <Link href={`/address/${to}`}>{to}</Link>{' '}
              <CopyButton copyText={to} />
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
            <Link href={`/address/${transactionDetail['contractCreated']}`}>
              {transactionDetail['contractCreated']}
            </Link>{' '}
            <CopyButton copyText={transactionDetail['contractCreated']} />
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
  const getTransferListDiv = () => {
    if (!isContract) {
      return null;
    }
    if (transferList.length <= 0) {
      return null;
    }
    let transferListContainer: Array<any> = [];
    let transferListContainerStyle = {};
    for (let i = 0; i < transferList.length; i++) {
      const transferItem = transferList[i];
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
        tokenName = tokenItem['name'];
        tokenSymbol = tokenItem['symbol'];
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
      transferListContainer.push(
        <div className="lineContainer" key={`transfer${i + 1}`}>
          <span>{`${i + 1} .`}</span>
          <span className="from">{t(translations.transaction.from)}</span>
          <Link href={`/address/${transferItem['from']}`}>
            <Text span hoverValue={transferItem['from']}>
              {formatString(transferItem['from'], 'address')}
            </Text>
          </Link>
          <span className="to">{t(translations.transaction.to)}</span>
          <Link href={`/address/${transferItem['to']}`}>
            <Text span maxWidth="91px" hoverValue={transferItem['to']}>
              {formatString(transferItem['to'], 'address')}
            </Text>
          </Link>
          <span className="for">{t(translations.transaction.for)}</span>
          <span className="value">
            {typeof tokenDecimals !== 'undefined'
              ? `${formatBalance(transferItem['value'], tokenDecimals, true)}`
              : transferItem['value']}
          </span>
          <span>{imgIcon}</span>
          <span>{nameContainer}</span>
        </div>,
      );
    }
    if (transferList.length > 5) {
      transferListContainerStyle = { height: '120px', overflow: 'auto' };
    }
    return (
      <div style={transferListContainerStyle} className="transferListContainer">
        {transferListContainer}
      </div>
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

  return (
    <StyledTransactionsWrapper>
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
                text={t(translations.toolTip.tx.timestamp)}
                placement="top"
              >
                {t(translations.transaction.timestamp)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={loading}>
              <CountDown from={syncTimestamp} />
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
                  count: confirmedEpochCount,
                })}
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
              <Link href={`/address/${from}`}>{from}</Link>{' '}
              <CopyButton copyText={from} />
            </SkeletonContainer>
          </Description>
          {generatedDiv()}
          {transferList.length > 0 && (
            <Description
              title={
                <Tooltip
                  text={t(translations.toolTip.tx.tokenTransferred)}
                  placement="top"
                >
                  {`${t(translations.transaction.tokenTransferred)} (${
                    transferList.length
                  })`}
                </Tooltip>
              }
            >
              <SkeletonContainer shown={loading}>
                {getTransferListDiv()}
              </SkeletonContainer>
            </Description>
          )}
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
              <Tooltip text={t(translations.toolTip.tx.gasFee)} placement="top">
                {t(translations.transaction.gasFee)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={loading}>
              {`${toThousands(gasFee)} drip`}
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
            noBorder
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
                  <img src={imgWarning} alt="warning" className="warningImg" />
                  <span className="text">{t(warningMessage)}</span>
                </div>
              ) : null}
            </SkeletonContainer>
          </Description>
        </Card>
      </StyledCardWrapper>
    </StyledTransactionsWrapper>
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
  .logo {
    width: 1.1429rem;
    margin: 0 0.5714rem;
  }
  .linkMargin {
    margin-left: 0.5714rem;
  }
  .transferListContainer {
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
`;

const StyledTransactionsWrapper = styled.div`
  padding: 2.2857rem 0;

  ${media.s} {
    padding-bottom: 0;
  }
`;

const StyledEpochConfirmationsWrapper = styled.span`
  margin-left: 1rem;
  vertical-align: middle;
`;
