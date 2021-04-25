import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { translations } from '../../../locales/i18n';
import { TablePanel } from '../../components/TablePanel/Loadable';
import { ColumnsType } from '../../components/TabsTablePanel';
import { TipLabel } from '../../components/TabsTablePanel/Loadable';
import { PageHeader } from '../../components/PageHeader/Loadable';
import { useTableData } from './../../components/TabsTablePanel/useTableData';
import { tokenColunms } from '../../../utils/tableColumns';
import styled from 'styled-components/macro';
import { Tooltip } from '../../components/Tooltip/Loadable';
import { cfxTokenTypes } from '../../../utils/constants';
import queryString from 'query-string';

import imgInfo from 'images/info.svg';
import { trackEvent } from '../../../utils/ga';
import { ScanEvent } from '../../../utils/gaConstants';

interface RouteParams {
  tokenType: string;
}

export function Tokens() {
  const { t } = useTranslation();
  const { tokenType } = useParams<RouteParams>();
  const { page = 1, pageSize = 10 } = queryString.parse(window.location.search);

  let columnsWidth = [1, 6, 3, 3, 3, 3, 5];
  let columns: ColumnsType = [
    tokenColunms.number(page, pageSize),
    tokenColunms.token,
    tokenColunms.price,
    tokenColunms.marketCap,
    tokenColunms.transfer,
    tokenColunms.holders,
    tokenColunms.contract(),
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  let url = `/stat/tokens/list?transferType=${cfxTokenTypes.erc20}&reverse=true&orderBy=totalPrice&fields=transferCount,icon,price,totalPrice,quoteUrl,transactionCount,erc20TransferCount`;

  let title = t(translations.header.tokens20);

  let defaultSortOrder = 'desc';
  let defaultSortKey = 'totalPrice';

  if (
    tokenType === cfxTokenTypes.erc721 ||
    tokenType === cfxTokenTypes.crc721
  ) {
    columnsWidth = [1, 8, 4, 4, 8];
    columns = [
      tokenColunms.number(page, pageSize),
      tokenColunms.token,
      tokenColunms.transfer,
      tokenColunms.holders,
      tokenColunms.contract(true),
    ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

    url = `/stat/tokens/list?transferType=${cfxTokenTypes.erc721}&reverse=true&orderBy=transferCount&fields=transferCount,icon,transactionCount`;
    title = t(translations.header.tokens721);
    defaultSortKey = 'transferCount';
  }

  if (
    tokenType === cfxTokenTypes.erc1155 ||
    tokenType === cfxTokenTypes.crc1155
  ) {
    columnsWidth = [1, 8, 5, 8];
    columns = [
      tokenColunms.number(page, pageSize),
      tokenColunms.token,
      tokenColunms.transfer,
      tokenColunms.contract(true),
    ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

    url = `/stat/tokens/list?transferType=${cfxTokenTypes.erc1155}&reverse=true&orderBy=transferCount&fields=transferCount,icon,transactionCount`;
    title = t(translations.header.tokens1155);
    defaultSortKey = 'transferCount';
  }

  const [tableTokenType, setTableTokenType] = useState(tokenType);
  const [queryUrl, setQueryUrl] = useState(url);
  const [tableSortOrder, setTableSortOrder] = useState(defaultSortOrder);
  const [tableSortKey, setTableSortKey] = useState(defaultSortKey);
  const { total } = useTableData(url);

  useEffect(() => {
    setQueryUrl(url);
    // reset default sort after token type change
    if (tableTokenType !== tokenType) {
      setTableTokenType(tokenType);
      setTableSortOrder(defaultSortOrder);
      setTableSortKey(defaultSortKey);
    }
  }, [url, tableTokenType, tokenType, defaultSortOrder, defaultSortKey]);

  // deal with column sort
  const sorter = (column, table, oldUrl) => {
    let newSortOrder = tableSortOrder === 'asc' ? 'desc' : 'asc';
    let urlSortKey = column.dataIndex;
    // deal with especial key
    // if (urlSortKey === 'transferCount') {
    //   if (tokenType === cfxTokenTypes.erc721) {
    //     urlSortKey = 'erc721TransferCount';
    //   } else if (tokenType === cfxTokenTypes.erc1155) {
    //     urlSortKey = 'erc1155TransferCount';
    //   }
    // }

    // generate new url by replace sort params
    const newUrl = oldUrl
      .replace(
        /reverse=[^&]*/g,
        newSortOrder === 'desc' ? 'reverse=true' : 'reverse=false',
      )
      .replace(/orderBy=[^&]*/g, 'orderBy=' + urlSortKey);

    setTableSortKey(column.dataIndex);
    setTableSortOrder(newSortOrder);
    if (newUrl !== oldUrl) {
      setQueryUrl(newUrl);
      trackEvent({
        category: ScanEvent.function.category,
        action: ScanEvent.function.action.tokenTableSort,
        label: `${tokenType}_${column.dataIndex}_${newSortOrder}`,
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={t(title)} />
      </Helmet>
      <PageHeader
        subtitle={
          <TipLabel
            total={total}
            left={t(translations.tokens.tipCountBefore)}
            right={t(translations.tokens.tipCountAfter)}
          />
        }
      >
        {title}
        <Tooltip
          hoverable
          text={t(translations.tokens.crcTip, {
            crc: tokenType,
            erc: tokenType.replace('CRC', 'ERC'),
          })}
          placement="top"
        >
          <IconWrapper>
            <img src={imgInfo} alt="?" />
          </IconWrapper>
        </Tooltip>
      </PageHeader>

      <TablePanel
        table={{
          columns: columns,
          rowKey: 'address',
          sorter,
          sortOrder: tableSortOrder,
          sortKey: tableSortKey,
        }}
        url={queryUrl}
      />
    </>
  );
}

const IconWrapper = styled.div`
  padding-left: 0.2857rem;
  width: 1.2857rem;
  cursor: pointer;
`;
