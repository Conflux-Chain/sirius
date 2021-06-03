import React, { useEffect, useMemo } from 'react';
import clsx from 'clsx';
import queryString from 'query-string';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Button } from '@cfxjs/react-ui';
import { useHistory, useLocation } from 'react-router';
import {
  blockColunms,
  tokenColunms,
  transactionColunms,
} from 'utils/tableColumns';
import { StyledIconWrapper } from 'utils/tableColumns/token';
import { Link } from 'app/components/Link';
import { Text } from 'app/components/Text';
import { ColumnsType } from 'app/components/TabsTablePanel';
import { TabsTablePanel } from 'app/components/TabsTablePanel/Loadable';
import {
  formatString,
  isContractAddress,
  isInnerContractAddress,
  toThousands,
  isAccountAddress,
} from 'utils';
import { media, useBreakpoint } from 'styles/media';
import { defaultTokenIcon } from '../../../constants';
import {
  TableSearchDatepicker,
  TableSearchDropdown,
} from 'app/components/TablePanel';
import { cfxTokenTypes } from 'utils/constants';
import { useAge } from 'utils/hooks/useAge';
import { AddressContainer } from 'app/components/AddressContainer';
import { DownloadCSV } from 'app/components/DownloadCSV/Loadable';
import { Tooltip } from 'app/components/Tooltip/Loadable';
import { ContractContent } from './ContractContent';

import iconInfo from 'images/info.svg';

