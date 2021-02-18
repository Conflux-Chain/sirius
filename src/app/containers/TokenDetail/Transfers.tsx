import React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { media } from '../../../styles/media';
import { translations } from '../../../locales/i18n';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { isAddress, isHash } from 'utils';
import {
  TabLabel,
  TabsTablePanel,
} from '../../components/TabsTablePanel/Loadable';
import { Filter } from './Filter';
import { tokenColunms } from '../../../utils/tableColumns';
import { cfxTokenTypes } from '../../../utils/constants';

interface TransferProps {
  tokenAddress: string;
  symbol: string;
  decimals: number;
  transferType: string;
}
interface Query {
  accountAddress?: string;
  transactionHash?: string;
  tokenId?: string;
}

export function Transfers({
  tokenAddress,
  symbol,
  decimals,
  transferType,
}: TransferProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();

  let {
    pageSize: parsedPageSize,
    accountAddress: filterAddr,
    transactionHash: filterHash,
    tokenId: filterTokenId,
    ...others
  } = queryString.parse(location.search);
  if (!parsedPageSize) {
    parsedPageSize = '10';
  }

  const filter =
    (filterAddr as string) ||
    (filterHash as string) ||
    (filterTokenId as string) ||
    '';

  const onFilter = (filter: string) => {
    let object: Query = {};
    if (isAddress(filter)) {
      object.accountAddress = filter;
    } else if (isHash(filter)) {
      object.transactionHash = filter;
    } else if (transferType !== cfxTokenTypes.erc20) {
      object.tokenId = filter;
    }
    const urlWithQuery = queryString.stringifyUrl({
      url: location.pathname,
      query: {
        ...others,
        page: '1',
        pageSize: parsedPageSize as string,
        ...object,
      },
    });
    history.push(urlWithQuery);
  };

  let columnsWidth = [3, 4, 4, 4, 3];
  let columns = [
    // {
    //   ...tokenColunms.txnHash,
    //   render: value => {
    //     if (value === filter) {
    //       return (
    //         <Text onClick={() => onFilter(value)} span hoverValue={value}>
    //           {formatString(value, 'hash')}
    //         </Text>
    //       );
    //     } else {
    //       return (
    //         <Link>
    //           <Text onClick={() => onFilter(value)} span hoverValue={value}>
    //             {formatString(value, 'hash')}
    //           </Text>
    //         </Link>
    //       );
    //     }
    //   },
    // },
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
    tokenColunms.age,
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  if (transferType === cfxTokenTypes.erc721) {
    columnsWidth = [3, 4, 4, 4, 3];
    columns = [
      tokenColunms.txnHash,
      tokenColunms.from,
      tokenColunms.to,
      tokenColunms.tokenId,
      tokenColunms.age,
    ].map((item, i) => ({ ...item, width: columnsWidth[i] }));
  }
  if (transferType === cfxTokenTypes.erc1155) {
    columnsWidth = [3, 5, 5, 3, 4, 4];
    columns = [
      tokenColunms.txnHash,
      tokenColunms.from,
      tokenColunms.to,
      tokenColunms.quantity,
      tokenColunms.tokenId,
      tokenColunms.age,
    ].map((item, i) => ({ ...item, width: columnsWidth[i] }));
  }

  // holders
  let holdersColumnsWidth = [8, 6, 4];
  let holdersColumns = [
    tokenColunms.address,
    tokenColunms.balance(decimals),
    tokenColunms.percentage,
  ].map((item, i) => ({ ...item, width: holdersColumnsWidth[i] }));

  const tabs = [
    {
      value: 'transfers',
      label: (total: number, realTotal: number) => {
        return (
          <>
            {t(translations.token.transfers)}
            <TabLabel total={total} realTotal={realTotal} />
          </>
        );
      },
      // address filter contract transfers events
      // accountAddress filter from or to transfers, regard accountAddress as ordinary address
      url: `/transfer?address=${tokenAddress}&transferType=${transferType}`,
      table: {
        columns: columns,
        rowKey: row => `${row.transactionHash}${row.transactionLogIndex}`,
      },
    },
  ];

  if (
    transferType === cfxTokenTypes.erc20 ||
    transferType === cfxTokenTypes.erc721
  ) {
    tabs.push({
      value: 'holders',
      label: t(translations.token.holders),
      url: `/token/${tokenAddress}/holder?reverse=true&orderBy=balance`,
      table: {
        // @ts-ignore
        className: 'monospaced',
        columns: holdersColumns,
        rowKey: row => `${row.transactionHash}${row.accountAddress}`,
      },
    });
  }

  return (
    <TransfersWrap>
      <TabsTablePanel tabs={tabs} />
      <Filter
        decimals={decimals}
        symbol={symbol}
        tokenAddress={tokenAddress}
        transferType={transferType}
        onFilter={onFilter}
        filter={filter}
      />
    </TransfersWrap>
  );
}

const TransfersWrap = styled.div`
  position: relative;
  ${media.s} {
    padding-top: 4rem;
  }
`;
