import React from 'react';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { tokenColunms, utils } from 'utils/tableColumns';

interface Props {
  address: string;
  type: string;
  id: string;
  loading: boolean;
}

export const Holders = ({ address, type, id, loading }: Props) => {
  const url = `/stat/nft/list1155inventory?contractAddr=${address}&tokenId=${id}`;

  let columnsWidth = [2, 10, 10];
  let columns = [
    utils.number,
    tokenColunms.NFTOwner,
    tokenColunms.NFTQuantity,
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  return (
    <TablePanelNew
      url={url}
      columns={columns}
      loading={loading}
      rowKey="owner"
    ></TablePanelNew>
  );
};
