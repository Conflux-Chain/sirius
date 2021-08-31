import React from 'react';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { tokenColunms } from 'utils/tableColumns';
import { useAge } from 'utils/hooks/useAge';
import { cfxTokenTypes } from 'utils/constants';
import { DownloadCSV } from 'app/components/DownloadCSV/Loadable';
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
    tokenColunms.txnHash,
    tokenColunms.from,
    tokenColunms.to,
    {
      ...tokenColunms.quantity,
      render: (value, row, index) =>
        tokenColunms.quantity.render(value, row, index, {
          decimals,
        }),
    },
    tokenColunms.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  if (type === cfxTokenTypes.erc721) {
    columnsWidth = [3, 6, 6, 4, 3];
    columns = [
      tokenColunms.txnHash,
      tokenColunms.from,
      tokenColunms.to,
      tokenColunms.tokenId(),
      tokenColunms.age(ageFormat, toggleAgeFormat),
    ].map((item, i) => ({ ...item, width: columnsWidth[i] }));
  }
  if (type === cfxTokenTypes.erc1155) {
    columnsWidth = [3, 7, 7, 3, 4, 4];
    columns = [
      tokenColunms.txnHash,
      tokenColunms.from,
      tokenColunms.to,
      tokenColunms.quantity,
      tokenColunms.tokenId(address),
      tokenColunms.age(ageFormat, toggleAgeFormat),
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

    if (type !== cfxTokenTypes.erc20) {
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
        rowKey={(row, index) => `${row.transactionHash}${index}`}
        title={title}
        footer={() => tableFooter}
      ></TablePanelNew>
    </>
  );
};
