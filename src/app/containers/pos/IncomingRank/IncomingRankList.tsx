import React from 'react';
import { colunms, incomingRankColunms } from 'utils/tableColumns/pos';
import { utils } from 'utils/tableColumns';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';

export const IncomingRankList = () => {
  const url = '/stat/top-pos-account-by-reward';
  const columnsWidth = [0.5, 3, 2];
  const columns = [
    utils.number,
    colunms.posAddress,
    incomingRankColunms.totalIncoming,
  ].map((item, i) => ({
    ...item,
    width: columnsWidth[i],
  }));

  return (
    <TablePanelNew
      url={url}
      columns={columns}
      pagination={false}
      hideDefaultTitle
      rowKey="hex"
    ></TablePanelNew>
  );
};
