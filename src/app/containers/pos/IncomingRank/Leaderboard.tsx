import React from 'react';
import { colunms, incomingRankColunms } from 'utils/tableColumns/pos';
import { utils } from 'utils/tableColumns';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';

const sortConfig = {
  sortDirections: ['descend', 'ascend', 'descend'] as Array<
    'descend' | 'ascend'
  >,
};

export const Leaderboard = () => {
  const url = '/stat/pos-reward-rank?rankField=all';

  const columnsWidth = [0.5, 1, 1, 1, 1, 1, 1];
  const columns = [
    utils.number,
    {
      ...colunms.posAddress,
      dataIndex: ['accountInfo', 'hex'],
    },
    {
      ...incomingRankColunms.day(1),
      sorter: true,
      ...sortConfig,
    },
    {
      ...incomingRankColunms.day(7),
      sorter: true,
      ...sortConfig,
    },
    {
      ...incomingRankColunms.day(14),
      sorter: true,
      ...sortConfig,
    },
    {
      ...incomingRankColunms.day(30),
      sorter: true,
      ...sortConfig,
    },
    {
      ...incomingRankColunms.day('all'),
      sorter: true,
      ...sortConfig,
    },
  ].map((item, i) => ({
    ...item,
    width: columnsWidth[i],
  }));

  return (
    <TablePanelNew url={url} columns={columns} hideDefaultTitle></TablePanelNew>
  );
};
