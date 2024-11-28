import React from 'react';
import { useParams } from 'react-router-dom';
import {
  TablePanel as TablePanelNew,
  sortDirections,
} from 'app/components/TablePanelNew';
import { useAge } from '@cfxjs/sirius-next-common/dist/utils/hooks/useAge';
import { accountColunms, colunms, blockColunms } from 'utils/tableColumns/pos';

const sortKeyMap = {
  [String(['block', 'createdAt'])]: 'createdAt',
};

export function VotingHistory() {
  const { address } = useParams<{
    address: string;
  }>();
  const [ageFormat, toggleAgeFormat] = useAge();
  const url = `/stat/list-account-vote-history?identifier=${address}&orderBy=createdAt&reverse=true`;
  const columnsWidth = [4, 3, 3, 5];

  const columns = [
    {
      ...blockColunms.blockHeight,
      key: 'block.height',
      dataIndex: ['block', 'height'],
    },
    {
      ...colunms.posBlockHash,
      key: 'block.hash',
      dataIndex: ['block', 'hash'],
    },
    accountColunms.votes,
    {
      // @ts-ignore
      ...colunms.age(ageFormat, toggleAgeFormat, ['block', 'createdAt']),
      sorter: true,
      defaultSortOrder: sortDirections[0],
      sortDirections,
      showSorterTooltip: false,
    },
  ].map((item, i) => ({
    ...item,
    width: columnsWidth[i],
  }));

  return (
    <TablePanelNew
      url={url}
      columns={columns}
      sortKeyMap={sortKeyMap}
      rowKey="blockNumber"
    ></TablePanelNew>
  );
}
