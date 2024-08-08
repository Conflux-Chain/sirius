import React from 'react';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { transactionColunms } from 'utils/tableColumns';
import { useAge } from '@cfxjs/sirius-next-common/dist/utils/hooks/useAge';
import lodash from 'lodash';

const TxnHashRenderComponent = transactionColunms.TxnHashRenderComponent;

interface Props {
  url: string;
}

export const Txns = ({ url }: Props) => {
  const [ageFormat, toggleAgeFormat] = useAge();

  const columnsWidth = [4, 6, 6, 4, 3, 4, 5];
  const columns = [
    {
      ...transactionColunms.hash,
      render: (_, row) => {
        return (
          <TxnHashRenderComponent
            hash={row.hash}
            status={lodash.isNil(row.status) ? '2' : row.status}
            txExecErrorMsg={row.txExecErrorMsg || row?.reason?.pending}
            txExecErrorInfo={row.txExecErrorInfo}
          ></TxnHashRenderComponent>
        );
      },
    },
    transactionColunms.from,
    transactionColunms.to,
    transactionColunms.value,
    transactionColunms.gasFee,
    transactionColunms.gasPrice,
    transactionColunms.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  return (
    <TablePanelNew url={url} columns={columns} rowKey="hash"></TablePanelNew>
  );
};
