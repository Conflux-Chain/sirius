import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import styled from 'styled-components';
import { PageHeader } from '../../components/PageHeader/Loadable';
import { media } from '../../../styles/media';
import { Card, Textarea, Select } from '@cfxjs/react-ui';
import { Description } from '../../components/Description/Loadable';
import { useParams } from 'react-router-dom';
// import { useTransactionQuery,useCMContractQuery,useTransferList } from '../../../utils/api';
import { CopyButton } from '../../components/CopyButton/Loadable';
import { Link } from 'react-router-dom';
import SkeletonContainer from '../../components/SkeletonContainer/Loadable';
import { Status } from '../../components/Status/Loadable';
import { Tooltip } from '../../components/Tooltip/Loadable';
import { Text } from '../../components/Text/Loadable';
import {
  reqTransactionDetail,
  reqContract,
  reqTransferList,
  reqConfirmationRiskByHash,
  reqTokenList,
} from '../../../utils/httpRequest';
import { delay, getAddressType, hex2utf8 } from '../../../utils';
import { devidedByDecimals } from '../../../utils/format';
import { decodeContract } from '../../../utils/cfx';
import { addressTypeContract } from '../../../utils/constants';
import { Security } from '../../components/Security/Loadable';
import { defaultContractIcon, defaultTokenIcon } from '../../../constants';
export const Transactions = () => {
  const { t } = useTranslation();
  const [risk, setRisk] = useState('');
  const [isContract, setIsContract] = useState(false);
  const [transactionDetail, setTransactionDetail] = useState({});
  const [decodedData, setDecodedData] = useState({});
  const [innerData, setInnerData] = useState('');
  const [contractInfo, setContractInfo] = useState({});
  const [transferList, setTransferList] = useState([]);
  const [tokenList, setTokenList] = useState([]);
  const { hash: routeHash } = useParams<{
    hash: string;
  }>();
  let loading = false;
  // const { data, error } = useTransactionQuery({ hash });
  const [dataType, setDataType] = useState('original');

  /**
   * ISSUE LIST:
   * - executed Epoch: ? - backend will provide later
   * - gas used/limit: 用哪两个值算? - miss gas used, backend will provide later
   * - timestamp: todo, need to be formatted
   * - inputData: todo, need to be formatted
   * - to: todo, need to get token info, API: /contract-manager/api/contract/query?<params query>
   * - token transfer: todo, need to get token list, API: /api/transfer/list?transactionHash=<transaction hash>
   * - others:
   *  - CopyButton: 目前是 block 的，后续 react-ui/Tooltip 更新后会解决
   *  - Status: 图片显示有问题 - 后续 react-ui/Card 更新后会解决
   *  - Select: 样式不统一 - 后续 Select 会单独封装组件
   *  - Skeleton: 显示文字 - 后续 react-ui/Skeleton 更新后会解决
   *  - title tooltip: 需要给定文案后确定哪些需要添加
   */

  const {
    // @ts-ignore
    epochHeight,
    // @ts-ignore
    from,
    // @ts-ignore
    to,
    // @ts-ignore
    value,
    // @ts-ignore
    gasPrice,
    // @ts-ignore
    gas,
    // @ts-ignore
    nonce,
    // @ts-ignore
    blockHash,
    // @ts-ignore
    storageLimit,
    // @ts-ignore
    chainId,
    // @ts-ignore
    transactionIndex,
    // @ts-ignore
    epochNumber,
    // @ts-ignore
    syncTimestamp,
    // @ts-ignore
    gasFee,
    // @ts-ignore
    gasUsed,
    // @ts-ignore
    status,
  } = transactionDetail || {};
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
  const getStrByType = (byteCode, type, decodedDataStr) => {
    let str = '';
    switch (type) {
      case 'original':
        str = byteCode;
        break;
      case 'utf8':
        str = hex2utf8(byteCode);
        break;
      case 'decodeInputData':
        str = decodedDataStr;
        break;
      default:
        break;
    }
    return str;
  };
  const fetchTxDetail = useCallback(
    txnhash => {
      reqTransactionDetail({
        hash: txnhash,
      }).then(body => {
        const txDetailDta = body;
        setTransactionDetail(txDetailDta);
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
            decodedData = decodeContract({
              abi: JSON.parse(contractResponse['abi']),
              address: contractResponse['address'],
              transacionData: txDetailDta.data,
            });
            setDecodedData(decodedData);
            const str = getStrByType(
              txDetailDta['data'],
              'original',
              JSON.stringify(decodedData),
            );
            setInnerData(str);
            const resultTransferList = transferListReponse;
            const list = resultTransferList['list'];
            setTransferList(list);
            let addressList = list.map(v => v.address);
            addressList = Array.from(new Set(addressList));
            reqTokenList({ addressArray: addressList, fields: ['icon'] }).then(
              res => {
                setTokenList(res.list);
              },
            );
          });
        }
      });
    },
    [routeHash],
  );

  const handleDataTypeChange = type => {
    setDataType(type);
    const str = getStrByType(
      transactionDetail['data'],
      type,
      JSON.stringify(decodedData),
    );
    setInnerData(str);
  };
  useEffect(() => {
    fetchTxDetail(routeHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTxDetail, routeHash]);
  const generatedDiv = () => {
    if (transactionDetail['to']) {
      if (isContract) {
        return (
          <Description title={t(translations.transactions.to)}>
            {t(translations.transactions.contract)}{' '}
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
          <Description title={t(translations.transactions.to)}>
            <Link to={`/address/${to}`}>{to}</Link> <CopyButton copyText={to} />
          </Description>
        );
      }
    } else if (transactionDetail['contractCreated']) {
      return (
        <Description title={t(translations.transactions.to)}>
          <span className="label">{t(translations.transactions.contract)}</span>
          <Link to={`/address/${transactionDetail['contractCreated']}`}>
            {transactionDetail['contractCreated']}
          </Link>{' '}
          <CopyButton copyText={transactionDetail['contractCreated']} />
          &nbsp; {t(translations.transactions.created)}
        </Description>
      );
    } else {
      return (
        <Description title={t(translations.transactions.to)}>
          {t(translations.transactions.contractCreation)}
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
          <span className="from">{t(translations.transactions.from)}</span>
          <Link to={`/address/${transferItem['from']}`}>
            <Text span maxWidth="91px" hoverValue={transferItem['from']}>
              {transferItem['from']}
            </Text>
          </Link>
          <span className="to">{t(translations.transactions.to)}</span>
          <Link to={`/address/${transferItem['to']}`}>
            <Text span maxWidth="91px" hoverValue={transferItem['to']}>
              {transferItem['to']}
            </Text>
          </Link>
          <span className="for">{t(translations.transactions.for)}</span>
          <span className="value">
            {typeof tokenDecimals !== 'undefined'
              ? devidedByDecimals(transferItem['value'], tokenDecimals)
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
        <title>{t(translations.transactions.title)}</title>
        <meta
          name="description"
          content={t(translations.transactions.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.transactions.title)}</PageHeader>
      <StyledCardWrapper>
        <Card className="sirius-Transactions-card">
          <Description
            title={
              <Tooltip text={t(translations.transactions.hash)} placement="top">
                {t(translations.transactions.hash)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={loading}>
              {routeHash} <CopyButton copyText={routeHash} />
            </SkeletonContainer>
          </Description>
          <Description title={t(translations.transactions.executedEpoch)}>
            {epochNumber}
            <Link to={`/epoch/${epochNumber}`}></Link>
          </Description>
          <Description title={t(translations.transactions.proposedEpoch)}>
            {epochHeight}
          </Description>
          <Description title={t(translations.transactions.timestamp)}>
            {/* todo, need to be formatted */}
            {syncTimestamp}
          </Description>
          <Description title={t(translations.transactions.status)}>
            <Status type={status} />
          </Description>
          <Description title={t(translations.blocks.security)}>
            <SkeletonContainer shown={loading}>
              <Security type={risk}></Security>
            </SkeletonContainer>
          </Description>
          <Description title={t(translations.transactions.from)}>
            <Link to={`/address/${from}`}>{from}</Link>{' '}
            <CopyButton copyText={from} />
          </Description>
          {generatedDiv()}
          {transferList.length > 0 && (
            <Description
              title={`${t(translations.transactions.tokenTransferred)}(${
                transferList.length
              })`}
            >
              {getTransferListDiv()}
            </Description>
          )}
          <Description title={t(translations.transactions.value)}>
            {/* todo, need to format to cfx */}
            {value}
          </Description>
          <Description title={t(translations.transactions.gasUsed)}>
            {/* todo, the value is 'gas used/gas limit', no gas limit from response */}
            {`${gasUsed}/${gas}`}
          </Description>
          <Description title={t(translations.transactions.gasPrice)}>
            {/* todo, need to format to Gdrip */}
            {gasPrice}
          </Description>
          <Description title={t(translations.transactions.gasFee)}>
            {gasFee}
          </Description>
          <Description title={t(translations.transactions.nonce)}>
            {nonce}
          </Description>
          <Description title={t(translations.transactions.blockHash)}>
            <Link to={`/blocks/${blockHash}`}>{blockHash}</Link>{' '}
            <CopyButton copyText={blockHash} />
          </Description>
          <Description title={t(translations.transactions.position)}>
            {transactionIndex}
          </Description>
          <Description title={t(translations.transactions.storageLimit)}>
            {storageLimit}
          </Description>
          <Description title={t(translations.transactions.chainID)}>
            {chainId}
          </Description>
          <Description title={t(translations.transactions.inputData)} noBorder>
            {/* todo, need to be formatted */}
            <StyledTextareaWrapper>
              <Textarea
                className="sirius-Transactions-Textarea"
                width="100%"
                placeholder=""
                value={innerData}
                defaultValue=""
                minHeight="118px"
                variant="solid"
              />
            </StyledTextareaWrapper>
            {/* todo, need to replace with styled select */}
            <Select
              value={dataType}
              onChange={handleDataTypeChange}
              size="small"
            >
              <Select.Option value="original">
                {t(translations.transactions.select.original)}
              </Select.Option>
              <Select.Option value="utf8">
                {t(translations.transactions.select.utf8)}
              </Select.Option>
            </Select>
          </Description>
        </Card>
      </StyledCardWrapper>
    </StyledTransactionsWrapper>
  );
};

const StyledCardWrapper = styled.div`
  .card.sirius-Transactions-card {
    .content {
      padding: 0 18px;
    }
  }
  .logo {
    width: 16px;
    margin: 0 8px;
  }
  .linkMargin {
    margin-left: 8px;
  }
  .transferListContainer {
    .lineContainer {
      line-height: 24px;
    }
    .from {
      margin-right: 2px;
    }
    .to {
      margin: 0 2px;
    }
    .for {
      margin: 0 2px;
    }
    .value {
      margin: 0 2px;
    }
  }
  .label {
    margin-right: 4px;
  }
`;

const StyledTransactionsWrapper = styled.div`
  padding: 32px 0;

  ${media.s} {
    padding-bottom: 0;
  }
`;

const StyledTextareaWrapper = styled.span`
  .sirius-Transactions-Textarea {
    textarea {
      color: #a1acbb;
    }
    margin-bottom: 0.8571rem;
  }
`;
