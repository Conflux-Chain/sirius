import React from 'react';
import styled from 'styled-components';
import { Card } from '@cfxjs/sirius-next-common/dist/components/Card';
import { Description } from '@cfxjs/sirius-next-common/dist/components/Description';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';
import {
  use1155TokenBalance,
  useTokenBalance,
} from 'utils/hooks/useTokenBalance';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
import { formatBalance } from '@cfxjs/sirius-next-common/dist/utils';
import { CFX_TOKEN_TYPES } from 'utils/constants';
import { CoreAddressContainer } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/CoreAddressContainer';
import { CopyButton } from '@cfxjs/sirius-next-common/dist/components/CopyButton';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

interface HolderFilterProps {
  holder: string;
  tokenData: {
    address: string;
    symbol: string;
    decimals: number;
    transferType: string;
  };
}

export const HolderFilter = ({ holder, tokenData }: HolderFilterProps) => {
  const { t } = useTranslation();
  const { address, transferType, decimals, symbol } = tokenData;
  const is1155NFT = transferType === CFX_TOKEN_TYPES.erc1155;
  const { data: balance } = useTokenBalance({
    address: address,
    account: holder,
    enabled: !is1155NFT,
  });
  const { data: balance1155 } = use1155TokenBalance({
    address: address,
    account: holder,
    enabled: is1155NFT,
  });
  return (
    <Wrapper contentClassName="card-content">
      <Description
        size="small"
        vertical
        className={`item ${!is1155NFT ? 'border' : ''}`}
        title={t(translations.tokens.filterByHolder)}
        noBorder
      >
        <CoreAddressContainer value={holder} isFull showIcon={false} />{' '}
        <CopyButton copyText={holder} />
      </Description>
      <Description
        size="small"
        vertical
        title={t(translations.tokens.balance)}
        className="item"
        noBorder
      >
        <Text
          hoverValue={`${formatBalance(
            is1155NFT ? balance1155 : balance,
            transferType === CFX_TOKEN_TYPES.erc20 ? decimals : 0,
            true,
          )} ${symbol}`}
          maxCount={47}
          mobileMaxCount={39}
        >
          {`${formatBalance(
            is1155NFT ? balance1155 : balance,
            transferType === CFX_TOKEN_TYPES.erc20 ? decimals : 0,
          )} ${symbol}`}
        </Text>
      </Description>
    </Wrapper>
  );
};

const Wrapper = styled(Card)`
  margin-bottom: 2.2857rem;
  .card-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .item.border {
    border-right: 1px solid #e6e6e6;
  }
  .item {
    width: 48%;
    ${media.m} {
      width: 100%;
    }
  }
`;
