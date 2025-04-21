import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { translations } from 'locales/i18n';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import { tokenColumns, utils } from 'utils/tableColumns';
import styled from 'styled-components';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';
import { CFX_TOKEN_TYPES } from 'utils/constants';
import queryString from 'query-string';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { formatNumber, formatLargeNumber } from 'utils';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
import { monospaceFont } from 'styles/variable';

import imgInfo from 'images/info.svg';

interface RouteParams {
  tokenType: string;
}

export function Tokens() {
  const { t } = useTranslation();
  const { tokenType = CFX_TOKEN_TYPES.erc20 } = useParams<RouteParams>();

  let columnsWidth = [1, 7, 4, 3, 3, 3, 2, 4];
  let columns = [
    {
      ...utils.number,
      render(value, row, index) {
        return utils.number.render(value, row, index, 3);
      },
    },
    tokenColumns.token,
    tokenColumns.contract(),
    {
      ...tokenColumns.price,
      sorter: true,
    },
    {
      ...tokenColumns.marketCap,
      sorter: true,
      render(value, row, index) {
        const largeShrinkNumber = formatLargeNumber(value);
        return (
          <LargeNumber>
            <Text
              hoverValue={formatNumber(value, {
                precision: 2,
                withUnit: false,
              })}
            >
              <span>
                {largeShrinkNumber.value
                  ? '$' +
                    formatNumber(largeShrinkNumber.value, {
                      precision: 2,
                      withUnit: false,
                      unit: '',
                    }) +
                    largeShrinkNumber.unit
                  : '--'}
              </span>
            </Text>
          </LargeNumber>
        );
      },
    },
    {
      ...tokenColumns.transfer,
      sorter: true,
      render(value, row, index) {
        const largeShrinkNumber = formatLargeNumber(value);
        return (
          <LargeNumber>
            <Text
              hoverValue={formatNumber(value, {
                precision: 2,
                withUnit: false,
              })}
            >
              <span>
                {largeShrinkNumber.value
                  ? formatNumber(largeShrinkNumber.value, {
                      precision: 2,
                      withUnit: false,
                      unit: '',
                    }) + largeShrinkNumber.unit
                  : '--'}
              </span>
            </Text>
          </LargeNumber>
        );
      },
    },
    {
      ...tokenColumns.holders,
      sorter: true,
    },
    {
      ...tokenColumns.projectInfo,
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
  let title = t(translations.header.tokens20);

  if (
    tokenType === CFX_TOKEN_TYPES.erc721 ||
    tokenType === CFX_TOKEN_TYPES.crc721
  ) {
    columnsWidth = [1, 7, 5, 3, 3, 4];
    columns = [
      utils.number,
      tokenColumns.token,
      tokenColumns.contract(),
      {
        ...tokenColumns.transfer,
        sorter: true,
      },
      {
        ...tokenColumns.holders,
        sorter: true,
      },
      {
        ...tokenColumns.projectInfo,
        sorter: true,
        defaultSortOrder: 'descend',
      },
    ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

    url = `/stat/tokens/list?transferType=${
      CFX_TOKEN_TYPES.erc721
    }&reverse=true&orderBy=securityCredits&${queryString.stringify({
      fields: ['transferCount', 'iconUrl', 'transactionCount'],
    })}`;
    title = t(translations.header.tokens721);
  }

  if (
    tokenType === CFX_TOKEN_TYPES.erc1155 ||
    tokenType === CFX_TOKEN_TYPES.crc1155
  ) {
    columnsWidth = [1, 5, 4, 2, 2, 3];
    columns = [
      utils.number,
      tokenColumns.token,
      tokenColumns.contract(),
      {
        ...tokenColumns.transfer,
        sorter: true,
      },
      {
        ...tokenColumns.holders,
        sorter: true,
      },
      {
        ...tokenColumns.projectInfo,
        sorter: true,
        defaultSortOrder: 'descend',
      },
    ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

    url = `/stat/tokens/list?transferType=${
      CFX_TOKEN_TYPES.erc1155
    }&reverse=true&orderBy=securityCredits&${queryString.stringify({
      fields: ['transferCount', 'iconUrl', 'transactionCount'],
    })}`;
    title = t(translations.header.tokens1155);
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <PageHeader>
        {title}
        <Tooltip
          title={t(translations.tokens.crcTip, {
            crc: tokenType.replace('CRC', 'CRC-'),
            erc: tokenType.replace('CRC', 'ERC-'),
          })}
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
  display: inline-block;
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

const LargeNumber = styled.div`
  display: flex;
  justify-content: flex-end;
  span {
    font-family: ${monospaceFont};
  }
`;
