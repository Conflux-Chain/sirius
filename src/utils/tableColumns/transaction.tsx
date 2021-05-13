import React, { useState } from 'react';
import { Translation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components/macro';
import clsx from 'clsx';
import { Link } from 'app/components/Link/Loadable';
import { Text } from 'app/components/Text/Loadable';
import { Status } from 'app/components/Status/Loadable';
import { formatNumber, fromDripToCfx, toThousands } from 'utils';
import { AddressContainer } from 'app/components/AddressContainer';
import { ColumnAge } from './utils';
import { reqTransactionDetail } from 'utils/httpRequest';
import { Popover } from '@cfxjs/react-ui';
import { Overview } from 'app/components/TxnComponents';
import SkeletonContainer from 'app/components/SkeletonContainer/Loadable';

import iconViewTxn from 'images/view-txn.png';

const StyledHashWrapper = styled.span`
  padding-left: 16px;
`;

const TxnHashRenderComponent = ({ data: row }) => {
  const [loading, setLoading] = useState(true);
  const [txnDetail, setTxnDetail] = useState({});

  const handleClick = () => {
    setLoading(true);
    reqTransactionDetail(
      {
        hash: row.hash,
      },
      {
        aggregate: true,
      },
    ).then(body => {
      setTxnDetail(body);
      setLoading(false);
    });
  };

  return (
    <StyledTransactionHashWrapper>
      <StyledStatusWrapper
        className={clsx({
          show: row.status !== 0,
        })}
      >
        <Status type={row.status} variant="dot">
          {row.txExecErrorMsg}
        </Status>
      </StyledStatusWrapper>
      <Link href={`/transaction/${row.hash}`}>
        <Text span hoverValue={row.hash}>
          <SpanWrap>{row.hash}</SpanWrap>
        </Text>
      </Link>
      <div className="txn-overview-popup-container">
        <Popover
          className="txn-overview-popup"
          placement="right"
          content={
            <SkeletonContainer shown={loading} style={{ maxHeight: '566px' }}>
              <Overview data={txnDetail} />
            </SkeletonContainer>
          }
        >
          <img
            className="icon-view-txn"
            src={iconViewTxn}
            onClick={handleClick}
            alt="view txn detail icon"
          ></img>
        </Popover>
      </div>
    </StyledTransactionHashWrapper>
  );
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
  render: (_, row: any) => {
    return <TxnHashRenderComponent data={row} />;
    // return (
    //   <StyledTransactionHashWrapper>
    //     <StyledStatusWrapper
    //       className={clsx({
    //         show: row.status !== 0,
    //       })}
    //     >
    //       <Status type={row.status} variant="dot">
    //         {row.txExecErrorMsg}
    //       </Status>
    //     </StyledStatusWrapper>
    //     <Link href={`/transaction/${value}`}>
    //       <Text span hoverValue={value}>
    //         <SpanWrap>{value}</SpanWrap>
    //       </Text>
    //     </Link>
    //     <img
    //       className="icon-view-txn"
    //       src={iconViewTxn}
    //       onClick={handleClick}
    //       alt="view txn detail icon"
    //     ></img>
    //     <Popover visible={show} content={<Overview />}></Popover>
    //   </StyledTransactionHashWrapper>
    // );
  },
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
    <AddressContainer
      value={value}
      alias={row.fromContractInfo ? row.fromContractInfo.name : ''}
      contractCreated={row.contractCreated}
    />
  ),
};

export const to = {
  title: (
    <Translation>
      {t => t(translations.general.table.transaction.to)}
    </Translation>
  ),
  dataIndex: 'to',
  key: 'hash',
  width: 1,
  render: (value, row) => (
    <AddressContainer
      value={value}
      alias={
        row.toContractInfo
          ? row.toContractInfo.name
          : row.contractInfo
          ? row.contractInfo.name
          : ''
      }
      contractCreated={row.contractCreated}
    />
  ),
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
      <Text span hoverValue={`${fromDripToCfx(value, true)} CFX`}>
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
    <Text span hoverValue={`${toThousands(value)} drip`}>
      {`${formatNumber(value)} drip`}
    </Text>
  ),
};

export const gasFee = {
  title: (
    <Translation>
      {t => t(translations.general.table.transaction.gasFee)}
    </Translation>
  ),
  dataIndex: 'gasFee',
  key: 'gasFee',
  width: 1,
  render: value => (
    <Text span hoverValue={`${toThousands(value)} drip`}>
      {`${formatNumber(value)} drip`}
    </Text>
  ),
};

export const age = (ageFormat, toggleAgeFormat) =>
  ColumnAge({ ageFormat, toggleAgeFormat });

const StyledTransactionHashWrapper = styled.span`
  display: flex;
  align-items: center;

  .status {
    margin-right: 0.5714rem;
  }

  .txn-overview-popup-container {
    flex-shrink: 0;
  }
  /* reset tooltip-content style */
  .popover.txn-overview-popup + div.tooltip-content {
    .items {
      max-height: inherit;
    }
  }

  .icon-view-txn {
    width: 1.4286rem;
    height: 1.4286rem;
    cursor: pointer;
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
  max-width: 7.1429rem;
  overflow: hidden;
  vertical-align: bottom;
`;
