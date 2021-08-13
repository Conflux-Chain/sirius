import React from 'react';
import { tokenColunms } from 'utils/tableColumns';
import { useAge } from 'utils/hooks/useAge';
import { TablePanel } from 'app/components/TablePanelNew';
import { Title, Footer } from './Common';
import { cfxTokenTypes } from 'utils/constants';
import { isContractAddress } from 'utils';

interface Props {
  address: string;
}

export const CRC721Txns = ({ address }: Props) => {
  const [ageFormat, toggleAgeFormat] = useAge();
  const addressType = isContractAddress(address) ? 'contract' : 'user';
  const url = `/transfer?accountAddress=${address}&transferType=${cfxTokenTypes.erc721}`;

  const columnsWidth = [3, 7, 2, 6, 4, 6, 4];
  const columns = [
    tokenColunms.txnHash,
    {
      ...tokenColunms.from,
      render(text, record, index) {
        return tokenColunms.from.render(text, record, index, false);
      },
    },
    tokenColunms.fromType,
    tokenColunms.to,
    tokenColunms.tokenId(),
    tokenColunms.token2,
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
        type: 'crc721',
        addressType,
        inputFields: ['txnHash', 'address', 'tokenID'],
      }}
    />
  );

  const footer = <Footer pathname="transfer" type={cfxTokenTypes.erc721} />;

  return (
    <TablePanel
      url={url}
      columns={columns}
      footer={footer}
      title={title}
    ></TablePanel>
  );
};
