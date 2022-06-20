import React from 'react';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { tokenColunms, utils } from 'utils/tableColumns';
import { CFX_TOKEN_TYPES } from 'utils/constants';
import { useAge } from '../../../utils/hooks/useAge';
import { ColumnAge } from '../../../utils/tableColumns/utils';

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
  const [toggleAgeFormat] = useAge();

  let holdersColumnsWidth = [2, 10, 6, 4, 3];
  let holdersColumns = [
    utils.number,
    tokenColunms.account,
    tokenColunms.balance(
      type === CFX_TOKEN_TYPES.erc20 ? decimals : 0,
      price,
      type,
    ),
    tokenColunms.percentage(totalSupply),
    ColumnAge({
      ageFormat: 'datetime',
      toggleAgeFormat,
      dataIndex: 'updatedAt',
      title: 'UpdatedAt',
    }),
  ].map((item, i) => ({ ...item, width: holdersColumnsWidth[i] }));

  let holders1155ColumnsWidth = [2, 10, 10];
  let holders1155Columns = [
    utils.number,
    tokenColunms.account,
    tokenColunms.balance(0, price, type),
  ].map((item, i) => ({ ...item, width: holders1155ColumnsWidth[i] }));

  const columns =
    type === CFX_TOKEN_TYPES.erc1155 ? holders1155Columns : holdersColumns;

  return <TablePanelNew url={url} columns={columns}></TablePanelNew>;
};
