import React from 'react';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { blockColunms } from 'utils/tableColumns';
import { useAge } from 'utils/hooks/useAge';

interface Props {
  url: string;
}

export const Blocks = ({ url }: Props) => {
  const [ageFormat, toggleAgeFormat] = useAge();

  const columnsWidth = [4, 2, 2, 2, 3, 5, 3, 5, 5];
  const columns = [
    blockColunms.epoch,
    blockColunms.position,
    blockColunms.txns,
    blockColunms.executedTransactionCount,
    blockColunms.hashWithPivot,
    blockColunms.miner,
    blockColunms.avgGasPrice,
    blockColunms.gasUsedPercentWithProgress,
    blockColunms.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  return (
    <TablePanelNew
      url={url}
      columns={columns}
      rowKey="hash"
      pagination={false}
      hideDefaultTitle={true}
    ></TablePanelNew>
  );
};