export function Table({ address, addressInfo }) {
  const bp = useBreakpoint();
  const { t } = useTranslation();
  const loadingText = t(translations.general.loading);
  const location = useLocation();
  const history = useHistory();
  const queries = queryString.parse(location.search);
  const isContract = useMemo(
    () => isContractAddress(address) || isInnerContractAddress(address),
    [address],
  );
  const [ageFormat, toggleAgeFormat] = useAge();

  const {
    minTimestamp,
    maxTimestamp,
    tab = 'transaction',
    accountAddress,
  } = queryString.parse(location.search || '');

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

  const showExportRecordsButton =
    bp !== 's' && localStorage.getItem('showExportRecordsButton') === 'true';
  const handleExportRecords = () => {
    const exportRecordsPathMap = {
      transaction: 'transaction',
    };
    exportRecordsPathMap[`transfers-${cfxTokenTypes.erc20}`] = 'transfer';
    exportRecordsPathMap[`transfers-${cfxTokenTypes.erc721}`] = 'transfer';
    exportRecordsPathMap[`transfers-${cfxTokenTypes.erc1155}`] = 'transfer';
    exportRecordsPathMap[`transfers-${cfxTokenTypes.cfx}`] = 'transfer';
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
          limit: '5000',
          reverse: 'false',
          transferType:
            tab === 'transaction' ? null : tab!['replace']('transfers-', ''),
        },
      });
      window.open(url);
    }
  };

  const exportRecordsField = (
    <ExportRecordsButtonWrapper
      className={clsx({
        show: showExportRecordsButton,
      })}
      key={`${tab}-tableSearchExportButton`}
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
  );

  const datepickField = (
    <TableSearchDatepicker key={`${tab}-tableSearchDatepicker`} />
  );

  const dropdownField = (
    <TableSearchDropdown
      key={`${tab}-tableSearchDropdown`}
      options={[
        {
          key: 'txType',
          value: 'all',
          name: t(translations.general.viewAll),
        },
        {
          key: 'txType',
          value: 'outgoing',
          name: t(translations.transaction.viewOutgoingTxns),
        },
        {
          key: 'txType',
          value: 'incoming',
          name: t(translations.transaction.viewIncomingTxns),
        },
        {
          key: 'status',
          value: '1',
          name: t(translations.transaction.viewFailedTxns),
        },
        {
          key: 'txType',
          value: 'create',
          name: t(translations.transaction.viewCreationTxns),
        },
      ]}
    />
  );

  const columnsTransactionsWidth = [4, 3, 7, 6, 3, 2, 3, 4];
  const columnsTransactions: ColumnsType = [
    transactionColunms.hash,
    transactionColunms.method,
    tokenColunms.from,
    tokenColunms.to,
    transactionColunms.value,
    transactionColunms.gasPrice,
    transactionColunms.gasFee,
    transactionColunms.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsTransactionsWidth[i] }));

  const columnsPendingTransactionsWidth = [4, 6, 5, 3, 2, 3, 5];
  const columnsPendingTransactions: ColumnsType = [
    transactionColunms.hash,
    tokenColunms.from,
    tokenColunms.to,
    transactionColunms.value,
    transactionColunms.gasPrice,
    {
      ...transactionColunms.gasFee,
      render: () => t(translations.transactions.pendingTxnGasFee),
    },
    transactionColunms.pendingReason,
  ].map((item, i) => ({ ...item, width: columnsPendingTransactionsWidth[i] }));

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
                    36,
                  )}
                </Text>
              </Link>,
            ]
          : loadingText}
      </StyledIconWrapper>
    ),
  };

  const columnsCFXTransferWidth = [4, 4, 8, 7, 4, 5];
  const columnsCFXTrasfer: ColumnsType = [
    tokenColunms.txnHash,
    blockColunms.epoch,
    tokenColunms.from,
    tokenColunms.to,
    transactionColunms.value,
    tokenColunms.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsCFXTransferWidth[i] }));

  const columnsTokensWidthErc20 = [3, 6, 5, 3, 6, 4];
  const columnsTokenTrasfersErc20: ColumnsType = [
    tokenColunms.txnHash,
    tokenColunms.from,
    tokenColunms.to,
    tokenColunms.quantity,
    tokenColumnsToken,
    tokenColunms.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsTokensWidthErc20[i] }));

  const columnsTokensWidthErc721 = [3, 6, 5, 4, 6, 4];
  const columnsTokenTrasfersErc721: ColumnsType = [
    tokenColunms.txnHash,
    tokenColunms.from,
    tokenColunms.to,
    tokenColunms.tokenId,
    tokenColumnsToken,
    tokenColunms.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsTokensWidthErc721[i] }));

  const columnsTokensWidthErc1155 = [3, 6, 5, 2, 4, 5, 4];
  const columnsTokenTrasfersErc1155: ColumnsType = [
    tokenColunms.txnHash,
    tokenColunms.from,
    tokenColunms.to,
    tokenColunms.quantity,
    tokenColunms.tokenId,
    tokenColumnsToken,
    tokenColunms.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsTokensWidthErc1155[i] }));

  const columnsBlocksWidth = [4, 2, 2, 4, 6, 3, 5, 3, 5];
  const columnsMinedBlocks: ColumnsType = [
    blockColunms.epoch,
    blockColunms.position,
    blockColunms.txns,
    blockColunms.hash,
    {
      ...blockColunms.miner,
      render: value => <AddressContainer isLink={false} value={value} />,
    },
    blockColunms.avgGasPrice,
    blockColunms.gasUsedPercentWithProgress,
    blockColunms.reward,
    blockColunms.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsBlocksWidth[i] }));

  const tabs: any = [
    {
      value: 'transaction',
      action: 'accountTransactions',
      label: isAccountAddress(address)
        ? t(translations.transactions.executed)
        : t(translations.general.transactions),
      url: `/transaction?accountAddress=${address}`,
      pagination: true,
      table: {
        columns: columnsTransactions,
        rowKey: 'hash',
        className: 'transaction-wide',
      },
      tableHeader: ({ total }) => (
        <StyledTableHeaderWrapper>
          {t(translations.general.totalRecord, {
            total: toThousands(total),
          })}

          <FilterWrap>
            {exportRecordsField}
            {datepickField}
            {isContract ? null : dropdownField}
          </FilterWrap>
        </StyledTableHeaderWrapper>
      ),
      tableFooter: (
        <DownloadCSV
          url={queryString.stringifyUrl({
            url: '/v1/report/transaction',
            query: {
              minTimestamp,
              maxTimestamp,
              accountAddress,
              limit: '5000',
              reverse: 'true',
            },
          })}
        />
      ),
    },
  ];

  if (isAccountAddress(address)) {
    tabs.push({
      value: 'transaction-pending',
      action: 'accountTransactions-pending',
      label: t(translations.transactions.pending),
      url: `/rpc/cfx_getAccountPendingTransactions?address=${address}`,
      pagination: false,
      table: {
        columns: columnsPendingTransactions,
        rowKey: 'hash',
        className: 'transaction-wide',
      },
      tableHeader: ({ total }) => (
        <StyledTableHeaderWrapper>
          <div>
            <Tooltip
              className="download-csv-tooltip"
              text={t(translations.transactions.pendingTip)}
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

            {total > 10
              ? t(translations.transactions.pendingTotal, {
                  total: toThousands(total),
                })
              : t(translations.general.totalRecord, {
                  total: toThousands(total),
                })}
          </div>
        </StyledTableHeaderWrapper>
      ),
    });
  }

  tabs.push({
    value: `transfers-${cfxTokenTypes.cfx}`,
    action: 'cfxTransfers',
    label: t(translations.general.cfxTransfer),
    pagination: true,
    url: `/transfer?accountAddress=${address}&transferType=${cfxTokenTypes.cfx}`,
    table: {
      columns: columnsCFXTrasfer,
      rowKey: row => `${row.transactionHash}${row.transactionTraceIndex}`,
    },
    tableHeader: ({ total }) => (
      <StyledTableHeaderWrapper>
        {t(translations.general.totalRecord, {
          total: toThousands(total),
        })}
        <FilterWrap>
          {exportRecordsField}
          {datepickField}
        </FilterWrap>
      </StyledTableHeaderWrapper>
    ),
    tableFooter: (
      <DownloadCSV
        url={queryString.stringifyUrl({
          url: '/v1/report/transfer',
          query: {
            minTimestamp,
            maxTimestamp,
            accountAddress,
            limit: '5000',
            reverse: 'true',
            transferType: 'CFX',
          },
        })}
      />
    ),
  });

  tabs.push({
    hidden: !addressInfo.erc20TransferCount,
    value: `transfers-${cfxTokenTypes.erc20}`,
    action: 'transfersCrc20',
    label: t(translations.general.tokenTxnsErc20),
    pagination: true,
    url: `/transfer?accountAddress=${address}&transferType=${cfxTokenTypes.erc20}`,
    table: {
      columns: columnsTokenTrasfersErc20,
      rowKey: row => `${row.transactionHash}${row.transactionLogIndex}`,
    },
    tableHeader: ({ total }) => (
      <StyledTableHeaderWrapper>
        {t(translations.general.totalRecord, {
          total: toThousands(total),
        })}
        <FilterWrap>
          {exportRecordsField}
          {datepickField}
        </FilterWrap>
      </StyledTableHeaderWrapper>
    ),
    tableFooter: (
      <DownloadCSV
        url={queryString.stringifyUrl({
          url: '/v1/report/transfer',
          query: {
            minTimestamp,
            maxTimestamp,
            accountAddress,
            limit: '5000',
            reverse: 'true',
            transferType: 'ERC20',
          },
        })}
      />
    ),
  });

  tabs.push({
    hidden: !addressInfo.erc721TransferCount,
    value: `transfers-${cfxTokenTypes.erc721}`,
    action: 'transfersCrc721',
    label: t(translations.general.tokenTxnsErc721),
    pagination: true,
    url: `/transfer?accountAddress=${address}&transferType=${cfxTokenTypes.erc721}`,
    table: {
      columns: columnsTokenTrasfersErc721,
      rowKey: row => `${row.transactionHash}${row.transactionLogIndex}`,
    },
    tableHeader: ({ total }) => (
      <StyledTableHeaderWrapper>
        {t(translations.general.totalRecord, {
          total: toThousands(total),
        })}
        <FilterWrap>
          {exportRecordsField}
          {datepickField}
        </FilterWrap>
      </StyledTableHeaderWrapper>
    ),
    tableFooter: (
      <DownloadCSV
        url={queryString.stringifyUrl({
          url: '/v1/report/transfer',
          query: {
            minTimestamp,
            maxTimestamp,
            accountAddress,
            limit: '5000',
            reverse: 'true',
            transferType: 'ERC721',
          },
        })}
      />
    ),
  });

  tabs.push({
    hidden: !addressInfo.erc1155TransferCount,
    value: `transfers-${cfxTokenTypes.erc1155}`,
    action: 'transfersCrc1155',
    label: t(translations.general.tokenTxnsErc1155),
    pagination: true,
    url: `/transfer?accountAddress=${address}&transferType=${cfxTokenTypes.erc1155}`,
    table: {
      columns: columnsTokenTrasfersErc1155,
      // fix same key
      rowKey: row =>
        `${row.transactionHash}${row.transactionLogIndex}${row.batchIndex}`,
    },
    tableHeader: ({ total }) => (
      <StyledTableHeaderWrapper>
        {t(translations.general.totalRecord, {
          total: toThousands(total),
        })}
        <FilterWrap>
          {exportRecordsField}
          {datepickField}
        </FilterWrap>
      </StyledTableHeaderWrapper>
    ),
    tableFooter: (
      <DownloadCSV
        url={queryString.stringifyUrl({
          url: '/v1/report/transfer',
          query: {
            minTimestamp,
            maxTimestamp,
            accountAddress,
            limit: '5000',
            reverse: 'true',
            transferType: 'ERC1155',
          },
        })}
      />
    ),
  });

  tabs.push(
    isContract
      ? {
          value: 'contract-viewer',
          action: 'contractViewer',
          label: t(translations.token.contract),
          content: <ContractContent contractInfo={addressInfo} />,
        }
      : {
          value: 'mined-blocks',
          action: 'minedBlocks',
          hideTotalZero: true,
          pagination: true,
          label: t(translations.addressDetail.minedBlocks),
          url: `/block?miner=${address}`,
          table: {
            columns: columnsMinedBlocks,
            rowKey: 'hash',
          },
          tableHeader: ({ total }) => (
            <StyledTableHeaderWrapper>
              {t(translations.general.totalRecord, {
                total: toThousands(total),
              })}
              <FilterWrap>
                {exportRecordsField}
                {datepickField}
              </FilterWrap>
            </StyledTableHeaderWrapper>
          ),
          tableFooter: (
            <DownloadCSV
              url={queryString.stringifyUrl({
                url: '/v1/report/mined_block', // @todo replace with real url
                query: {
                  minTimestamp,
                  maxTimestamp,
                  accountAddress,
                  limit: '5000',
                  reverse: 'true',
                },
              })}
            />
          ),
        },
  );

  // TODO change tab cause multi api request

  return <TabsTablePanel key="table" tabs={tabs} />;
}

const ExportRecordsButtonWrapper = styled.span`
  display: none;
  margin-right: 1rem;
  &.show {
    display: inherit;
  }
`;

const FilterWrap = styled.div`
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

// @todo, used for temp, should be replace when update table filter group, add filter group to tableHeader
const StyledTableHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IconWrapper = styled.div`
  padding-right: 0.2857rem;
  width: 1.2857rem;
  cursor: pointer;

  .download-svg-img {
    margin-top: -0.2857rem;
  }
`;
