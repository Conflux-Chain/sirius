import React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { media, useBreakpoint } from 'styles/media';
import { translations } from 'locales/i18n';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { isAddress, isHash, toThousands } from 'utils';
import { TabsTablePanel } from 'app/components/TabsTablePanel/Loadable';
import {
  TableSearchDatepicker,
  TableSearchInput,
} from 'app/components/TablePanel';
import { tokenColunms } from 'utils/tableColumns';
import { cfxTokenTypes } from 'utils/constants';
import { useAge } from 'utils/hooks/useAge';
import { Card } from 'app/components/Card';
import { LineChart as Chart } from 'app/components/Chart/Loadable';
import { DownloadCSV } from 'app/components/DownloadCSV/Loadable';
import { useMessages } from '@cfxjs/react-ui';
import _ from 'lodash';
import {
  ContractContent,
  CheckCircleIcon,
} from '../AddressContractDetail/ContractContent';
import { useContract } from '../../../utils/api';
import AlertCircle from '@zeit-ui/react-icons/alertCircle';

import { Holders } from './Holders';

interface TransferProps {
  tokenName: string;
  address: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  price: number;
  holderCount: number;
  transferType: string;
  isRegistered: boolean;
}
interface Query {
  accountAddress?: string;
  transactionHash?: string;
  tokenId?: string;
}

