import React, { useState } from 'react';
import { Translation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components';
import clsx from 'clsx';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
import { Status } from 'app/components/TxnComponents';
import {
  toThousands,
  getENSInfo,
  getNametagInfo,
  roundToFixedPrecision,
} from 'utils';
import { CoreAddressContainer } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/CoreAddressContainer';
import { ColumnAge } from './utils';
import { reqTransactionDetail } from 'utils/httpRequest';
import { Popover } from '@cfxjs/antd';
import { Overview } from 'app/components/TxnComponents';
import { SkeletonContainer } from '@cfxjs/sirius-next-common/dist/components/SkeletonContainer';
import { useBreakpoint } from '@cfxjs/sirius-next-common/dist/utils/media';
import { PendingReason } from './PendingReason';

import iconViewTxn from 'images/view-txn.png';
import iconViewTxnActive from 'images/view-txn-active.svg';
import ContractIcon from 'images/contract-icon.png';
import lodash from 'lodash';
import {
  fromDripToCfx,
  fromDripToGdrip,
} from '@cfxjs/sirius-next-common/dist/utils';
import { ValueHighlight } from '@cfxjs/sirius-next-common/dist/components/Highlight';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';

const StyledHashWrapper = styled.span`
  padding-left: 16px;
`;

interface HashProps {
  showOverview?: boolean;
  hash: string;
  status?: number;
  txExecErrorMsg?: string;
  txExecErrorInfo?: any;
}

export const TxnHashRenderComponent = ({
  showOverview,
  hash,
  status,
  txExecErrorMsg,
  txExecErrorInfo,
}: HashProps) => {
  const [loading, setLoading] = useState(true);
  const [txnDetail, setTxnDetail] = useState<{
    status?: string;
    address?: string;
  }>({});
  const bp = useBreakpoint();

  const handleClick = () => {
    setLoading(true);
    reqTransactionDetail(
      {
        hash: hash,
      },
      {
        aggregate: true,
      },
    ).then(body => {
      setTxnDetail(body);
      setLoading(false);
    });
  };

  // used for skip status in block transactions list
  // original status is null, manually set to 2
  const innerStatus = lodash.isNil(txnDetail.status)
    ? status
    : txnDetail.status;

  return (
    <StyledTransactionHashWrapper>
      {bp !== 's' && showOverview ? (
        <div className="txn-overview-popup-container">
          <Popover
            className="txn-overview-popup"
            placement="right"
            trigger="click"
            content={
              <>
                {loading ? (
                  <SkeletonContainer
                    shown={loading}
                    style={{ width: '25rem', height: '20rem' }}
                  ></SkeletonContainer>
                ) : (
                  <Overview data={{ ...txnDetail, status: innerStatus }} />
                )}
              </>
            }
          >
            <button className="icon-view-txn-container" onClick={handleClick} />
          </Popover>
        </div>
      ) : null}

      {status !== undefined ? (
        <StyledStatusWrapper
          className={clsx({
            show: status !== 0,
          })}
        >
          <Status
            type={status}
            variant="dot"
            txExecErrorInfo={txExecErrorInfo}
            address={txnDetail.address}
            hash={hash}
          ></Status>
        </StyledStatusWrapper>
      ) : null}

      <Link href={`/transaction/${hash}`}>
        <Text tag="span" hoverValue={hash}>
          <SpanWrap>{hash}</SpanWrap>
        </Text>
      </Link>
    </StyledTransactionHashWrapper>
  );
};
TxnHashRenderComponent.defaultProps = {
  showOverview: true,
  showStatus: true,
};

export const hash = {
  title: (
    <StyledHashWrapper>
      <Translation>
        {t => t(translations.general.table.transaction.hash)}
      </Translation>
    </StyledHashWrapper>
  ),
  dataIndex: 'hash',
  key: 'hash',
  width: 1,
  render: (_, row: any) => (
    <TxnHashRenderComponent
      hash={row.hash}
      status={row.status}
      txExecErrorMsg={row.txExecErrorMsg || row?.reason?.pending}
      txExecErrorInfo={row.txExecErrorInfo}
    />
  ),
};

export const from = {
  title: (
    <Translation>
      {t => t(translations.general.table.transaction.from)}
    </Translation>
  ),
  dataIndex: 'from',
  key: 'from',
  width: 1,
  render: (value, row) => (
    <ValueHighlight scope="address" value={value}>
      <CoreAddressContainer
        value={value}
        alias={row.fromContractInfo ? row.fromContractInfo.name : ''}
        contractCreated={row.contractCreated}
        ensInfo={getENSInfo(row)}
        nametagInfo={getNametagInfo(row)}
      />
    </ValueHighlight>
  ),
};

export const to = {
  title: (
    <Translation>
      {t => t(translations.general.table.transaction.to)}
    </Translation>
  ),
  dataIndex: 'to',
  key: 'to',
  width: 1,
  render: (value, row) => {
    let alias = '';
    let verify = false;

    if (row.toContractInfo && row.toContractInfo.name)
      alias = row.toContractInfo.name;
    else if (row.toTokenInfo && row.toTokenInfo.name)
      alias = `${row.toTokenInfo.name}`;
    else if (row.contractInfo && row.contractInfo.name)
      alias = row.contractInfo.name;
    else if (row.tokenInfo && row.tokenInfo.name)
      alias = `${row.tokenInfo.name}`;

    if (row.toContractInfo) {
      verify =
        row.toContractInfo.verify && row.toContractInfo.verify.result !== 0;
    } else if (row.verified === true) {
      verify = true;
    }

    return (
      <ValueHighlight scope="address" value={value}>
        <CoreAddressContainer
          value={value}
          alias={alias}
          contractCreated={row.contractCreated}
          verify={verify}
          ensInfo={getENSInfo(row)}
          nametagInfo={getNametagInfo(row)}
        />
      </ValueHighlight>
    );
  },
};

export const value = {
  title: (
    <Translation>
      {t => t(translations.general.table.transaction.value)}
    </Translation>
  ),
  dataIndex: 'value',
  key: 'value',
  width: 1,
  render: value =>
    value ? (
      <Text tag="span" hoverValue={`${fromDripToCfx(value, true)} CFX`}>
        {`${fromDripToCfx(value)} CFX`}
      </Text>
    ) : (
      '--'
    ),
};

export const gasPrice = {
  title: (
    <Translation>
      {t => t(translations.general.table.transaction.gasPrice)}
    </Translation>
  ),
  dataIndex: 'gasPrice',
  key: 'gasPrice',
  width: 1,
  render: value => (
    <Text tag="span" hoverValue={`${toThousands(value)} drip`}>
      {`${roundToFixedPrecision(
        fromDripToGdrip(value, false, {
          precision: 6,
          minNum: 1e-6,
        }),
        2,
        'FLOOR',
      )} Gdrip`}
    </Text>
  ),
};

export const gasFee = {
  title: (
    <Translation>
      {t => t(translations.general.table.transaction.transactionFee)}
    </Translation>
  ),
  dataIndex: 'gasFee',
  key: 'gasFee',
  width: 1,
  render: value => (
    <Text tag="span" hoverValue={`${toThousands(value)} drip`}>
      {`${fromDripToCfx(value, false, {
        precision: 6,
        minNum: 1e-6,
      })} CFX`}
    </Text>
  ),
};

export const age = (ageFormat, toggleAgeFormat) =>
  ColumnAge({ ageFormat, toggleAgeFormat });

export const method = {
  title: (
    <Translation>
      {t => t(translations.general.table.transaction.method)}
    </Translation>
  ),
  dataIndex: 'method',
  key: 'method',
  width: 1,
  render: (value, row) => {
    if (value === '0x' || value === null || value === undefined || !row.to) {
      return '--';
    }
    const reg = /([^(]*)(?=\(.*\))/;
    const match = reg.exec(value);
    let text = '';
    if (match) {
      text = match[0];
    } else {
      text = value;
    }
    const verify =
      row.toContractInfo &&
      row.toContractInfo.verify &&
      row.toContractInfo.verify.result !== 0;
    const showWarning = !value.startsWith('0x') && !verify;

    return (
      <StyledMethodContainerWrapper>
        {showWarning && (
          <Tooltip
            title={
              <Translation>
                {t => t(translations.general.table.tooltip.methodWarning)}
              </Translation>
            }
            className="method-warning"
          >
            <img
              src={ContractIcon}
              alt="warning"
              className="method-warning-icon"
            />
          </Tooltip>
        )}
        <MethodHighlight scope="method" value={text}>
          <Text tag="span" hoverValue={text}>
            <StyledMethodWrapper>{text}</StyledMethodWrapper>
          </Text>
        </MethodHighlight>
      </StyledMethodContainerWrapper>
    );
  },
};

export const pendingReason = {
  title: (
    <Translation>
      {t => t(translations.general.table.transaction.pendingReason)}
    </Translation>
  ),
  dataIndex: 'reason',
  key: 'reason',
  width: 1,
  render: (_, row) => (
    <PendingReason detail={row.pendingDetail}></PendingReason>
  ),
};

const StyledTransactionHashWrapper = styled.span`
  display: flex;
  align-items: center;

  .status {
    margin-right: 0;
  }

  .txn-overview-popup-container {
    flex-shrink: 0;
    margin-right: 0.3571rem;
  }

  /* reset tooltip-content style */

  .popover.txn-overview-popup + div.tooltip-content {
    .items {
      max-height: inherit;
    }
  }

  .icon-view-txn-container {
    display: block;
    width: 1.4286rem;
    height: 1.4286rem;
    cursor: pointer;
    background-color: transparent;
    background-image: url(${iconViewTxn});
    background-position: center;
    background-size: contain;
    vertical-align: middle;
    border: none;

    &:focus {
      background-image: url(${iconViewTxnActive});
    }
  }
`;

const StyledStatusWrapper = styled.span`
  visibility: hidden;

  &.show {
    visibility: visible;
  }
`;

const SpanWrap = styled.span`
  display: inline-block;
  text-overflow: ellipsis;
  max-width: 85px;
  overflow: hidden;
  vertical-align: bottom;
`;

const MethodHighlight = styled(ValueHighlight)`
  padding: 0;
  height: 20px;
`;
const StyledMethodContainerWrapper = styled.span`
  display: flex;
  .method-warning {
    flex-shrink: 0;
  }
  .method-warning-icon {
    width: 16px;
    height: 16px;
    vertical-align: bottom;
    margin-bottom: 3px;
  }
`;
const StyledMethodWrapper = styled.span`
  background: rgba(171, 172, 181, 0.1);
  border-radius: 10px;
  padding: 4px 8px;
  font-size: 10px;
  font-weight: 500;
  color: #424a71;
  line-height: 12px;
  max-width: 95px;
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
