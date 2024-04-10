import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { blockColunms, colunms } from 'utils/tableColumns/pos';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { useAge } from 'sirius-next/packages/common/dist/utils/hooks/useAge';

export const List = () => {
  const [ageFormat, toggleAgeFormat] = useAge();
  const { t } = useTranslation();

  const url = '/stat/list-pos-block?orderBy=height&reverse=true';
  const columnsWidth = [4, 4, 4, 4, 5];
  const columns = [
    blockColunms.blockHeight,
    {
      ...colunms.posBlockHash,
      key: 'hash',
      dataIndex: 'hash',
    },
    blockColunms.txn,
    {
      ...colunms.posAddress,
      key: 'miner.hex',
      dataIndex: ['miner', 'hex'],
      title: t(translations.pos.blocks.poSMinerAddress),
    },
    {
      ...colunms.age(ageFormat, toggleAgeFormat),
      // sorter: true,
    },
  ].map((item, i) => ({
    ...item,
    width: columnsWidth[i],
  }));

  return <TablePanelNew url={url} columns={columns}></TablePanelNew>;
};

export function Blocks() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{'PoS ' + t(translations.pos.blocks.title)}</title>
        <meta
          name="description"
          content={'PoS ' + t(translations.pos.blocks.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.pos.blocks.title)}</PageHeader>
      <List />
    </>
  );
}
