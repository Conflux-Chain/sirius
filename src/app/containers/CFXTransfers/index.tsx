import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { ColumnsType, useTableData } from '../../components/TabsTablePanel';
import { TablePanel } from '../../components/TablePanel';
import {
  blockColunms,
  tokenColunms,
  transactionColunms,
} from '../../../utils/tableColumns';
import { toThousands } from '../../../utils';
import styled from 'styled-components/macro';
import { PageHeader } from '../../components/PageHeader/Loadable';
import { useAge } from '../../../utils/hooks/useAge';

export function CFXTransfers() {
  const { t } = useTranslation();
  const url = '/transfer?transferType=CFX';
  const [ageFormat, toggleAgeFormat] = useAge();

  const columnsCFXTransferWidth = [4, 4, 8, 7, 4, 5];
  const columnsCFXTrasfer: ColumnsType = [
    tokenColunms.txnHash,
    blockColunms.epoch,
    tokenColunms.from,
    tokenColunms.to,
    transactionColunms.value,
    tokenColunms.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsCFXTransferWidth[i] }));

  const { total } = useTableData(url);
  const tip = (
    <StyledTipLabelWrapper>
      {t(translations.cfxTransfers.tipCountBefore)}
      <StyledSpan>{toThousands(total)}</StyledSpan>
      {t(translations.cfxTransfers.tipCountAfter)}
    </StyledTipLabelWrapper>
  );

  return (
    <>
      <Helmet>
        <title>{t(translations.cfxTransfers.title)}</title>
        <meta
          name="description"
          content={t(translations.cfxTransfers.description)}
        />
      </Helmet>
      <PageHeader subtitle={t(translations.cfxTransfers.description)}>
        {t(translations.cfxTransfers.title)}
      </PageHeader>
      <TablePanel
        url={url}
        table={{
          columns: columnsCFXTrasfer,
          rowKey: () => Math.random().toString(32).substr(2),
        }}
        tableHeader={tip}
      ></TablePanel>
    </>
  );
}

const StyledTipLabelWrapper = styled.div`
  font-size: 1rem;
  font-weight: 400;
  color: #74798c;
  margin: 0.5rem 0;
`;

const StyledSpan = styled.span`
  color: #1e3de4;
  padding: 0 0.4286rem;
`;
