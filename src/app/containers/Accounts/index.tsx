import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { TablePanel } from '../../components/TablePanel/Loadable';
import { ColumnsType } from '../../components/TabsTablePanel';
import { TipLabel } from '../../components/TabsTablePanel/Loadable';
import { PageHeader } from '../../components/PageHeader/Loadable';
import { accountColunms } from '../../../utils/tableColumns';
import styled from 'styled-components/macro';

export function Accounts() {
  const { t } = useTranslation();

  let columnsWidth = [1, 7, 3, 3, 3];
  let columns: ColumnsType = [
    accountColunms.rank,
    accountColunms.address,
    accountColunms.balance,
    accountColunms.percentage,
    accountColunms.count,
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  const title = t(translations.header.accounts);
  const url = '/stat/top-cfx-holder?type=TOP_CFX_HOLD&limit=100';

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={t(title)} />
      </Helmet>
      <StyledPageWrapper>
        <PageHeader>{title}</PageHeader>
        <TipLabel total={null} left={t(translations.accounts.tip)} />
        <TablePanel
          table={{
            columns: columns,
            rowKey: 'base32address',
          }}
          pagination={false}
          url={url}
        />
      </StyledPageWrapper>
    </>
  );
}

const StyledPageWrapper = styled.div`
  padding: 2.2857rem 0;
`;
