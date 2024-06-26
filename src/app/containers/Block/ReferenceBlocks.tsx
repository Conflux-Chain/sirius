import React from 'react';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { blockColunms } from 'utils/tableColumns';
import { useAge } from '@cfxjs/sirius-next-common/dist/utils/hooks/useAge';

interface Props {
  url: string;
}

export const ReferenceBlocks = ({ url }: Props) => {
  const [ageFormat, toggleAgeFormat] = useAge();

  const columnsWidth = [4, 2, 2, 4, 6, 3, 5, 3, 3, 3, 5];
  const columns = [
    blockColunms.epoch,
    blockColunms.position,
    blockColunms.txns,
    blockColunms.hashWithPivot,
    blockColunms.miner,
    blockColunms.difficulty,
    blockColunms.gasUsedPercentWithProgress,
    blockColunms.gasLimit,
    blockColunms.burntFee,
    blockColunms.reward,
    blockColunms.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  return (
    <TablePanelNew url={url} columns={columns} rowKey="hash"></TablePanelNew>
  );
};
