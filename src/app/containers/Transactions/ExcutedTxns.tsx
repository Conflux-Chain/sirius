import React from 'react';
import { tokenColunms, transactionColunms } from 'utils/tableColumns';
import { useAge } from 'utils/hooks/useAge';
import { TablePanel } from 'app/components/TablePanelNew';
import { Title, Footer, TxnSwitcher } from './Common';
import styled from 'styled-components/macro';
import { isAccountAddress } from 'utils';

interface Props {
  address: string;
}

export const ExcutedTxns = ({ address }: Props) => {
  const [ageFormat, toggleAgeFormat] = useAge();

  const url = `/transaction?accountAddress=${address}`;

  const columnsWidth = [4, 3, 7, 6, 2, 3, 3, 3, 5];
  const columns = [
    transactionColunms.hash,
    transactionColunms.method,
    {
      ...tokenColunms.from,
      render(text, record, index) {
        return tokenColunms.from.render(text, record, index, false);
      },
    },
    tokenColunms.to,
    tokenColunms.fromType,
    transactionColunms.value,
    transactionColunms.gasPrice,
    transactionColunms.gasFee,
    transactionColunms.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  const title = ({ total, listLimit }) => (
    <StyledTitleWrapper>
      <TxnSwitcher
        total={total}
        isAccount={isAccountAddress(address)}
      ></TxnSwitcher>
      <Title
        address={address}
        showTotalTip={false}
        total={total}
        listLimit={listLimit}
        showDatepicker={true}
        showFilter={true}
        filterOptions={[
          'txTypeAll',
          'txTypeOutgoing',
          'txTypeIncoming',
          'status1',
          'txTypeCreate',
        ]}
        showSearchInput={true}
        searchInputOptions={{
          type: 'txn',
          addressType: 'user',
          inputFields: ['txnHash', 'address'],
        }}
      />
    </StyledTitleWrapper>
  );

  const footer = <Footer pathname="transaction" />;

  return (
    <TablePanel
      url={url}
      columns={columns}
      rowKey="hash"
      footer={footer}
      title={title}
    ></TablePanel>
  );
};

const StyledTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;
