import React from 'react';
import { useParams } from 'react-router-dom';
import {
  TablePanel as TablePanelNew,
  sortDirections,
} from 'app/components/TablePanelNew';
import { useAge } from '@cfxjs/sirius-next-common/dist/utils/hooks/useAge';
import { accountColunms, colunms } from 'utils/tableColumns/pos';

export function IncomingHistory() {
  const { address } = useParams<{
    address: string;
  }>();
  const [ageFormat, toggleAgeFormat] = useAge();
  const url = `/stat/list-pos-account-reward?identifier=${address}&orderBy=createdAt&reverse=true`;
  const columnsWidth = [3, 3, 5];

  const columns = [
    colunms.powBlockHash,
    accountColunms.incoming,
    {
      ...colunms.age(ageFormat, toggleAgeFormat),
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
    <TablePanelNew url={url} columns={columns} rowKey="id"></TablePanelNew>
  );
}
