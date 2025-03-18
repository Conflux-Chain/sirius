import React from 'react';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { blockColumns } from 'utils/tableColumns';
import { useAge } from '@cfxjs/sirius-next-common/dist/utils/hooks/useAge';

interface Props {
  url: string;
}

export const ReferenceBlocks = ({ url }: Props) => {
  const [ageFormat, toggleAgeFormat] = useAge();

  const columnsWidth = [4, 2, 2, 4, 6, 3, 5, 3, 3, 3, 5];
  const columns = [
    blockColumns.epoch,
    blockColumns.position,
    blockColumns.txns,
    blockColumns.hashWithPivot,
    blockColumns.miner,
    blockColumns.difficulty,
    blockColumns.gasUsedPercentWithProgress,
    blockColumns.gasLimit,
    blockColumns.burntFees,
    blockColumns.reward,
    blockColumns.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  return (
    <TablePanelNew url={url} columns={columns} rowKey="hash"></TablePanelNew>
  );
};
