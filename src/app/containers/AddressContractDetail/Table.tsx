import React, { useMemo, useState, useEffect } from 'react';
import clsx from 'clsx';
import queryString from 'query-string';
import styled from 'styled-components';
import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';
import 'ace-mode-solidity/build/remix-ide/mode-solidity';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Button } from '@cfxjs/react-ui';
import { Card } from 'app/components/Card/Loadable';
import { useLocation, useHistory } from 'react-router';
import {
  transactionColunms,
  tokenColunms,
  blockColunms,
} from 'utils/tableColumns';
import { StyledIconWrapper } from 'utils/tableColumns/token';
import { Link } from 'app/components/Link';
import { Text } from 'app/components/Text';
import { ColumnsType } from '../../components/TabsTablePanel';
import {
  TabLabel,
  TabsTablePanel,
} from '../../components/TabsTablePanel/Loadable';
import { isContractAddress, formatString, isInnerContractAddress } from 'utils';
import { media, useBreakpoint } from 'styles/media';
import { defaultTokenIcon } from '../../../constants';
import imgDot from 'images/contract-address/dot-dot-dot.svg';
import PickerWithQuery from './PickerWithQuery';
import { Dropdown } from '../../components/Dropdown';
import { cfx } from 'utils/cfx';
import { ContractAbi } from '../../components/ContractAbi/Loadable';
import { cfxTokenTypes } from '../../../utils/constants';
const AceEditorStyle = {
  width: '100%',
};

