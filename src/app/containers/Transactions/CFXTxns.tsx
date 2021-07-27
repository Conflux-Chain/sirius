import React from 'react';
import {
  tokenColunms,
  transactionColunms,
  blockColunms,
} from 'utils/tableColumns';
import { useAge } from 'utils/hooks/useAge';
import { TablePanel } from 'app/components/TablePanelNew';
import { Title, Footer } from './Common';
import { cfxTokenTypes } from 'utils/constants';

interface Props {
  address: string;
}

export const CFXTxns = ({ address }: Props) => {
  const [ageFormat, toggleAgeFormat] = useAge();
  const url = `/transfer?accountAddress=${address}&transferType=${cfxTokenTypes.cfx}`;

  const columnsWidth = [4, 4, 8, 7, 4, 5];
  const columns = [
    tokenColunms.txnHash,
    blockColunms.epoch,
    tokenColunms.from,
    tokenColunms.to,
    transactionColunms.value,
    tokenColunms.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  const title = ({ total, listLimit }) => (
    <Title
      address={address}
      total={total}
      listLimit={listLimit}
      showDatepicker={true}
      showFilter={true}
      filterOptions={['txTypeAll', 'txTypeOutgoing', 'txTypeIncoming']}
      showSearchInput={true}
      searchInputOptions={{
        type: 'cfxTxn',
        addressType: 'user',
        inputFields: ['txnHash', 'address'],
      }}
    />
  );

  const footer = <Footer pathname="transfer" type={cfxTokenTypes.cfx} />;

  return (
    <TablePanel
      url={url}
      columns={columns}
      footer={footer}
      title={title}
      rowKey={row => `${row.transactionHash}${row.transactionTraceIndex}`}
    ></TablePanel>
  );
};
