import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from 'sirius-next/packages/common/dist/utils/media';
import { translations } from 'locales/i18n';
import { blockColunms } from '../../../utils/tableColumns';
import { Dag } from './Loadable';
import { PageHeader } from 'sirius-next/packages/common/dist/components/PageHeader';
import { useAge } from 'sirius-next/packages/common/dist/utils/hooks/useAge';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';

export function Blocks() {
  const { t } = useTranslation();
  const bp = useBreakpoint();
  const url = '/block';
  const [ageFormat, toggleAgeFormat] = useAge();

  const columnsBlocksWidth = [4, 2, 2, 5, 5, 4, 5, 3, 3, 5];
  const columnsBlocks = [
    blockColunms.epoch,
    blockColunms.position,
    blockColunms.txns,
    blockColunms.hashWithPivot,
    blockColunms.miner,
    blockColunms.avgGasPrice,
    blockColunms.gasUsedPercentWithProgress,
    blockColunms.gasLimit,
    blockColunms.reward,
    blockColunms.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({
    ...item,
    width: columnsBlocksWidth[i],
  }));

  return (
    <>
      <Helmet>
        <title>{t(translations.blocks.title)}</title>
        <meta name="description" content={t(translations.blocks.description)} />
      </Helmet>
      <PageHeader>{t(translations.blocks.title)}</PageHeader>
      {bp !== 's' && <Dag />}
      <TablePanelNew
        url={url}
        columns={columnsBlocks}
        rowKey="hash"
      ></TablePanelNew>
    </>
  );
}