function ContractSourceCodeAbi({ contractInfo }) {
  const { t } = useTranslation();
  const { sourceCode, abi, address } = contractInfo;
  const [dataForRead, setDataForRead] = useState([]);
  const [dataForWrite, setDataForWrite] = useState([]);
  let abiJson = [];
  try {
    abiJson = JSON.parse(abi);
  } catch (error) {}
  const [selectedBtnType, setSelectedBtnType] = useState('sourceCode');
  const clickHandler = (btnType: React.SetStateAction<string>) => {
    setSelectedBtnType(btnType);
  };
  const contract = cfx.Contract({
    abi: abiJson,
    address,
  });
  useEffect(() => {
    getReadWriteData(abiJson).then(res => {
      const [dataForR, dataForW] = res;
      setDataForRead(dataForR as any);
      setDataForWrite(dataForW as any);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractInfo]);

  async function getReadWriteData(abiJson) {
    let dataForRead: object[] = [];
    let dataForWrite: object[] = [];
    let proArr: object[] = [];
    if (Array.isArray(abiJson)) {
      for (let abiItem of abiJson) {
        if (abiItem.name !== '' && abiItem.type === 'function') {
          const stateMutability = abiItem.stateMutability;
          switch (stateMutability) {
            case 'pure':
            case 'view':
              if (abiItem.inputs && abiItem.inputs.length === 0) {
                proArr.push(contract[abiItem.name]());
              }
              dataForRead.push(abiItem);
              break;
            case 'nonpayable':
              dataForWrite.push(abiItem);
              break;
            case 'payable':
              const payableObjs = [
                {
                  internalType: 'cfx',
                  name: abiItem['name'],
                  type: 'cfx',
                },
              ];
              abiItem['inputs'] = payableObjs.concat(abiItem['inputs']);
              dataForWrite.push(abiItem);
              break;
            default:
              break;
          }
        }
      }
      const list = await Promise.allSettled(proArr);
      let i = 0;
      dataForRead.forEach(function (dValue, dIndex) {
        if (dValue['inputs'].length === 0) {
          const listItem = list[i];
          const status = listItem['status'];
          if (status === 'fulfilled') {
            const val = listItem['value'];
            if (dValue['outputs'].length > 1) {
              dValue['value'] = val;
            } else {
              const arr: any = [];
              arr.push(val);
              dValue['value'] = arr;
            }
          } else {
            dValue['error'] = listItem['reason']['message'];
          }
          ++i;
        }
      });
    }
    return [dataForRead, dataForWrite];
  }

  return (
    <>
      <ContractBody>
        <ButtonWrapper>
          <Button
            className={clsx(
              selectedBtnType === 'sourceCode' && 'enabled',
              'btnWeight',
            )}
            onClick={() => clickHandler('sourceCode')}
          >
            {t(translations.contract.sourceCodeShort)}
          </Button>
          <Button
            className={clsx(
              selectedBtnType === 'abi' && 'enabled',
              'btn-item',
              'btnWeight',
            )}
            onClick={() => clickHandler('abi')}
          >
            {t(translations.contract.abiShort)}
          </Button>
          {abi && (
            <Button
              className={clsx(
                selectedBtnType === 'read' && 'enabled',
                'btn-item',
                'btnWeight',
              )}
              onClick={() => clickHandler('read')}
            >
              {t(translations.contract.readContract)}
            </Button>
          )}
          {abi && (
            <Button
              className={clsx(
                selectedBtnType === 'write' && 'enabled',
                'btn-item',
                'btnWeight',
              )}
              onClick={() => clickHandler('write')}
            >
              {t(translations.contract.writeContract)}
            </Button>
          )}

          <div className="line"></div>
        </ButtonWrapper>
        <ContractCard>
          {(selectedBtnType === 'sourceCode' || selectedBtnType === 'abi') && (
            <AceEditor
              readOnly
              style={AceEditorStyle}
              mode="solidity"
              theme="github"
              name="UNIQUE_ID_OF_DIV"
              setOptions={{
                showLineNumbers: true,
              }}
              showGutter={false}
              showPrintMargin={false}
              value={selectedBtnType === 'sourceCode' ? sourceCode : abi}
            />
          )}
          {selectedBtnType === 'read' && (
            <ContractAbi
              type="read"
              data={dataForRead}
              contractAddress={address}
              contract={contract}
            ></ContractAbi>
          )}
          {selectedBtnType === 'write' && (
            <ContractAbi
              type="write"
              data={dataForWrite}
              contractAddress={address}
              contract={contract}
            ></ContractAbi>
          )}
        </ContractCard>
      </ContractBody>
    </>
  );
}
const ContractCard = styled(Card)`
  padding-bottom: 1.2857rem !important;
`;
const ContractBody = styled.div`
  padding-bottom: 3.5714rem;
`;
const ButtonWrapper = styled.div`
  width: 100%;
  float: left;
  box-sizing: border-box;
  padding: 0 1.2857rem;
  margin: 0.5714rem 0 0 0;
  .line {
    height: 0.0714rem;
    background-color: #e8e9ea;
    margin-top: 0.5714rem;
  }
  .btn {
    color: #74798c;
    font-size: 1rem;
  }
  .btn.btnWeight {
    border-radius: 1.1429rem;
    padding: 0 1rem;
    min-width: initial;
    height: 1.8571rem;
    line-height: 1.8571rem;
    border: none;
    top: 0px;
    background-color: #f5f8ff;

    ${media.s} {
      margin: 5px 0;
    }

    &:hover {
      color: #ffffff;
      background-color: rgba(0, 84, 254, 0.8);
    }
    &:active {
      color: #ffffff;
      background-color: rgba(0, 84, 254, 0.8);
    }
    .text {
      top: 0px !important;
    }
  }
  .enabled.btn {
    color: #ffffff;
    background-color: rgba(0, 84, 254, 0.8);
  }

  .btn-item.btn {
    margin-left: 0.2857rem;
  }
  .hidden {
    display: none;
  }
`;

export function Table({ address, addressInfo }) {
  const bp = useBreakpoint();
  const { t } = useTranslation();
  const loadingText = t(translations.general.loading);
  const location = useLocation();
  const history = useHistory();
  const queries = queryString.parse(location.search);
  const [filterVisible, setFilterVisible] = useState(
    queries?.tab !== 'contract-viewer',
  );
  const isContract = useMemo(
    () => isContractAddress(address) || isInnerContractAddress(address),
    [address],
  );
  const [txFilterVisible, setTxFilterVisible] = useState(
    queries?.tab !== 'mined-blocks' &&
      queries?.tab !== 'transfers' &&
      queries?.tab !== `transfers-${cfxTokenTypes.erc20}` &&
      queries?.tab !== `transfers-${cfxTokenTypes.erc721}` &&
      queries?.tab !== `transfers-${cfxTokenTypes.erc1155}` &&
      !isContract,
  );
  // set default tab to transaction
  const {
    minTimestamp,
    maxTimestamp,
    tab = 'transaction',
    accountAddress,
  } = queryString.parse(location.search || '');
  // let { data: contractInfo } = useContract(isContract && address, [
  //   'erc20TransferCount',
  //   'erc721TransferCount',
  //   'erc1155TransferCount',
  //   'sourceCode',
  //   'abi',
  // ]);
  // let { data: accountInfo } = useAccount(!isContract && address, [
  //   'erc20TransferCount',
  //   'erc721TransferCount',
  //   'erc1155TransferCount',
  // ]);
  useEffect(() => {
    history.replace(
      queryString.stringifyUrl({
        url: location.pathname,
        query: {
          accountAddress: address,
          ...queries,
        },
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, location.pathname, address, history]);

  const columnsTransactionsWidth = [4, 5, 5, 3, 2, 3, 4];
  const columnsTransactions: ColumnsType = [
    transactionColunms.hash,
    tokenColunms.from,
    tokenColunms.to,
    transactionColunms.value,
    transactionColunms.gasPrice,
    transactionColunms.gasFee,
    transactionColunms.age,
  ].map((item, i) => ({ ...item, width: columnsTransactionsWidth[i] }));

  const tokenColumnsToken = {
    ...tokenColunms.token,
    render: row => (
      <StyledIconWrapper>
        {row?.token
          ? [
              <img
                key="img"
                src={row?.token?.icon || defaultTokenIcon}
                alt="token icon"
              />,
              <Link key="link" href={`/token/${row?.token?.address}`}>
                <Text
                  span
                  hoverValue={`${
                    row?.token?.name || t(translations.general.notAvailable)
                  } (${
                    row?.token?.symbol || t(translations.general.notAvailable)
                  })`}
                >
                  {formatString(
                    `${
                      row?.token?.name || t(translations.general.notAvailable)
                    } (${
                      row?.token?.symbol || t(translations.general.notAvailable)
                    })`,
                    'tag',
                  )}
                </Text>
              </Link>,
            ]
          : loadingText}
      </StyledIconWrapper>
    ),
  };

  const columnsCFXTransferWidth = [4, 3, 6, 5, 3, 5];
  const columnsCFXTrasfer: ColumnsType = [
    blockColunms.epoch,
    tokenColunms.txnHash,
    tokenColunms.from,
    tokenColunms.to,
    transactionColunms.value,
    tokenColunms.age,
  ].map((item, i) => ({ ...item, width: columnsCFXTransferWidth[i] }));

  const columnsTokensWidthErc20 = [3, 5, 5, 3, 5, 4];
  const columnsTokenTrasfersErc20: ColumnsType = [
    tokenColunms.txnHash,
    tokenColunms.from,
    tokenColunms.to,
    tokenColunms.quantity,
    tokenColumnsToken,
    tokenColunms.age,
  ].map((item, i) => ({ ...item, width: columnsTokensWidthErc20[i] }));

  const columnsTokensWidthErc721 = [3, 5, 5, 3, 5, 4];
  const columnsTokenTrasfersErc721: ColumnsType = [
    tokenColunms.txnHash,
    tokenColunms.from,
    tokenColunms.to,
    tokenColunms.tokenId,
    tokenColumnsToken,
    tokenColunms.age,
  ].map((item, i) => ({ ...item, width: columnsTokensWidthErc721[i] }));

  const columnsTokensWidthErc1155 = [3, 5, 4, 2, 3, 4, 4];
  const columnsTokenTrasfersErc1155: ColumnsType = [
    tokenColunms.txnHash,
    tokenColunms.from,
    tokenColunms.to,
    tokenColunms.quantity,
    tokenColunms.tokenId,
    tokenColumnsToken,
    tokenColunms.age,
  ].map((item, i) => ({ ...item, width: columnsTokensWidthErc1155[i] }));

  const columnsBlocksWidth = [4, 2, 3, 2, 4, 3, 3, 4];
  const columnsMinedBlocks: ColumnsType = [
    blockColunms.epoch,
    blockColunms.position,
    blockColunms.hash,
    blockColunms.txns,
    blockColunms.miner,
    blockColunms.difficulty,
    blockColunms.gasUsedPercent,
    blockColunms.age,
  ].map((item, i) => ({ ...item, width: columnsBlocksWidth[i] }));

  const tabs: any = [
    {
      value: 'transaction',
      label: (total: number, realTotal: number) => {
        return (
          <>
            {t(translations.blocksAndTransactions.transactions)}
            <TabLabel total={total} realTotal={realTotal} />
          </>
        );
      },
      url: `/transaction?accountAddress=${address}`,
      pagination: true,
      table: {
        columns: columnsTransactions,
        rowKey: 'hash',
      },
      hasFilter: true,
    },
  ];

  tabs.push({
    value: `transfers-${cfxTokenTypes.cfx}`,
    label: (total: number, realTotal: number) => {
      return (
        <>
          {t(translations.general.cfxTransfer)}
          <TabLabel total={total} realTotal={realTotal} />
        </>
      );
    },
    pagination: true,
    url: `/transfer?accountAddress=${address}&transferType=${cfxTokenTypes.cfx}`,
    table: {
      columns: columnsCFXTrasfer,
      rowKey: row => `${row.transactionHash}${row.transactionTraceIndex}`,
    },
    hasFilter: true,
  });

  tabs.push({
    hidden: !addressInfo.erc20TransferCount,
    value: `transfers-${cfxTokenTypes.erc20}`,
    label: (total: number, realTotal: number) => {
      return (
        <>
          {t(translations.general.tokenTxnsErc20)}
          <TabLabel total={total} realTotal={realTotal} />
        </>
      );
    },
    pagination: true,
    url: `/transfer?accountAddress=${address}&transferType=${cfxTokenTypes.erc20}`,
    table: {
      columns: columnsTokenTrasfersErc20,
      rowKey: row => `${row.transactionHash}${row.transactionLogIndex}`,
    },
    hasFilter: true,
  });

  tabs.push({
    hidden: !addressInfo.erc721TransferCount,
    value: `transfers-${cfxTokenTypes.erc721}`,
    label: (total: number, realTotal: number) => {
      return (
        <>
          {t(translations.general.tokenTxnsErc721)}
          <TabLabel total={total} realTotal={realTotal} />
        </>
      );
    },
    pagination: true,
    url: `/transfer?accountAddress=${address}&transferType=${cfxTokenTypes.erc721}`,
    table: {
      columns: columnsTokenTrasfersErc721,
      rowKey: row => `${row.transactionHash}${row.transactionLogIndex}`,
    },
    hasFilter: true,
  });

  tabs.push({
    hidden: !addressInfo.erc1155TransferCount,
    value: `transfers-${cfxTokenTypes.erc1155}`,
    label: (total: number, realTotal: number) => {
      return (
        <>
          {t(translations.general.tokenTxnsErc1155)}
          <TabLabel total={total} realTotal={realTotal} />
        </>
      );
    },
    pagination: true,
    url: `/transfer?accountAddress=${address}&transferType=${cfxTokenTypes.erc1155}`,
    table: {
      columns: columnsTokenTrasfersErc1155,
      // fix same key
      rowKey: row =>
        `${row.transactionHash}${row.transactionLogIndex}${row.batchIndex}`,
    },
    hasFilter: true,
  });

  tabs.push(
    isContract
      ? {
          value: 'contract-viewer',
          label: t(translations.token.contract),
          content: <ContractSourceCodeAbi contractInfo={addressInfo} />,
        }
      : {
          value: 'mined-blocks',
          hideTotalZero: true,
          pagination: true,
          label: (total: number, realTotal: number) => {
            return (
              <>
                {t(translations.addressDetail.minedBlocks)}
                <TabLabel total={total} realTotal={realTotal} />
              </>
            );
          },

          url: `/block?miner=${address}`,
          table: {
            columns: columnsMinedBlocks,
            rowKey: 'hash',
          },
          hasFilter: true,
        },
  );

  const showExportRecordsButton =
    bp !== 's' && localStorage.getItem('showExportRecordsButton') === 'true';
  const handleExportRecords = () => {
    const exportRecordsPathMap = {
      transaction: 'transaction',
    };
    exportRecordsPathMap[`transfers-${cfxTokenTypes.erc20}`] = 'transfer';
    exportRecordsPathMap[`transfers-${cfxTokenTypes.erc721}`] = 'transfer';
    exportRecordsPathMap[`transfers-${cfxTokenTypes.erc1155}`] = 'transfer';
    const exportRecordsPath =
      typeof tab === 'string' && exportRecordsPathMap[tab];

    if (exportRecordsPath) {
      // @todo why need transferType of /v1/report/transfer?
      const url = queryString.stringifyUrl({
        url: `/v1/report/${exportRecordsPath}`,
        query: {
          minTimestamp,
          maxTimestamp,
          accountAddress,
          transferType:
            tab === 'transaction' ? null : tab!['replace']('transfers-', ''),
        },
      });
      window.open(url);
    }
  };

  // url 上的 maxTimestamp 是第二天的 00:00:00，datepicker 上需要减掉一秒，展示为前一天的 23:59:59
  const maxT = maxTimestamp && String(Number(maxTimestamp) - 1);

  // TODO change tab request multi api

  return (
    <TableWrap>
      {filterVisible && (
        <FilterWrap>
          <ExportRecordsButtonWrapper
            className={clsx({
              show: showExportRecordsButton,
            })}
          >
            <Button
              size="small"
              variant="solid"
              color="primary"
              onClick={handleExportRecords}
            >
              {t(translations.general.exportRecords)}
            </Button>
          </ExportRecordsButtonWrapper>
          <PickerWithQuery
            key="date-picker-query"
            minTimestamp={minTimestamp}
            maxTimestamp={maxT}
            onChange={dateQuery => {
              if (!dateQuery)
                return history.push(
                  queryString.stringifyUrl({
                    url: location.pathname,
                    query: {
                      ...queries,
                      minTimestamp: undefined,
                      maxTimestamp: undefined,
                    },
                  }),
                );

              let minTimestamp, maxTimestamp;

              if (dateQuery[0]) {
                minTimestamp = Math.floor(+dateQuery[0] / 1000);
              }

              if (dateQuery[1]) {
                maxTimestamp = Math.round(+dateQuery[1] / 1000);
              }

              if (
                minTimestamp !== undefined &&
                minTimestamp === queries.minTimestamp
              )
                return;
              if (
                maxTimestamp !== undefined &&
                maxTimestamp === queries.maxTimestamp
              )
                return;

              history.push(
                queryString.stringifyUrl({
                  url: location.pathname,
                  query: {
                    ...queries,
                    minTimestamp,
                    maxTimestamp,
                  },
                }),
              );
            }}
          />
          {txFilterVisible && (
            <Dropdown
              key="tx-filter"
              label={<img src={imgDot} alt="address-contract-alarm" />}
              options={[
                {
                  key: 'all',
                  name: t(translations.general.viewAll),
                },
                {
                  key: 'outgoing',
                  name: t(translations.transaction.viewOutgoingTxns),
                },
                {
                  key: 'incoming',
                  name: t(translations.transaction.viewIncomingTxns),
                },
              ]}
              onChange={txType => {
                if (queries?.txType !== txType)
                  history.push(
                    queryString.stringifyUrl({
                      url: location.pathname,
                      query: {
                        ...queries,
                        txType,
                      },
                    }),
                  );
              }}
            />
          )}
        </FilterWrap>
      )}
      <TabsTablePanel
        key="table"
        tabs={tabs}
        onTabsChange={value => {
          if (
            value.startsWith('transfers') ||
            value === 'mined-blocks' ||
            isContract
          )
            setTxFilterVisible(false);
          else setTxFilterVisible(true);
          if (value === 'contract-viewer') return setFilterVisible(false);
          setFilterVisible(true);
        }}
      />
    </TableWrap>
  );
}

const TableWrap = styled.div`
  position: relative;
`;

const FilterWrap = styled.div`
  position: absolute;
  right: 10px;
  top: 75px;
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 200;

  ${media.s} {
    flex-direction: column;
    align-items: flex-start;
    right: unset;
    left: 0;
    top: 7rem;
    z-index: 10;
  }
`;

const ExportRecordsButtonWrapper = styled.span`
  display: none;
  margin-right: 1rem;
  &.show {
    display: inherit;
  }
`;
