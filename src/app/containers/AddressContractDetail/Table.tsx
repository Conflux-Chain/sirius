import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { TabsTablePanel } from 'app/components/TabsTablePanel/Loadable';
import { isCoreContractAddress, isZeroAddress } from 'utils';
import { CFX_TOKEN_TYPES, HIDE_IN_DOT_NET } from 'utils/constants';
import { ContractContent } from './ContractContent';
import { ExecutedAndPendingTxns } from 'app/containers/Transactions/Loadable';
import { Contract } from '../Charts/pow/Loadable';

import {
  CFXTxns,
  CRC20Txns,
  CRC721Txns,
  CRC1155Txns,
} from 'app/containers/Transactions/Loadable';
import { MinedBlocks } from 'app/containers/Blocks/Loadable';
import { NFTAsset } from 'app/containers/NFTAsset/Loadable';
import styled from 'styled-components';
import { ContractStatus } from '../AddressContractDetail/ContractStatus';

export const Table = memo(
  ({ address, addressInfo }: { address: string; addressInfo: any }) => {
    const { t } = useTranslation();
    const isContract = useMemo(() => isCoreContractAddress(address), [address]);

    const tabs: any = [
      {
        value: `transaction`,
        action: 'accountTransactions',
        label: t(translations.general.transactions),
        content: <ExecutedAndPendingTxns address={address} />,
      },
      {
        hidden: !addressInfo.cfxTransferTab,
        value: `transfers-${CFX_TOKEN_TYPES.cfx}`,
        action: 'cfxTransfers',
        label: t(translations.general.cfxTransfer),
        content: <CFXTxns address={address} />,
      },
      {
        hidden: !addressInfo.erc20TransferTab,
        value: `transfers-${CFX_TOKEN_TYPES.crc20}`,
        action: 'transfersCrc20',
        label: t(translations.general.tokenTxnsErc20),
        content: <CRC20Txns address={address} />,
      },
      {
        hidden: !addressInfo.erc721TransferTab,
        value: `transfers-${CFX_TOKEN_TYPES.crc721}`,
        action: 'transfersCrc721',
        label: t(translations.general.tokenTxnsErc721),
        content: <CRC721Txns address={address} />,
      },
      {
        hidden: !addressInfo.erc1155TransferTab,
        value: `transfers-${CFX_TOKEN_TYPES.crc1155}`,
        action: 'transfersCrc1155',
        label: t(translations.general.tokenTxnsErc1155),
        content: <CRC1155Txns address={address} />,
      },
    ];

    if (HIDE_IN_DOT_NET) {
      tabs.splice(1, 2);
    }

    if (!isZeroAddress(address)) {
      tabs.push({
        hidden: !addressInfo.nftAssetTab,
        value: 'nft-asset',
        action: 'NFTAsset',
        label: t(translations.addressDetail.NFTAsset),
        content: <NFTAsset />,
      });
    }

    const analysisPanel = () => (
      <StyledTabWrapper>
        <Contract address={address} />
      </StyledTabWrapper>
    );
    if (isContract) {
      tabs.push(
        {
          value: 'analysis',
          action: 'contractAnalysis',
          label: t(translations.token.analysis),
          content: analysisPanel(),
        },
        {
          value: 'contract-viewer',
          action: 'contractViewer',
          label: (
            <div>
              {t(translations.token.contract)}
              <ContractStatus contract={addressInfo} />
            </div>
          ),
          content: <ContractContent contractInfo={addressInfo} />,
        },
      );
    }

    if (!(isContract || isZeroAddress(address)) && !HIDE_IN_DOT_NET) {
      tabs.push(
        ...[
          {
            hidden: !addressInfo.minedBlockTab,
            value: 'mined-blocks',
            action: 'minedBlocks',
            label: t(translations.addressDetail.minedBlocks),
            content: <MinedBlocks address={address} />,
          },
        ],
      );
    }

    return <TabsTablePanel key="table" tabs={tabs} />;
  },
);
const StyledTabWrapper = styled.div`
  .card {
    padding: 0.3571rem !important;

    .content {
      overflow-x: auto;
      & > div {
        box-shadow: none !important;
      }
    }
  }
`;
