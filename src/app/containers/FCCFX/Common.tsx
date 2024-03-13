import React from 'react';
import { Image, Tooltip } from '@cfxjs/antd';
import imgInfo from 'images/info.svg';
import styled from 'styled-components';
import {
  RPC_SERVER,
  NETWORK_ID,
  FC_ADDRESS,
  FC_EXCHANGE_ADDRESS,
  FC_EXCHANGE_INTEREST_ADDRESS,
} from 'utils/constants';
import { BigNumber as IBigNumber } from 'bignumber.js';
import { abi as fcExchangeInterestABI } from 'utils/contract/FCExchangeInterest.json';
import { abi as fcExchangeABI } from 'utils/contract/FCExchange.json';
import { abi as fcABI } from 'utils/contract/FC.json';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import {
  completeDetect,
  provider,
} from '@cfxjs/use-wallet-react/conflux/Fluent';

export interface AccountInfoType {
  fcSigned: IBigNumber;
  fcUnsigned: IBigNumber;
  fcSignedHistory: IBigNumber;
  cfxWithdrawed: IBigNumber;
  // nft info
  isNFTActive: boolean;
  NFTId: string;
  pendingProfit: IBigNumber;
  pendingProfitLegacy: IBigNumber;
  availableFc: IBigNumber;
  cfxUnsigned: IBigNumber;
  availableToWithdraw: IBigNumber;
}

export interface TotalInfoType {
  balanceOfCfx: IBigNumber;
  fcMiningAPY: IBigNumber;
  fcSigned: IBigNumber;
  fcSignedHistory: IBigNumber;
}

export interface InfoItemType {
  key: string;
  title: string;
  value: IBigNumber;
  unit?: string;
  span: number;
  tip?: React.ReactNode;
}

export const TitleTip = ({ tip }) => {
  return (
    <StyledTitleTipWrapper>
      <Tooltip title={tip}>
        <Image src={imgInfo} alt="tip" preview={false} />
      </Tooltip>
    </StyledTitleTipWrapper>
  );
};

const StyledTitleTipWrapper = styled.span`
  margin-left: 5px;
  height: 18px;
  display: inline-flex;
`;

export const Tip = ({
  children,
  size = 12,
  lineHeight = 16,
  hidden = false,
  ...others
}) => {
  return (
    <StyledTipWrapper
      size={size}
      lineHeight={lineHeight}
      hidden={hidden}
      {...others}
    >
      {children}
    </StyledTipWrapper>
  );
};

const StyledTipWrapper = styled.span<{
  lineHeight: number;
  size: number;
  hidden: boolean;
}>`
  color: #e15c56;
  line-height: ${props => `${props.lineHeight}px`};
  font-size: ${props => `${props.size}px`};
  display: ${props => (props.hidden ? 'none' : 'inherit')};
`;

export const CardTip = ({
  tip = '',
  show = false,
}: {
  tip: React.ReactNode;
  show?: boolean;
}) => {
  return <StyledCardInfoWrapper show={show}>{tip}</StyledCardInfoWrapper>;
};

const StyledCardInfoWrapper = styled.div<{
  show: boolean;
}>`
  display: ${props => (props.show ? 'inherit' : 'none')};
  background: #dbe9ff;
  box-shadow: 12px 8px 24px -12px rgb(20 27 50 / 12%);
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  width: 98%;
  margin: 0 auto;
  padding: 10px 16px;
`;

export const CFX = new SDK.Conflux({
  url: RPC_SERVER,
  networkId: NETWORK_ID,
});

if (provider) {
  CFX.provider = provider;
}
completeDetect().then(() => {
  CFX.provider = provider;
});

export const fcExchangeContract = CFX.Contract({
  address: FC_EXCHANGE_ADDRESS,
  abi: fcExchangeABI,
});

export const fcExchangeInterestContract = CFX.Contract({
  address: FC_EXCHANGE_INTEREST_ADDRESS,
  abi: fcExchangeInterestABI,
});

export const fcContract = CFX.Contract({
  address: FC_ADDRESS,
  abi: fcABI,
});
