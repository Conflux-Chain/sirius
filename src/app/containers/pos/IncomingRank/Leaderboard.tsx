import React from 'react';
import { colunms, incomingRankColunms } from 'utils/tableColumns/pos';
import { utils } from 'utils/tableColumns';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';

export const Leaderboard = () => {
  const url = '/stat/pos-reward-rank?rankField=all';

  const columnsWidth = [0.5, 1, 1, 1, 1, 1, 1];
  const columns = [
    utils.number,
    {
      ...colunms.posAddress,
      dataIndex: ['accountInfo', 'hex'],
    },
    incomingRankColunms.day(1),
    incomingRankColunms.day(7),
    incomingRankColunms.day(14),
    incomingRankColunms.day(30),
    incomingRankColunms.day('all'),
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
    ></TablePanelNew>
  );
};