export function Transfers({ tokenData }: { tokenData: TransferProps }) {
  const [, setMessage] = useMessages();
  const {
    tokenName,
    address: tokenAddress,
    decimals,
    totalSupply,
    price,
    transferType = typeof tokenData.decimals !== 'undefined'
      ? cfxTokenTypes.erc20
      : '',
    isRegistered,
  } = tokenData;
  const bp = useBreakpoint();
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const [ageFormat, toggleAgeFormat] = useAge();

  const { data: contractInfo } = useContract(tokenAddress, [
    'name',
    'icon',
    'sponsor',
    'admin',
    'from',
    'code',
    'website',
    'transactionHash',
    'cfxTransferCount',
    'erc20TransferCount',
    'erc721TransferCount',
    'erc1155TransferCount',
    'stakingBalance',
    'sourceCode',
    'abi',
    'isRegistered',
    'verifyInfo',
  ]);

  let {
    page = 1,
    pageSize = 10,
    accountAddress: filterAddr,
    transactionHash: filterHash,
    tokenId: filterTokenId,
    tab: currentTab,
    ...others
  } = queryString.parse(location.search);

  const filter =
    (filterAddr as string) ||
    (filterHash as string) ||
    (filterTokenId as string) ||
    '';

  const onFilter = (filter: string) => {
    let object: Query = {};

    if (filter) {
      if (isAddress(filter)) {
        object.accountAddress = filter;
      } else if (isHash(filter)) {
        object.transactionHash = filter;
      } else if (transferType !== cfxTokenTypes.erc20 && _.isInteger(+filter)) {
        object.tokenId = filter;
      } else {
        setMessage({
          text: t(translations.token.transferList.searchError),
        });
        return;
      }
    }

    const urlWithQuery = queryString.stringifyUrl({
      url: location.pathname,
      query: {
        ...others,
        page: page as string,
        pageSize: pageSize as string,
        ...object,
      },
    });
    history.push(urlWithQuery);
  };

  let columnsWidth = [3, 6, 6, 4, 4];
  let columns = [
    tokenColunms.txnHash,
    tokenColunms.from,
    tokenColunms.to,
    {
      ...tokenColunms.quantity,
      render: (value, row, index) =>
        tokenColunms.quantity.render(value, row, index, {
          decimals,
        }),
    },
    tokenColunms.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  if (transferType === cfxTokenTypes.erc721) {
    columnsWidth = [3, 6, 6, 4, 3];
    columns = [
      tokenColunms.txnHash,
      tokenColunms.from,
      tokenColunms.to,
      tokenColunms.tokenId(),
      tokenColunms.age(ageFormat, toggleAgeFormat),
    ].map((item, i) => ({ ...item, width: columnsWidth[i] }));
  }
  if (transferType === cfxTokenTypes.erc1155) {
    columnsWidth = [3, 7, 7, 3, 4, 4];
    columns = [
      tokenColunms.txnHash,
      tokenColunms.from,
      tokenColunms.to,
      tokenColunms.quantity,
      tokenColunms.tokenId(tokenAddress),
      tokenColunms.age(ageFormat, toggleAgeFormat),
    ].map((item, i) => ({ ...item, width: columnsWidth[i] }));
  }

  const tabs: any = [
    {
      value: 'transfers',
      action: 'tokenTransfers',
      label: t(translations.token.transfers),
      // address filter contract transfers events
      // accountAddress filter from or to transfers, regard accountAddress as ordinary address
      url: `/transfer?address=${tokenAddress}&transferType=${transferType}`,
      table: {
        columns: columns,
        rowKey: (row, index) => `${row.transactionHash}${index}`,
      },
      tableHeader: ({ total }) => (
        <StyledSearchAreaWrapper>
          <StyledTotalWrapper>
            {t(
              total > 10000
                ? translations.general.totalRecordLimit
                : translations.general.totalRecord,
              {
                total: toThousands(total),
              },
            )}
          </StyledTotalWrapper>
          <div className="token-search-container">
            <TableSearchInput
              onFilter={onFilter}
              filter={filter}
              placeholder={
                transferType === cfxTokenTypes.erc20
                  ? `${t(
                      translations.general.searchInputPlaceholder.txnHash,
                    )} / ${t(
                      translations.general.searchInputPlaceholder.holderAddress,
                    )}`.replace(bp === 's' ? / \/ /gi : '/', '/')
                  : `${t(
                      translations.general.searchInputPlaceholder.txnHash,
                    )} / ${t(
                      translations.general.searchInputPlaceholder.holderAddress,
                    )} / ${t(
                      translations.general.searchInputPlaceholder.tokenID,
                    )}`.replace(bp === 's' ? / \/ /gi : '/', '/')
              }
            />
            <TableSearchDatepicker />
          </div>
        </StyledSearchAreaWrapper>
      ),
      tableFooter: (
        <DownloadCSV
          url={queryString.stringifyUrl({
            url: '/v1/report/transfer',
            query: {
              transferType: transferType,
              address: tokenAddress,
              limit: '5000',
              reverse: 'true',
            },
          })}
        />
      ),
    },
  ];

  if (
    isRegistered &&
    (transferType === cfxTokenTypes.erc20 ||
      transferType === cfxTokenTypes.erc721 ||
      transferType === cfxTokenTypes.erc1155)
  ) {
    tabs.push({
      value: 'holders',
      action: 'tokenHolders',
      label: t(translations.token.holders),
      content: (
        <Holders
          url={`/stat/tokens/holder-rank?address=${tokenAddress}&reverse=true&orderBy=balance`}
          type={transferType}
          decimals={decimals}
          price={price}
          totalSupply={totalSupply}
        />
      ),
    });
  }

  const clientWidth = document.body.clientWidth;
  let chartWidth = clientWidth - 36;

  if (clientWidth > 1350) chartWidth = 1350;
  if (chartWidth < 365) chartWidth = 365;

  const analysisPanel = () => (
    <StyledTabWrapper>
      <Card>
        <Chart
          width={chartWidth}
          indicator="tokenAnalysis"
          tokenInfo={{
            name: tokenName,
            address: tokenAddress,
            type: transferType,
          }}
        />
      </Card>
    </StyledTabWrapper>
  );

  const analysisTab = {
    value: 'analysis',
    action: 'tokenAnalysis',
    label: t(translations.token.analysis),
    content: analysisPanel(),
  };

  if (isRegistered) {
    tabs.push(analysisTab);
  }

  // Contract tab
  tabs.push({
    value: 'contract-viewer',
    action: 'contractViewer',
    label: (
      <div>
        {t(translations.token.contract)}{' '}
        {contractInfo.verify?.exactMatch ? (
          <span>
            <CheckCircleIcon />
          </span>
        ) : (
          <AlertCircle size={16} color="#e36057" />
        )}
      </div>
    ),
    content: <ContractContent contractInfo={contractInfo} />,
  });

  return transferType ? <TabsTablePanel tabs={tabs} /> : null;
}

const StyledSearchAreaWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  .token-search-container {
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;

    ${media.s} {
      justify-content: flex-start;
      margin-top: 0.3571rem;
    }
  }

  ${media.s} {
    justify-content: flex-start;
  }
`;

const StyledTabWrapper = styled.div`
  .card {
    padding: 0.3571rem !important;

    .content {
      overflow-x: auto;
      & > div {
        box-shadow: none !important;
      }
    }
  }
`;

const StyledTotalWrapper = styled.div`
  padding: 8px;
  ${media.s} {
    width: 100%;
  }
`;
