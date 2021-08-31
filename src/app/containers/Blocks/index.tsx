import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from 'styles/media';
import { translations } from '../../../locales/i18n';
import { blockColunms } from '../../../utils/tableColumns';
import { Dag } from './Loadable';
import { PageHeader } from '../../components/PageHeader/Loadable';
import { useAge } from '../../../utils/hooks/useAge';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';

export function Blocks() {
  const { t } = useTranslation();
  const bp = useBreakpoint();
  const url = '/block';
  const [ageFormat, toggleAgeFormat] = useAge();

  const columnsBlocksWidth = [4, 2, 2, 5, 5, 4, 5, 3, 5];
  const columnsBlocks = [
    blockColunms.epoch,
    blockColunms.position,
    blockColunms.txns,
    blockColunms.hashWithPivot,
    blockColunms.miner,
    blockColunms.avgGasPrice,
    blockColunms.gasUsedPercentWithProgress,
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
      {bp !== 's' && <Dag />}
      <PageHeader>{t(translations.blocks.title)}</PageHeader>

      <TablePanelNew
        url={url}
        columns={columnsBlocks}
        rowKey="hash"
      ></TablePanelNew>
    </>
  );
}
