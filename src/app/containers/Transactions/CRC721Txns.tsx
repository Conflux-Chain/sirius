import React from 'react';
import { tokenColunms } from 'utils/tableColumns';
import { useAge } from '@cfxjs/sirius-next-common/dist/utils/hooks/useAge';
import { TablePanel } from 'app/components/TablePanelNew';
import { Title, Footer } from './components';
import { CFX_TOKEN_TYPES } from 'utils/constants';
import { formatListResponseWithPhishingInfo } from '@cfxjs/sirius-next-common/dist/components/PhishingAddressContainer';
interface Props {
  address: string;
}

export const CRC721Txns = ({ address }: Props) => {
  const [ageFormat, toggleAgeFormat] = useAge();
  const url = `/transfer?accountAddress=${address}&transferType=${CFX_TOKEN_TYPES.erc721}`;

  const columnsWidth = [4, 6, 6, 2, 3, 6, 5, 3];
  const columns = [
    tokenColunms.txnHash,
    {
      ...tokenColunms.from,
      render(text, record, index) {
        return tokenColunms.from.render(text, record, index, false);
      },
    },
    tokenColunms.to,
    tokenColunms.fromType,
    tokenColunms.tokenId(),
    tokenColunms.token2,
    tokenColunms.age(ageFormat, toggleAgeFormat),
    tokenColunms.details,
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  const title = ({ total, listLimit }) => (
    <Title
      address={address}
      total={total}
      listLimit={listLimit}
      showFilter={true}
      showSearch={true}
      searchOptions={{
        transactionHash: true,
        fromOrTo: true,
        epoch: true,
        rangePicker: true,
        tokenId: true,
        token: true,
        button: {
          col: {
            xs: 24,
            sm: 6,
            md: 6,
            lg: 6,
            xl: 6,
          },
        },
      }}
      filterOptions={['txTypeAll', 'txTypeOutgoing', 'txTypeIncoming']}
    />
  );

  const footer = <Footer pathname="transfer" type={CFX_TOKEN_TYPES.erc721} />;

  return (
    <TablePanel
      url={url}
      columns={columns}
      footer={footer}
      title={title}
      rowKey={record =>
        `${record.transactionHash}-${record.transactionLogIndex}`
      }
      formatResponse={formatListResponseWithPhishingInfo}
    ></TablePanel>
  );
};
