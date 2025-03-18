import React from 'react';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { tokenColumns } from 'utils/tableColumns';
import { useAge } from '@cfxjs/sirius-next-common/dist/utils/hooks/useAge';
import { CFX_TOKEN_TYPES } from 'utils/constants';
import { DownloadCSV } from '@cfxjs/sirius-next-common/dist/components/DownloadCSV';
import qs from 'query-string';
import { Title } from 'app/containers/Transactions/components';
import { AdvancedSearchFormProps } from 'app/containers/Transactions/components/AdvancedSearchForm';
import { useLocation } from 'react-router-dom';

interface Props {
  type: string;
  address: string;
  decimals: number;
}

interface Query {
  accountAddress?: string;
  transactionHash?: string;
  tokenId?: string;
}

export const Transfers = ({ type, address, decimals }: Props) => {
  const location = useLocation();
  const url = `/transfer?address=${address}&transferType=${type}`;

  const [ageFormat, toggleAgeFormat] = useAge();

  let columnsWidth = [3, 6, 6, 4, 4];
  let columns = [
    tokenColumns.txnHash,
    tokenColumns.from,
    tokenColumns.to,
    {
      ...tokenColumns.quantity,
      render: (value, row, index) =>
        tokenColumns.quantity.render(value, row, index, {
          decimals,
        }),
    },
    tokenColumns.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  if (type === CFX_TOKEN_TYPES.erc721) {
    columnsWidth = [4, 6, 6, 4, 4, 3];
    columns = [
      tokenColumns.txnHash,
      tokenColumns.from,
      tokenColumns.to,
      tokenColumns.tokenId(),
      tokenColumns.age(ageFormat, toggleAgeFormat),
      tokenColumns.details,
    ].map((item, i) => ({ ...item, width: columnsWidth[i] }));
  }
  if (type === CFX_TOKEN_TYPES.erc1155) {
    columnsWidth = [3, 7, 7, 3, 4, 4, 3];
    columns = [
      tokenColumns.txnHash,
      tokenColumns.from,
      tokenColumns.to,
      tokenColumns.quantity,
      tokenColumns.tokenId(address),
      tokenColumns.age(ageFormat, toggleAgeFormat),
      tokenColumns.details,
    ].map((item, i) => ({ ...item, width: columnsWidth[i] }));
  }

  const title = ({ total, listLimit }) => {
    let searchOptions: AdvancedSearchFormProps = {
      transactionHash: true,
      fromOrTo: true,
      epoch: true,
      rangePicker: true,
      button: {
        col: {
          xs: 24,
          sm: 18,
          md: 18,
          lg: 18,
          xl: 18,
        },
      },
    };

    if (type !== CFX_TOKEN_TYPES.erc20) {
      searchOptions.tokenId = true;
      searchOptions.button = {
        col: {
          xs: 24,
          sm: 14,
          md: 14,
          lg: 14,
          xl: 14,
        },
      };
    }

    return (
      <Title
        address={address}
        total={total}
        listLimit={listLimit}
        showSearch={true}
        searchOptions={searchOptions}
      />
    );
  };

  const { tab, ...query } = qs.parse(location.search || '');

  const tableFooter = (
    <DownloadCSV
      url={qs.stringifyUrl({
        url: '/v1/report/transfer',
        query: {
          ...query,
          transferType: type,
          address,
          limit: '5000',
          reverse: 'true',
        },
      })}
    />
  );

  return (
    <>
      <TablePanelNew
        url={url}
        columns={columns}
        title={title}
        footer={() => tableFooter}
        rowKey={record =>
          `${record.transactionHash}-${record.transactionLogIndex}`
        }
      ></TablePanelNew>
    </>
  );
};
