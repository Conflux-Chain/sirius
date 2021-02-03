import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { TablePanel } from '../../components/TablePanel/Loadable';
import { ColumnsType } from '../../components/TabsTablePanel';
import { TipLabel } from '../../components/TabsTablePanel/Loadable';
import { PageHeader } from '../../components/PageHeader/Loadable';
import { useTableData } from './../../components/TabsTablePanel/useTableData';
import { accountColunms } from '../../../utils/tableColumns';
import styled from 'styled-components/macro';

export function Accounts() {
  const { t } = useTranslation();

  let columnsWidth = [1, 7, 3, 3, 3, 3, 2, 5];
  let columns: ColumnsType = [
    accountColunms.rank,
    accountColunms.address,
    accountColunms.balance,
    accountColunms.percentage,
    accountColunms.count,
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  let title = t(translations.header.accounts);

  const url = '/stat/top-cfx-holder?type=TOP_CFX_HOLD';
  const { data, total } = useTableData(url);

  console.log(111, data);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={t(title)} />
      </Helmet>
      <StyledTokensPageHeaderWrapper>
        <PageHeader>{title}</PageHeader>
      </StyledTokensPageHeaderWrapper>
      <TipLabel total={null} left={t(translations.accounts.tip)} />
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
