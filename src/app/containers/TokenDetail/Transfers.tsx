import React from 'react';
import styled from 'styled-components/macro';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { Link } from '@cfxjs/react-ui';
import { useTranslation } from 'react-i18next';
import { media } from '../../../styles/media';
import { translations } from '../../../locales/i18n';
import {
  TabsTablePanel,
  TabLabel,
} from '../../components/TabsTablePanel/Loadable';
import { ColumnsType } from '../../components/TabsTablePanel';
import { Text } from '../../components/Text';
import { Filter } from './Filter';
import { isAddress, isHash } from '../../../utils/util';
import numeral from 'numeral';

interface TransferProps {
  tokenAddress: string;
  symbol: string;
}

interface Query {
  accountAddress?: string;
  transactionHash?: string;
}

export function Transfers({ tokenAddress, symbol }: TransferProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  let {
    pageSize: parsedPageSize,
    accountAddress: filterAddr,
    transactionHash: filterHash,
    ...others
  } = queryString.parse(location.search);
  if (!parsedPageSize) {
    parsedPageSize = '10';
  }

  const filter = (filterAddr as string) || (filterHash as string) || '';

  const onFilter = (filter: string) => {
    let object: Query = {};
    if (isAddress(filter)) {
      object.accountAddress = filter;
    } else if (isHash(filter)) {
      object.transactionHash = filter;
    }
    const urlWithQuery = queryString.stringifyUrl({
      url: location.pathname,
      query: {
        ...others,
        page: '1',
        pageSize: parsedPageSize as string,
        ...object,
      },
    });
    history.push(urlWithQuery);
  };
  const renderTextEllipsis = (value: string | number) => {
    return (
      <Text span maxWidth="5.7143rem" hoverValue={value}>
        <StyledTextWrapper>{value}</StyledTextWrapper>
      </Text>
    );
  };

  const renderAddressEllipsis = (value: string) => {
    return (
      <Text span maxWidth="5.7143rem" hoverValue={value}>
        <Link onClick={() => onFilter(value)}>{value}</Link>
      </Text>
    );
  };

  const columns: ColumnsType = [
    {
      title: t(translations.token.transferList.txnHash),
      dataIndex: 'transactionHash',
      key: 'transactionHash',
      render: value => (
        <Link href={`/transactions/${value}`}>{renderTextEllipsis(value)}</Link>
      ),
    },
    {
      title: t(translations.token.transferList.age),
      dataIndex: 'syncTimestamp',
      key: 'age',
    },
    {
      title: t(translations.token.transferList.from),
      dataIndex: 'from',
      key: 'from',
      render: value => {
        return (
          <FromWrap>
            {filter === value
              ? renderTextEllipsis(value)
              : renderAddressEllipsis(value)}
            <ImgWrap
              src={
                !filter
                  ? '/token/arrow.svg'
                  : filter === value
                  ? '/token/out.svg'
                  : '/token/in.svg'
              }
            />
          </FromWrap>
        );
      },
    },
    {
      title: t(translations.token.transferList.to),
      dataIndex: 'to',
      key: 'to',
      render: value =>
        filter === value
          ? renderTextEllipsis(value)
          : renderAddressEllipsis(value),
    },
    {
      title: t(translations.token.transferList.quantity),
      dataIndex: 'value',
      key: 'value',
      render: value => renderTextEllipsis(numeral(value).format(0, 0)), // todo, big number will transfer to NaN
    },
  ];

  const tabs = [
    {
      value: 'transfers',
      label: (count: number) => {
        return (
          <LabelWrap>
            {t(translations.token.transfers)}
            <TabLabel count={count} />
          </LabelWrap>
        );
      },
      url: `/transfer?tokenAddress=${tokenAddress}`,
      table: {
        columns: columns,
        rowKey: 'transactionHash',
      },
    },
  ];

  return (
    <TransfersWrap>
      <TabsTablePanel tabs={tabs} />
      <Filter
        symbol={symbol}
        filter={filter}
        tokenAddress={tokenAddress}
        onFilter={onFilter}
      />
    </TransfersWrap>
  );
}

const StyledTextWrapper = styled.span`
  font-weight: 400;
  line-height: 1.7143rem;
  font-size: 14px;
`;

const TransfersWrap = styled.div`
  position: relative;
  ${media.s} {
    padding-top: 4rem;
  }
`;

const LabelWrap = styled.div`
  display: flex;
  color: #0f1327;
  font-weight: 700;
  font-size: 1.1429rem;
`;

const FromWrap = styled.div`
  position: relative;
`;

const ImgWrap = styled.img`
  position: absolute;
  right: -0.8571rem;
  top: 0.1429rem;
  ${media.s} {
    right: -1.1429rem;
  }
`;
