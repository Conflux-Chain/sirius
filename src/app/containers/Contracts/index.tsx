import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { TablePanel } from '../../components/TablePanel/Loadable';
import { ColumnsType } from '../../components/TabsTablePanel';
import { TipLabel } from '../../components/TabsTablePanel/Loadable';
import { PageHeader } from '../../components/PageHeader/Loadable';
import { useTableData } from './../../components/TabsTablePanel/useTableData';
import { contractColunms } from '../../../utils/tableColumns';
import styled from 'styled-components/macro';

export function Contracts() {
  const { t } = useTranslation();

  const columnsWidth = [2, 6, 3, 4, 3, 3];
  const columns: ColumnsType = [
    contractColunms.number,
    contractColunms.name,
    contractColunms.contract,
    contractColunms.transactionCount,
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  const url = `/contract/internals`;
  const { total } = useTableData(url);

  return (
    <>
      <Helmet>
        <title>{t(translations.contracts.title)}</title>
        <meta
          name="description"
          content={t(translations.contracts.description)}
        />
      </Helmet>
      <StyledTokensPageHeaderWrapper>
        <PageHeader>{t(translations.contracts.title)}</PageHeader>
      </StyledTokensPageHeaderWrapper>
      <TipLabel
        total={total}
        left={t(translations.contracts.tipCountBefore)}
        right={t(translations.contracts.tipCountAfter)}
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
