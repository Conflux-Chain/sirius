import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { AlertCircle } from '@zeit-ui/react-icons';
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

interface RouteParams {
  tokenType: string;
}

export function Tokens() {
  const { t } = useTranslation();
  const { tokenType } = useParams<RouteParams>();

  let columnsWidth = [1, 6, 3, 3, 3, 3, 2, 3];
  let columns: ColumnsType = [
    tokenColunms.number,
    tokenColunms.token,
    tokenColunms.price,
    tokenColunms.marketCap,
    tokenColunms.transfer,
    tokenColunms.totalSupply,
    tokenColunms.holders,
    tokenColunms.contract,
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  let url = `/token?tokenType=${cfxTokenTypes.erc20}&reverse=true&orderBy=transferCount&fields=transferCount,icon`;

  let title = t(translations.header.tokens20);

  if (
    tokenType === cfxTokenTypes.erc721 ||
    tokenType === cfxTokenTypes.erc1155
  ) {
    columnsWidth = [1, 8, 4, 4, 5];
    columns = [
      tokenColunms.number,
      tokenColunms.token,
      tokenColunms.transfer,
      tokenColunms.holders,
      tokenColunms.contract,
    ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

    if (tokenType === cfxTokenTypes.erc721) {
      url = `/token?tokenType=${cfxTokenTypes.erc721}&reverse=true&orderBy=transferCount&fields=transferCount,icon`;
      title = t(translations.header.tokens721);
    } else {
      url = `/token?tokenType=${cfxTokenTypes.erc1155}&reverse=true&orderBy=transferCount&fields=transferCount,icon`;
      title = t(translations.header.tokens1155);
    }
  }

  const { total } = useTableData(url);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={t(title)} />
      </Helmet>
      <StyledTokensPageHeaderWrapper>
        <PageHeader>
          {title}
          {!tokenType || tokenType === cfxTokenTypes.erc20 ? (
            <Tooltip
              hoverable
              text={
                <div
                  dangerouslySetInnerHTML={{
                    __html: t(translations.tokens.dataSource),
                  }}
                />
              }
              placement="top"
            >
              <IconWrapper>
                <AlertCircle size={16} />
              </IconWrapper>
            </Tooltip>
          ) : null}
        </PageHeader>
      </StyledTokensPageHeaderWrapper>
      <TipLabel
        total={total}
        left={t(translations.tokens.tipCountBefore)}
        right={t(translations.tokens.tipCountAfter)}
      />
      <TablePanel
        table={{
          columns: columns,
          rowKey: 'address',
        }}
        url={url}
      />
    </>
  );
}

const StyledTokensPageHeaderWrapper = styled.div`
  margin-top: 32px;
  > div {
    margin-bottom: 12px;
  }
`;

const IconWrapper = styled.div`
  padding: 0 4px;
`;
