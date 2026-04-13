import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components';
import {
  Down,
  Plus,
  Minus,
  Success,
  Failed,
} from '@cfxjs/sirius-next-common/dist/components/Icons';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';

export const gas = {
  width: 1,
  title: (
    <Translation>{t => t(translations.general.table.token.gas)}</Translation>
  ),
  dataIndex: 'gas',
  key: 'gas',
  render: (gas, row) => {
    if (!gas) return 'N/A';
    const normalizedGas = Number(gas);
    if (Number.isNaN(normalizedGas)) return 'N/A';
    const gasLeft = row.result?.gasLeft;
    const normalizedGasLeft =
      gasLeft === null || gasLeft === undefined ? null : Number(gasLeft);
    const gasUsed =
      normalizedGasLeft === null || Number.isNaN(normalizedGasLeft)
        ? '-'
        : normalizedGas - normalizedGasLeft;
    return `${gasUsed}/${normalizedGas}`;
  },
};

export const detailExpandColumn = ({
  expandedRowKeys,
  setExpandedKeys,
}: {
  expandedRowKeys: string[];
  setExpandedKeys: (keys: string[]) => void;
}) => ({
  title: '',
  dataIndex: 'index',
  key: 'detail',
  render: (index, row) => {
    const isExpanded = expandedRowKeys.includes(index);
    const isDataEmpty = !row.input || row.input === '0x';
    const isReturnDataEmpty =
      !row.result?.returnData || row.result.returnData === '0x';
    if (isDataEmpty && isReturnDataEmpty) return null;
    return (
      <StyledIconWrapper
        onClick={() => {
          if (isExpanded) {
            setExpandedKeys(expandedRowKeys.filter(k => k !== index));
          } else {
            setExpandedKeys([...expandedRowKeys, index]);
          }
        }}
      >
        <Down className={isExpanded ? 'reverse' : ''} />
      </StyledIconWrapper>
    );
  },
});

export const index = ({
  expandedRowKeys,
  setExpandedKeys,
}: {
  expandedRowKeys: string[];
  setExpandedKeys: (keys: string[]) => void;
}) => ({
  title: 'Index',
  dataIndex: 'index',
  key: 'tree',
  render: (index, row) => {
    if (!row.calls || row.calls.length === 0)
      return <span style={{ marginLeft: '26px' }}>{index}</span>;
    const isExpanded = expandedRowKeys.includes(index);
    return (
      <span
        style={{
          display: 'flex',
          gap: '10px',
        }}
      >
        <StyledIconWrapper
          onClick={() => {
            if (isExpanded) {
              setExpandedKeys(expandedRowKeys.filter(k => k !== index));
            } else {
              setExpandedKeys([...expandedRowKeys, index]);
            }
          }}
        >
          {isExpanded ? <Minus /> : <Plus />}
        </StyledIconWrapper>
        {index}
      </span>
    );
  },
});

const TraceTypeElement = ({
  info,
  withIndex,
}: {
  info: any;
  withIndex?: boolean;
}) => {
  const outcome = info?.result?.outcome;

  return (
    <StyledTraceTypeWrapper>
      {outcome && outcome !== 'success' ? <Failed /> : <Success />}
      <Text hoverValue={`${info.type}${withIndex ? `_${info.index}` : ''}`}>
        <div className="type-container">
          {info.type}
          {withIndex ? `_${info.index}` : ''}
        </div>
      </Text>
    </StyledTraceTypeWrapper>
  );
};

export const traceType = ({
  withIndex = true,
}: { withIndex?: boolean } = {}) => ({
  width: 1,
  title: (
    <Translation>
      {t => (
        <span style={{ marginLeft: '1rem' }}>
          {t(translations.general.table.token.traceType)}
        </span>
      )}
    </Translation>
  ),
  dataIndex: 'type',
  key: 'type',
  render: (_, row) => <TraceTypeElement info={row} withIndex={withIndex} />,
});

const StyledIconWrapper = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  svg {
    width: 16px;
    height: 16px;
  }
  svg.reverse {
    transform: rotate(180deg);
  }
`;

const StyledTraceTypeWrapper = styled.span`
  max-width: 130px;
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    flex-shrink: 0;
  }

  .type-container {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 8.5714rem;
    display: inline-block;
    vertical-align: middle;
  }
`;
