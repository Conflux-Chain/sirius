import React, { useEffect, useState } from 'react';
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
  totalSupply: number;
  price: number;
  holderCount: number;
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
  totalSupply,
  price,
  holderCount,
  transferType,
}: TransferProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const [showFilter, setShowFilter] = useState(false);

  let {
    page = 1,
    pageSize = 10,
    accountAddress: filterAddr,
    transactionHash: filterHash,
    tokenId: filterTokenId,
    tab: currentTab,
    ...others
  } = queryString.parse(location.search);

  useEffect(() => {
    if (currentTab !== 'holders') {
      setShowFilter(true);
    }
  }, [currentTab]);

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
        pageSize: pageSize as string,
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
  let holdersColumnsWidth = [2, 10, 6, 4];
  let holdersColumns = [
    tokenColunms.number(page, pageSize),
    tokenColunms.account,
    tokenColunms.balance(
      transferType === cfxTokenTypes.erc20 ? decimals : 0,
      price,
      transferType,
    ),
    tokenColunms.percentage(totalSupply),
  ].map((item, i) => ({ ...item, width: holdersColumnsWidth[i] }));

  const tabs: any = [
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
      label: () => {
        return (
          <>
            {t(translations.token.holders)}
            <TabLabel total={holderCount} realTotal={holderCount} />
          </>
        );
      },
      url: `/stat/tokens/holder-rank?address=${tokenAddress}&reverse=true&orderBy=balance`,
      table: {
        className: 'monospaced',
        columns: holdersColumns,
        rowKey: row => `${tokenAddress}${row.account.address}`,
      },
    });
  }

  const onTabsChange = tab => {
    setShowFilter(tab !== 'holders');
  };

  return (
    <TransfersWrap>
      <TabsTablePanel tabs={tabs} onTabsChange={onTabsChange} />
      {showFilter ? (
        <Filter
          decimals={decimals}
          symbol={symbol}
          tokenAddress={tokenAddress}
          transferType={transferType}
          onFilter={onFilter}
          filter={filter}
        />
      ) : null}
    </TransfersWrap>
  );
}

const TransfersWrap = styled.div`
  position: relative;
  ${media.s} {
    padding-top: 4rem;
  }
`;
