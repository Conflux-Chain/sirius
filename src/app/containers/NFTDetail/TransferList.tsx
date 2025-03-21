import React from 'react';

import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { tokenColumns, blockColumns } from 'utils/tableColumns';
import { useAge } from '@cfxjs/sirius-next-common/dist/utils/hooks/useAge';
import { CFX_TOKEN_TYPES } from 'utils/constants';

export const TransferList = ({ type, address, id, loading }) => {
  let url = `/transfer?address=${address}&transferType=${type}&tokenId=${id}`;
  const [ageFormat, toggleAgeFormat] = useAge();

  let columnsWidth: any = [];
  let columns: any = [];

  if (type === CFX_TOKEN_TYPES.erc721) {
    columnsWidth = [4, 6, 6, 4, 3];
    columns = [
      tokenColumns.txnHash,
      tokenColumns.from,
      tokenColumns.to,
      tokenColumns.age(ageFormat, toggleAgeFormat),
      blockColumns.epoch,
    ].map((item, i) => ({ ...item, width: columnsWidth[i] }));
  } else if (type === CFX_TOKEN_TYPES.erc1155) {
    columnsWidth = [3, 7, 7, 3, 4, 4];
    columns = [
      tokenColumns.txnHash,
      tokenColumns.from,
      tokenColumns.to,
      tokenColumns.quantity,
      tokenColumns.age(ageFormat, toggleAgeFormat),
      blockColumns.epoch,
    ].map((item, i) => ({ ...item, width: columnsWidth[i] }));
  }
  return (
    <TablePanelNew
      url={!!type ? url : ''}
      columns={columns}
      loading={loading}
      rowKey={record =>
        `${record.transactionHash}-${record.transactionLogIndex}`
      }
    ></TablePanelNew>
  );
};
