import React, { useState, useEffect, useCallback } from 'react';
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
import { Link } from 'react-router-dom';
import SkeletonContainer from '../../components/SkeletonContainer/Loadable';
import { Status } from '../../components/Status/Loadable';
import { Tooltip } from '../../components/Tooltip/Loadable';
import { Text } from '../../components/Text/Loadable';
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
  devidedByDecimals,
  fromDripToCfx,
  getPercent,
} from '../../../utils';
import { decodeContract } from '../../../utils/cfx';
import { addressTypeContract } from '../../../utils/constants';
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
  const [tokenList, setTokenList] = useState([]);
  const [dataTypeList, setDataTypeList] = useState(['original', 'utf8']);
  const history = useHistory();
  const { hash: routeHash } = useParams<{
    hash: string;
  }>();
  let loading = false;
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
  } = transactionDetail;
  const getConfirmRisk = async blockHash => {
    let looping = true;
    let riskLevel;
    while (looping) {
      riskLevel = await reqConfirmationRiskByHash(blockHash);
      setRisk(riskLevel);
      if (riskLevel === '') {
        await delay(1000);
      } else if (riskLevel === 'lv0') {
        looping = false;
      } else {
        await delay(10 * 1000);
      }
    }
  };
  const fetchTxDetail = useCallback(
    txnhash => {
      reqTransactionDetail({
        hash: txnhash,
      }).then(body => {
        if (body.code) {
          switch (body.code) {
            case 30404:
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
          if (getAddressType(toAddress) === addressTypeContract) {
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
            ].join(',');
            const proArr: Array<any> = [];
            proArr.push(reqContract({ address: toAddress, fields: fields }));
            proArr.push(
              reqTransferList({
                transactionHash: txnhash,
                fields: 'token',
                limit: 100,
              }),
            );
            Promise.all(proArr).then(proRes => {
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
              } catch {}
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
              }).then(res => {
                setTokenList(res.list);
              });
            });
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
  const generatedDiv = () => {
    if (transactionDetail['to']) {
      if (isContract) {
        return (
          <Description
            title={
              <Tooltip text={t(translations.toolTip.tx.to)} placement="top">
                {t(translations.transaction.to)}
              </Tooltip>
            }
          >
            {t(translations.transaction.contract)}{' '}
            <img
              className="logo"
              src={
                (contractInfo &&
                  contractInfo['token'] &&
                  contractInfo['token']['icon']) ||
                defaultContractIcon
              }
              alt="icon"
            />{' '}
            <Link to={`/address/${transactionDetail['to']}`}>
              {contractInfo &&
                contractInfo['token'] &&
                contractInfo['token']['name']}
            </Link>{' '}
            <Link to={`/address/${to}`}>{to}</Link> <CopyButton copyText={to} />
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
            <Link to={`/address/${to}`}>{to}</Link> <CopyButton copyText={to} />
          </Description>
        );
      }
    } else if (transactionDetail['contractCreated']) {
      return (
        <Description
          title={
            <Tooltip text={t(translations.toolTip.tx.to)} placement="top">
              {t(translations.transaction.to)}
            </Tooltip>
          }
        >
          <span className="label">{t(translations.transaction.contract)}</span>
          <Link to={`/address/${transactionDetail['contractCreated']}`}>
            {transactionDetail['contractCreated']}
          </Link>{' '}
          <CopyButton copyText={transactionDetail['contractCreated']} />
          &nbsp; {t(translations.transaction.created)}
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
          {t(translations.transaction.contractCreation)}
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
        <Link to={`/token/${transferItem['address']}`} className="nameItem">
          {`${tokenName} (${tokenSymbol})`}
        </Link>
      );
      transferListContainer.push(
        <div className="lineContainer">
          <span className="from">{t(translations.transaction.from)}</span>
          <Link to={`/address/${transferItem['from']}`}>
            <Text span maxWidth="91px" hoverValue={transferItem['from']}>
              {transferItem['from']}
            </Text>
          </Link>
          <span className="to">{t(translations.transaction.to)}</span>
          <Link to={`/address/${transferItem['to']}`}>
            <Text span maxWidth="91px" hoverValue={transferItem['to']}>
              {transferItem['to']}
            </Text>
          </Link>
          <span className="for">{t(translations.transaction.for)}</span>
          <span className="value">
            {typeof tokenDecimals !== 'undefined'
              ? `${devidedByDecimals(transferItem['value'], tokenDecimals)}`
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
            {epochNumber}
            <Link to={`/epoch/${epochNumber}`}></Link>
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
            {epochHeight}
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
            <CountDown from={syncTimestamp} />
            {` (${formatTimeStamp(syncTimestamp * 1000, 'timezone')})`}
          </Description>
          <Description
            title={
              <Tooltip text={t(translations.toolTip.tx.status)} placement="top">
                {t(translations.transaction.status)}
              </Tooltip>
            }
          >
            <Status type={status} />
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
            </SkeletonContainer>
          </Description>
          <Description
            title={
              <Tooltip text={t(translations.toolTip.tx.from)} placement="top">
                {t(translations.transaction.from)}
              </Tooltip>
            }
          >
            <Link to={`/address/${from}`}>{from}</Link>{' '}
            <CopyButton copyText={from} />
          </Description>
          {generatedDiv()}
          {transferList.length > 0 && (
            <Description
              title={
                <Tooltip
                  text={t(translations.toolTip.tx.tokenTransferred)}
                  placement="top"
                >
                  {t(translations.transaction.tokenTransferred)}(
                  {transferList.length})
                </Tooltip>
              }
            >
              {getTransferListDiv()}
            </Description>
          )}
          <Description
            title={
              <Tooltip text={t(translations.toolTip.tx.value)} placement="top">
                {t(translations.transaction.value)}
              </Tooltip>
            }
          >
            {value ? `${fromDripToCfx(value, true)} CFX` : '--'}
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
            {/* todo, the value is 'gas used/gas limit', no gas limit from response */}
            {`${gasUsed}/${gas} (${getPercent(gasUsed, gas)})`}
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
            {/* todo, need to format to Gdrip */}
            {gasPrice}
          </Description>
          <Description
            title={
              <Tooltip text={t(translations.toolTip.tx.gasFee)} placement="top">
                {t(translations.transaction.gasFee)}
              </Tooltip>
            }
          >
            {gasFee}
          </Description>
          <Description
            title={
              <Tooltip text={t(translations.toolTip.tx.nonce)} placement="top">
                {t(translations.transaction.nonce)}
              </Tooltip>
            }
          >
            {nonce}
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
            <Link to={`/block/${blockHash}`}>{blockHash}</Link>{' '}
            <CopyButton copyText={blockHash} />
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
            {transactionIndex}
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
            {storageLimit}
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
            {chainId}
          </Description>
          <Description
            title={
              <Tooltip
                text={t(translations.toolTip.tx.inputData)}
                placement="top"
              >
                {t(translations.transaction.inputData)}
              </Tooltip>
            }
            noBorder
            className="inputLine"
          >
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
            >
              {dataTypeList.map(dataTypeItem => {
                return (
                  <Select.Option key={dataTypeItem} value={dataTypeItem}>
                    {`${t(translations.transaction.select[dataTypeItem])}`}
                  </Select.Option>
                );
              })}
            </Select>
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
`;

const StyledTransactionsWrapper = styled.div`
  padding: 2.2857rem 0;

  ${media.s} {
    padding-bottom: 0;
  }
`;
