import React from 'react';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { transactionColunms } from 'utils/tableColumns/pos';
import lodash from 'lodash';

export function Transactions({ height, loading }) {
  const columnsWidth = [4, 4, 4];
  const columns = [
    transactionColunms.txHash,
    transactionColunms.status,
    transactionColunms.type,
  ].map((item, i) => ({
    ...item,
    width: columnsWidth[i],
  }));

  if (lodash.isNil(height)) {
    return (
      <TablePanelNew
        columns={columns}
        dataSource={[]}
        loading={loading}
      ></TablePanelNew>
    );
  } else {
    const url = `/stat/list-tx-by-pos-height?height=${height}`;
    return <TablePanelNew url={url} columns={columns}></TablePanelNew>;
  }
}
