import React from 'react';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { transactionColunms } from 'utils/tableColumns';
import { useAge } from 'utils/hooks/useAge';
import { TablePanel } from 'app/components/TablePanel/Loadable';

interface Props {
  url: string;
}

export const Txns = ({ url }: Props) => {
  const [ageFormat, toggleAgeFormat] = useAge();

  const columnsWidth = [4, 6, 6, 4, 3, 4, 5];
  const columns = [
    transactionColunms.hash,
    transactionColunms.from,
    transactionColunms.to,
    transactionColunms.value,
    transactionColunms.gasPrice,
    transactionColunms.gasFee,
    transactionColunms.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  return (
    <>
      <TablePanelNew
        url={url}
        columns={columns}
        rowKey="hash"
        pagination={false}
      ></TablePanelNew>

      {/* @todo, table-refactor, need to remove */}
      <br></br>
      <TablePanel url={url} table={{ columns: columns, rowKey: 'hash' }} />
    </>
  );
};
