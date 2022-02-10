import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { translations } from 'locales/i18n';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { tokenColunms, utils } from 'utils/tableColumns';
import styled from 'styled-components/macro';
import { Tooltip } from 'app/components/Tooltip/Loadable';
import { CFX_TOKEN_TYPES } from 'utils/constants';
import queryString from 'query-string';
// import { useGlobal } from 'utils/hooks/useGlobal';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { useLocation } from 'react-router-dom';

import imgInfo from 'images/info.svg';

interface RouteParams {
  tokenType: string;
}

export function Tokens() {
  const location = useLocation();
  const { t } = useTranslation();
  // const { data: globalData } = useGlobal();
  const { tokenType = CFX_TOKEN_TYPES.erc20 } = useParams<RouteParams>();
  const { orderBy } = queryString.parse(location.search);

  // ERC20
  let columnsWidth = [1, 2, 7, 4, 2, 3, 3, 2, 4];
  let columns = [
    {
      ...utils.number,
      render(value, row, index) {
        return utils.number.render(value, row, index, 3);
      },
    },
    {
      ...utils.number,
      render(value, row, index) {
        return row.hex40id;
      },
    },
    tokenColunms.token,
    tokenColunms.contract(),
    {
      ...tokenColunms.price,
      sorter: true,
    },
    {
      ...tokenColunms.marketCap,
      sorter: true,
      defaultSortOrder: 'descend' as 'descend' | 'ascend',
    },
    {
      ...tokenColunms.transfer,
      sorter: true,
    },
    {
      ...tokenColunms.holders,
      sorter: true,
    },
    {
      ...tokenColunms.projectInfo,
      sorter: true,
    },
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  let url = `/stat/tokens/list?transferType=${
    CFX_TOKEN_TYPES.erc20
  }&reverse=true&orderBy=totalPrice&${queryString.stringify({
    fields: [
      'transferCount',
      'iconUrl',
      'price',
      'totalPrice',
      'quoteUrl',
      'transactionCount',
      'erc20TransferCount',
    ],
  })}`;
  // let url = `/stat/tokens/list?transferType=${CFX_TOKEN_TYPES.erc20}&reverse=true&orderBy=totalPrice&fields=transferCount,icon,price,totalPrice,quoteUrl,transactionCount,erc20TransferCount&currency=${globalData.currency}`; // @todo wait for new api handler
  let title = t(translations.header.tokens20);

  if (
    tokenType === CFX_TOKEN_TYPES.erc721 ||
    tokenType === CFX_TOKEN_TYPES.crc721
  ) {
    columnsWidth = [1, 2, 7, 4, 2, 2, 2, 4];
    columns = [
      utils.number,
      {
        ...utils.number,
        render(value, row, index) {
          return row.hex40id;
        },
      },
      tokenColunms.token,
      tokenColunms.contract(),
      {
        ...tokenColunms.transfer,
        sorter: true,
      },
      {
        ...utils.number,
        render(value, row, index) {
          return row.totalSupply;
        },
      },
      {
        ...tokenColunms.holders,
        sorter: true,
      },
      {
        ...tokenColunms.projectInfo,
        sorter: true,
        defaultSortOrder: 'descend',
      },
    ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

    url = `/stat/tokens/list?transferType=${
      CFX_TOKEN_TYPES.erc721
    }&reverse=true&orderBy=securityCredits&${queryString.stringify({
      fields: ['transferCount', 'iconUrl', 'transactionCount'],
    })}`;
    // url = `/stat/tokens/list?transferType=${CFX_TOKEN_TYPES.erc721}&reverse=true&orderBy=transferCount&fields=transferCount,icon,transactionCount&currency=${globalData.currency}`; // @todo wait for new api handler
    title = t(translations.header.tokens721);
  }

  if (
    tokenType === CFX_TOKEN_TYPES.erc1155 ||
    tokenType === CFX_TOKEN_TYPES.crc1155
  ) {
    columnsWidth = [0.5, 1.5, 5, 3, 1, 1, 2, 3];
    columns = [
      utils.number,
      {
        ...utils.number,
        render(value, row, index) {
          return row.hex40id;
        },
      },
      tokenColunms.token,
      tokenColunms.contract(),
      {
        ...tokenColunms.transfer,
        sorter: true,
      },
      {
        ...utils.number,
        // title: 'totalSupply',
        title: <span>N</span>,
        render(v, row, i) {
          return row.totalSupply;
        },
      },
      {
        ...tokenColunms.holders,
        sorter: true,
      },
      {
        ...tokenColunms.projectInfo,
        sorter: true,
        defaultSortOrder: 'descend',
      },
    ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

    url = `/stat/tokens/list?transferType=${
      CFX_TOKEN_TYPES.erc1155
    }&reverse=true&orderBy=securityCredits&${queryString.stringify({
      fields: ['transferCount', 'iconUrl', 'transactionCount'],
    })}`;
    // url = `/stat/tokens/list?transferType=${CFX_TOKEN_TYPES.erc1155}&reverse=true&orderBy=transferCount&fields=transferCount,icon,transactionCount&currency=${globalData.currency}`; // @todo wait for new api handler
    title = t(translations.header.tokens1155);
  }

  if (orderBy) {
    columns = columns.map(c => {
      // @ts-ignore
      if (c.dataIndex === orderBy) {
        // @ts-ignore
        c.defaultSortOrder = 'descend';
      } else {
        // @ts-ignore
        delete c.defaultSortOrder;
      }
      return c;
    });
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={t(title)} />
      </Helmet>
      <PageHeader>
        {title}
        <Tooltip
          hoverable
          text={t(translations.tokens.crcTip, {
            crc: tokenType.replace('CRC', 'CRC-'),
            erc: tokenType.replace('CRC', 'ERC-'),
          })}
          placement="top"
        >
          <IconWrapper>
            <img src={imgInfo} alt="?" />
          </IconWrapper>
        </Tooltip>
      </PageHeader>

      <TableWrapper>
        <TablePanelNew
          url={url}
          columns={columns}
          rowKey="address"
          pagination={{ pageSize: 100 }}
          key={tokenType}
        ></TablePanelNew>
      </TableWrapper>
    </>
  );
}

const IconWrapper = styled.div`
  padding-left: 0.2857rem;
  width: 1.2857rem;
  cursor: pointer;
`;

const TableWrapper = styled.div`
  .token-list {
    table {
      tbody td:nth-child(2) img {
        width: 20px;
        height: 20px;
        margin-right: 7px;
      }
    }
  }
`;
