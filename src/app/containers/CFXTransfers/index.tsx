import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import {
  blockColumns,
  tokenColumns,
  transactionColumns,
} from 'utils/tableColumns';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import { useAge } from '@cfxjs/sirius-next-common/dist/utils/hooks/useAge';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';

export function CFXTransfers() {
  const { t } = useTranslation();
  const url = '/transfer?transferType=CFX';
  const [ageFormat, toggleAgeFormat] = useAge();

  const columnsCFXTransferWidth = [4, 4, 8, 7, 4, 5];
  const columnsCFXTransfer = [
    tokenColumns.txnHash,
    blockColumns.epoch,
    tokenColumns.from,
    tokenColumns.to,
    transactionColumns.value,
    tokenColumns.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsCFXTransferWidth[i] }));

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

      <TablePanelNew
        url={url}
        columns={columnsCFXTransfer}
        rowKey={record =>
          `${record.transactionHash}-${record.transactionLogIndex}`
        }
      ></TablePanelNew>
    </>
  );
}
