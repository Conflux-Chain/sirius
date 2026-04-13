import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { CoreAddressContainer } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/CoreAddressContainer';
import { CopyButton } from '@cfxjs/sirius-next-common/dist/components/CopyButton';
import { formatAddress } from 'utils';
import styled from 'styled-components';
import { useTxTrace } from '@cfxjs/sirius-next-common/dist/utils/hooks/useTxTrace';
import { TreeTrace } from './TreeTrace';
import { ListTrace } from './ListTrace';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';
import { Switch } from '@cfxjs/sirius-next-common/dist/components/Switch';
import IconInfo from 'images/info.svg';

interface Props {
  hash: string;
  from: string;
  to: string;
}

export const InternalTxns = ({ hash, from, to }: Props) => {
  const { t } = useTranslation();
  const [showProxyCall, setShowProxyCall] = useState(false);
  const [viewMode, setViewMode] = useState('tree');
  const { data, isLoading } = useTxTrace(hash, 'core');
  const { list = [], total = 0 } = data ?? {};

  const fromContent = (isFull = false) => (
    <span>
      <CoreAddressContainer value={from} isFull={isFull} />{' '}
      <CopyButton copyText={formatAddress(from)} />
    </span>
  );
  const toContent = (isFull = false) => (
    <span>
      <CoreAddressContainer value={to} isFull={isFull} />{' '}
      <CopyButton copyText={formatAddress(to)} />
    </span>
  );

  return (
    <StyledContainer>
      <StyledTipWrapper>
        <div className="tip-title">
          {t(translations.transaction.internalTxnsTip.from)} {fromContent()}{' '}
          {t(translations.transaction.internalTxnsTip.to)} {toContent()}{' '}
          {t(translations.transaction.internalTxnsTip.produced)}{' '}
          <StyledCountWrapper>{total}</StyledCountWrapper>{' '}
          {t(translations.transaction.internalTxnsTip.txns)}
        </div>
        <StyledAdvancedWrapper>
          <div className="advanced-filter">
            <Tooltip
              title={t(translations.transaction.txTrace.tooltip.proxyCall)}
            >
              <img src={IconInfo} alt="tips" />
            </Tooltip>
            {t(translations.transaction.txTrace.proxyCall)}
            <Switch
              checked={showProxyCall}
              onChange={e => setShowProxyCall(e)}
              size="small"
            />
          </div>
          <div className="advanced-filter">
            <Tooltip
              title={t(translations.transaction.txTrace.tooltip.listView)}
            >
              <img src={IconInfo} alt="tips" />
            </Tooltip>
            {t(translations.transaction.txTrace.listView)}
            <Switch
              checked={viewMode === 'list'}
              onChange={e => setViewMode(e ? 'list' : 'tree')}
              size="small"
            />
          </div>
        </StyledAdvancedWrapper>
      </StyledTipWrapper>
      {viewMode === 'list' ? (
        <ListTrace
          data={list}
          loading={isLoading}
          showProxyCall={showProxyCall}
        />
      ) : (
        <TreeTrace
          data={list}
          loading={isLoading}
          showProxyCall={showProxyCall}
        />
      )}
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  background: #fff;
  padding: 6px 24px;
`;

const StyledTipWrapper = styled.span`
  color: #94a3b6;
  display: flex;
  align-items: center;
  height: 64px;
  border-bottom: 1px solid #ebeced;
  .tip-title {
    flex: 1;
  }
`;

const StyledCountWrapper = styled.span`
  color: #1e3de4;
`;
const StyledAdvancedWrapper = styled.div`
  display: flex;
  gap: 16px;
  .advanced-filter {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;
