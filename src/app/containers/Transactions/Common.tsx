import React, { useMemo } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { media } from 'styles/media';
import {
  TableSearchDatepicker,
  TableSearchDropdown,
} from 'app/components/TablePanel';
import { toThousands, isContractAddress, isInnerContractAddress } from 'utils';
import { DownloadCSV } from 'app/components/DownloadCSV/Loadable';
import { useLocation } from 'react-router-dom';
import qs from 'query-string';
import { useParams } from 'react-router-dom';

interface TitleProps {
  readonly address: string;
  readonly total: number;
  readonly showDatepicker?: boolean;
  readonly showTotalTip?: boolean;
  readonly showFilter?: boolean;
  readonly showSearchInput?: boolean;
  readonly filterOptions?: Array<any>; // ['txTypeAll', 'txTypeOutgoing', 'txTypeIncoming', 'status1', 'txTypeCreate']
}

interface FooterProps {
  readonly type?: string;
  readonly pathname: string;
}

interface QueryProps {
  [index: string]: string;
}

export const Title = ({
  address,
  total,
  showDatepicker,
  showTotalTip,
  showFilter,
  showSearchInput,
  filterOptions = [],
}: TitleProps) => {
  const { t } = useTranslation();
  const isContract = useMemo(
    () => isContractAddress(address) || isInnerContractAddress(address),
    [address],
  );

  const options = useMemo(
    () => ({
      txTypeAll: {
        key: 'txType',
        value: 'all',
        name: t(translations.general.viewAll),
      },
      txTypeOutgoing: {
        key: 'txType',
        value: 'outgoing',
        name: t(translations.transaction.viewOutgoingTxns),
      },
      txTypeIncoming: {
        key: 'txType',
        value: 'incoming',
        name: t(translations.transaction.viewIncomingTxns),
      },
      status1: {
        key: 'status',
        value: '1',
        name: t(translations.transaction.viewFailedTxns),
      },
      txTypeCreate: {
        key: 'txType',
        value: 'create',
        name: t(translations.transaction.viewCreationTxns),
      },
    }),
    [t],
  );

  const getSearchDatepicker = useMemo(() => {
    return showDatepicker ? <TableSearchDatepicker /> : null;
  }, [showDatepicker]);

  const getSearchFilter = useMemo(() => {
    if (!isContract) {
      if (showFilter && filterOptions.length > 0) {
        return (
          <TableSearchDropdown options={filterOptions.map(f => options[f])} />
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  }, [filterOptions, isContract, options, showFilter]);

  const getTotalTip = useMemo(() => {
    return showTotalTip
      ? t(
          total > 10000
            ? translations.general.totalRecordLimit
            : translations.general.totalRecord,
          {
            total: toThousands(total),
          },
        )
      : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  return (
    <StyledTableHeaderWrapper>
      {getTotalTip}
      <FilterWrap>
        {getSearchDatepicker}
        {getSearchFilter}
      </FilterWrap>
    </StyledTableHeaderWrapper>
  );
};
Title.defaultProps = {
  address: '',
  total: 0,
  showDatepicker: false,
  showTotalTip: true,
  showFilter: false,
  showSearchInput: false,
  filterOptions: [],
};

export const Footer = ({ pathname, type }: FooterProps) => {
  const { address } = useParams<{ address: string }>();
  const location = useLocation();
  const {
    minTimestamp,
    maxTimestamp,
    accountAddress = address || '',
    txType,
    status,
  } = qs.parse(location.search || '');

  const url = `/v1/report/${pathname}`;

  const query: QueryProps = {
    limit: '5000',
    reverse: 'true',
    accountAddress: accountAddress as string,
  };

  if (typeof minTimestamp === 'string') {
    query.minTimestamp = minTimestamp;
  }

  if (typeof maxTimestamp === 'string') {
    query.maxTimestamp = maxTimestamp;
  }

  if (typeof type === 'string') {
    query.transferType = type;
  }

  if (typeof txType === 'string') {
    query.txType = txType;
  }

  if (status === '1') {
    query.status = status;
  }

  return (
    <DownloadCSV
      url={qs.stringifyUrl({
        url,
        query,
      })}
    />
  );
};

const StyledTableHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FilterWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 200;

  ${media.s} {
    flex-direction: column;
    align-items: flex-start;
    right: unset;
    left: 0;
    top: 7rem;
    z-index: 10;
  }
`;
