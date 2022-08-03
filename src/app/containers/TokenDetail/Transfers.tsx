import React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { TabsTablePanel } from 'app/components/TabsTablePanel/Loadable';
import { CFX_TOKEN_TYPES } from 'utils/constants';
import { ContractContent } from '../AddressContractDetail/ContractContent';
import { ContractStatus } from '../AddressContractDetail/ContractStatus';
import { useContract } from 'utils/api';
import { Token } from '../Charts/pow/Loadable';

import { Transfers as TokenTransfers } from 'app/containers/Tokens/Loadable';
import { Holders } from './Holders';
import { NFTAsset } from 'app/containers/NFTAsset';

interface TransferProps {
  tokenName: string;
  address: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  price: number;
  holderCount: number;
  transferType: string;
  isRegistered: boolean;
}

export function Transfers({ tokenData }: { tokenData: TransferProps }) {
  const {
    address: tokenAddress,
    decimals,
    totalSupply,
    price,
    transferType = typeof tokenData.decimals !== 'undefined'
      ? CFX_TOKEN_TYPES.erc20
      : '',
    isRegistered,
  } = tokenData;
  const { t } = useTranslation();

  const { data: contractInfo } = useContract(tokenAddress, [
    'name',
    'iconUrl',
    'sponsor',
    'admin',
    'from',
    'website',
    'transactionHash',
    'cfxTransferCount',
    'erc20TransferCount',
    'erc721TransferCount',
    'erc1155TransferCount',
    'stakingBalance',
    'sourceCode',
    'abi',
    'isRegistered',
    'verifyInfo',
  ]);

  const tabs: any = [
    {
      value: 'transfers',
      action: 'tokenTransfers',
      label: t(translations.token.transfers),
      content: (
        <TokenTransfers
          type={transferType}
          address={tokenAddress}
          decimals={decimals}
        />
      ),
    },
  ];

  if (
    isRegistered &&
    (transferType === CFX_TOKEN_TYPES.erc20 ||
      transferType === CFX_TOKEN_TYPES.erc721 ||
      transferType === CFX_TOKEN_TYPES.erc1155)
  ) {
    tabs.push({
      value: 'holders',
      action: 'tokenHolders',
      label: t(translations.token.holders),
      content: (
        <Holders
          type={transferType}
          decimals={decimals}
          price={price}
          totalSupply={totalSupply}
          address={tokenAddress}
        />
      ),
    });
  }

  const clientWidth = document.body.clientWidth;
  let chartWidth = clientWidth - 36;

  if (clientWidth > 1350) chartWidth = 1350;
  if (chartWidth < 365) chartWidth = 365;

  const analysisPanel = () => (
    <StyledTabWrapper>
      <Token address={tokenAddress} type={transferType} />
    </StyledTabWrapper>
  );

  const analysisTab = {
    value: 'analysis',
    action: 'tokenAnalysis',
    label: t(translations.token.analysis),
    content: analysisPanel(),
  };

  if (isRegistered) {
    tabs.push(analysisTab);
  }

  if (
    transferType === CFX_TOKEN_TYPES.erc721 ||
    transferType === CFX_TOKEN_TYPES.erc1155
  ) {
    tabs.push({
      value: 'NFT',
      action: 'tokenNFT',
      label: t(translations.token.NFT),
      content: <NFTAsset contract={tokenAddress} type={transferType} />,
    });
  }

  // Contract tab
  tabs.push({
    value: 'contract-viewer',
    action: 'contractViewer',
    label: (
      <div>
        {t(translations.token.contract)}
        <ContractStatus contract={contractInfo} />
      </div>
    ),
    content: <ContractContent contractInfo={contractInfo} />,
  });

  return transferType ? <TabsTablePanel tabs={tabs} /> : null;
}

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
