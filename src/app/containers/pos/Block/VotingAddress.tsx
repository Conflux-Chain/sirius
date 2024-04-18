import React from 'react';
import {
  TablePanel as TablePanelNew,
  sortDirections,
} from 'app/components/TablePanelNew';
import { colunms, committeeColunms } from 'utils/tableColumns/pos';

export function VotingAddress({ data, loading }) {
  const columnsWidth = [4, 4, 4];
  const columns = [
    {
      ...colunms.posAddress,
      key: 'account',
      dataIndex: 'account',
    },
    {
      ...committeeColunms.votes,
      defaultSortOrder: sortDirections[0],
      sortDirections,
      showSorterTooltip: false,
      sorter: (a, b) => a.votes - b.votes,
    },
  ].map((item, i) => ({
    ...item,
    width: columnsWidth[i],
  }));

  return (
    <TablePanelNew
      columns={columns}
      dataSource={data}
      loading={loading}
    ></TablePanelNew>
  );
}
