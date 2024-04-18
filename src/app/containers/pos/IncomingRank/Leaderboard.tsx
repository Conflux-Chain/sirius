import React from 'react';
import { colunms, incomingRankColunms } from 'utils/tableColumns/pos';
import { utils } from 'utils/tableColumns';
import {
  TablePanel as TablePanelNew,
  sortDirections,
} from 'app/components/TablePanelNew';

export const Leaderboard = () => {
  const url = '/stat/pos-reward-rank?reverse=true&orderBy=all';

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
      sortDirections,
    },
    {
      ...incomingRankColunms.day(7),
      sorter: true,
      sortDirections,
    },
    {
      ...incomingRankColunms.day(14),
      sorter: true,
      sortDirections,
    },
    {
      ...incomingRankColunms.day(30),
      sorter: true,
      sortDirections,
    },
    {
      ...incomingRankColunms.day('all'),
      defaultSortOrder: sortDirections[0],
      sorter: true,
      sortDirections,
    },
  ].map((item, i) => ({
    ...item,
    width: columnsWidth[i],
  }));

  return (
    <TablePanelNew url={url} columns={columns} hideDefaultTitle></TablePanelNew>
  );
};
