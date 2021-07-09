import React from 'react';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { blockColunms } from 'utils/tableColumns';
import { useAge } from 'utils/hooks/useAge';
import { TablePanel } from 'app/components/TablePanel/Loadable';

interface Props {
  url: string;
}

export const ReferenceBlocks = ({ url }: Props) => {
  const [ageFormat, toggleAgeFormat] = useAge();

  const columnsWidth = [4, 2, 2, 4, 6, 3, 5, 5];
  const columns = [
    blockColunms.epoch,
    blockColunms.position,
    blockColunms.txns,
    blockColunms.hash,
    blockColunms.miner,
    blockColunms.difficulty,
    blockColunms.gasUsedPercentWithProgress,
    blockColunms.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  return (
    <>
      <TablePanelNew url={url} columns={columns} rowKey="hash"></TablePanelNew>

      {/* @todo, table-refactor, need to remove */}
      <TablePanel url={url} table={{ columns: columns, rowKey: 'hash' }} />
    </>
  );
};
