import React from 'react';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { tokenColunms, utils } from 'utils/tableColumns';
import { cfxTokenTypes } from 'utils/constants';

interface Props {
  address: string;
  type: string;
  decimals: number;
  price: number;
  totalSupply: number;
}

export const Holders = ({
  address,
  type,
  decimals,
  price,
  totalSupply,
}: Props) => {
  const url = `/stat/tokens/holder-rank?address=${address}&reverse=true&orderBy=balance`;

  let holdersColumnsWidth = [2, 10, 6, 4];
  let holdersColumns = [
    utils.number,
    tokenColunms.account,
    tokenColunms.balance(
      type === cfxTokenTypes.erc20 ? decimals : 0,
      price,
      type,
    ),
    tokenColunms.percentage(totalSupply),
  ].map((item, i) => ({ ...item, width: holdersColumnsWidth[i] }));

  let holders1155ColumnsWidth = [2, 10, 10];
  let holders1155Columns = [
    utils.number,
    tokenColunms.account,
    tokenColunms.balance(0, price, type),
  ].map((item, i) => ({ ...item, width: holders1155ColumnsWidth[i] }));

  const columns =
    type === cfxTokenTypes.erc1155 ? holders1155Columns : holdersColumns;

  return (
    <TablePanelNew
      url={url}
      columns={columns}
      rowKey="hash"
      // pagination={false}
    ></TablePanelNew>
  );
};
