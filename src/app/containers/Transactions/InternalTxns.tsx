import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StyledCopyButton as CopyButton } from 'app/components/StyledComponent';
import { formatAddress } from 'utils';
import styled from 'styled-components';
import { useTxTrace } from '@cfxjs/sirius-next-common/dist/utils/hooks/useTxTrace';
import { TreeTrace } from './TreeTrace';
import { ListTrace } from './ListTrace';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';
import { Switch } from '@cfxjs/sirius-next-common/dist/components/Switch';
import IconInfo from 'images/info.svg';
import { renderAddress } from 'utils/tableColumns/utils';
import { AddressNameMap } from '@cfxjs/sirius-next-common/dist/utils/request.types';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';

interface Props {
  hash: string;
  from: string;
  to: string;
  nameMap?: Record<string, AddressNameMap>;
}

export const InternalTxns = ({ hash, from, to, nameMap }: Props) => {
  const { t } = useTranslation();
  const [showProxyCall, setShowProxyCall] = useState(false);
  const [viewMode, setViewMode] = useState('tree');
  const { data, isLoading } = useTxTrace(hash, 'core');
  const { list = [], total = 0 } = data ?? {};

  const fromContent = () => (
    <StyledAddressContainer>
      {renderAddress(from, { nameMap }, 'from', {
        showVerificationName: true,
      })}{' '}
      <CopyButton copyText={formatAddress(from)} />
    </StyledAddressContainer>
  );
  const toContent = () => (
    <StyledAddressContainer>
      {renderAddress(to, { nameMap }, 'to', {
        showVerificationName: true,
      })}{' '}
      <CopyButton copyText={formatAddress(to)} />
    </StyledAddressContainer>
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
  background: #000;
  padding: 6px 24px;
  color: #fafafa;
  .text-\\#333 {
    color: #fafafa;
  }
  .ant-table-row.\\!bg-\\#f9fafb {
    background: transparent !important;
  }
  .\\!bg-\\#f0f5ff {
    background: transparent !important;
  }
  .text-\\#002257 {
    color: #fafafa;
  }
  .bg-\\#f7f7f8 {
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.06);
    .text-\\#25282d {
      color: #fafafa;
    }
  }
  .bg-\\#fafbfc {
    background: rgba(255, 255, 255, 0.06);
    color: #fafafa;
  }
  .ace_editor,
  .ace_editor .ace_gutter {
    background-color: #000;
  }
  button.bg-\\#fff {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: transparent;
    color: #fafafa;
  }
`;

const StyledAddressContainer = styled.div`
  display: inline-flex;
  align-items: center;
`;

const StyledTipWrapper = styled.span`
  color: #94a3b6;
  display: flex;
  align-items: center;
  height: 64px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  .tip-title {
    flex: 1;
  }
  ${media.s} {
    flex-direction: column;
    height: auto;
  }
`;

const StyledCountWrapper = styled.span`
  color: #60bbf9;
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
