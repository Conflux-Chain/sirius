import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { media } from 'styles/media';
import { TableSearchDropdown } from 'app/components/TablePanel';
import { toThousands } from 'utils';
import { DownloadCSV } from 'app/components/DownloadCSV/Loadable';
import qs from 'query-string';
import { useParams } from 'react-router-dom';
import { useHistory, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { TitleTotal } from 'app/components/TablePanelNew';
import {
  AdvancedSearchForm,
  AdvancedSearchFormProps,
} from './AdvancedSearchForm';
import Search from '@zeit-ui/react-icons/search';
import ChevronUp from '@zeit-ui/react-icons/chevronUp';

import { Link } from 'app/components/Link/Loadable';
import { ActionButton } from 'sirius-next/packages/common/dist/components/ActionButton';
interface FooterProps {
  type?: string;
  pathname: string;
}

interface QueryProps {
  [index: string]: string;
}

interface TitleProps {
  address: string;
  total: number;
  listLimit?: number;
  showTotalTip?: boolean;
  showFilter?: boolean;
  showSearch?: boolean;
  searchOptions?: AdvancedSearchFormProps;
  filterOptions?: Array<any>; // ['txTypeAll', 'txTypeOutgoing', 'txTypeIncoming', 'status1', 'txTypeCreate']
  extraContent?: React.ReactNode;
}

export const Title = ({
  address,
  total,
  listLimit,
  showTotalTip,
  showFilter,
  showSearch,
  filterOptions = [],
  extraContent,
  searchOptions = {},
}: Readonly<TitleProps>) => {
  const { t } = useTranslation();
  const [fold, setFold] = useState(true);

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

  const getSearchFilter = useMemo(() => {
    if (showFilter && filterOptions.length > 0) {
      return (
        <TableSearchDropdown options={filterOptions.map(f => options[f])} />
      );
    } else {
      return null;
    }
  }, [filterOptions, options, showFilter]);

  const getTotalTip = useMemo(() => {
    return showTotalTip ? (
      <TitleTotal total={total} listLimit={listLimit || total}></TitleTotal>
    ) : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, listLimit]);

  const getSearch = useMemo(() => {
    return showSearch ? (
      <ActionButton onClick={() => setFold(!fold)}>
        {fold ? <Search size={18} /> : <ChevronUp size={18} />}
      </ActionButton>
    ) : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fold]);

  return (
    <StyledTableHeaderWrapper>
      <div className="table-header-top">
        <div className="table-title-tip-total">{getTotalTip}</div>
        {extraContent ? (
          <div className="table-title-extra-content">{extraContent}</div>
        ) : null}
        <div className="table-title-filter-wrapper">
          {getSearch}
          {getSearchFilter}
        </div>
      </div>
      {fold ? null : (
        <div className="table-header-bottom">
          {<AdvancedSearchForm {...searchOptions} />}
        </div>
      )}
    </StyledTableHeaderWrapper>
  );
};
Title.defaultProps = {
  address: '',
  total: 0,
  listLimit: 0,
  showTotalTip: true,
  showFilter: false,
  showSearch: false,
  filterOptions: [],
  extraContent: null,
};

export const Footer = ({ pathname, type }: Readonly<FooterProps>) => {
  const { address } = useParams<{ address: string }>();
  const location = useLocation();
  const { accountAddress = address || '', tab, ...query } = qs.parse(
    location.search || '',
  );
  const url = `/v1/report/${pathname}`;

  return (
    <DownloadCSV
      url={qs.stringifyUrl({
        url,
        query: {
          ...query,
          limit: '5000',
          reverse: 'true',
          transferType: type,
          accountAddress: accountAddress,
        },
      })}
    />
  );
};

interface TxnSwitcherProps {
  total: number;
  isAccount?: boolean;
}

export const TxnSwitcher = ({
  total = 0,
  isAccount = false,
}: TxnSwitcherProps) => {
  const location = useLocation();
  const { t } = useTranslation();

  const { transactionType = 'executed' } = qs.parse(location.search);
  const isExecuted = transactionType === 'executed';

  if (isAccount) {
    return (
      <Link
        href={qs.stringifyUrl({
          url: location.pathname,
          query: {
            transactionType: isExecuted ? 'pending' : 'executed',
          },
        })}
      >
        {t(translations.transactions.viewTxn, {
          type: isExecuted
            ? t(translations.transactions.pending)
            : t(translations.transactions.executed),
        })}
      </Link>
    );
  } else {
    return null;
  }
};

const StyledTableHeaderWrapper = styled.div`
  .table-header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;

    ${media.s} {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .table-title-tip-total {
      margin: 0.3571rem 0;
    }

    .table-title-button-fold {
      display: flex;
      align-items: center;
    }

    .table-title-filter-wrapper {
      display: flex;
    }

    .table-title-extra-content {
      flex-grow: 1;
    }
  }
  .table-header-bottom {
    margin-top: 16px;
    border-top: 1px solid #e8e9ea;
    padding: 8px 16px 0;
    margin-bottom: -12px;
  }
`;

// @remove content, should be removed after 2 sprint, backup date: 2021.8.18, start >>>
export const TxnSwitcherBak = ({
  total = 0,
  isAccount = false,
}: TxnSwitcherProps) => {
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();

  const { transactionType } = qs.parse(location.search);

  const handleClick = type => {
    history.push(
      qs.stringifyUrl({
        url: location.pathname,
        query: {
          transactionType: type,
        },
      }),
    );
  };

  const type = transactionType || 'executed';

  const tip =
    type === 'executed'
      ? t(translations.transactions.executedTotal, {
          total: toThousands(total),
        })
      : total > 10
      ? t(translations.transactions.pendingTotal, {
          total: toThousands(total),
        })
      : t(translations.transactions.pendingTotalLt10, {
          total: toThousands(total),
        });

  return (
    <StyledTxnSwitcherWrapperBak>
      <div
        className={clsx('txn-switcher-button', {
          active: type === 'executed',
        })}
        onClick={() => handleClick('executed')}
      >
        {t(translations.transactions.executed)}
      </div>
      {isAccount ? (
        <div
          className={clsx('txn-switcher-button', {
            active: type === 'pending',
          })}
          onClick={() => handleClick('pending')}
        >
          {t(translations.transactions.pending)}
        </div>
      ) : null}
      <div className="txn-switcher-tip">{tip}</div>
    </StyledTxnSwitcherWrapperBak>
  );
};

const StyledTxnSwitcherWrapperBak = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 0.3571rem 0;

  .txn-switcher-button {
    border-radius: 1.1429rem;
    padding: 0 1rem;
    height: 1.8571rem;
    line-height: 1.8571rem;
    border: none;
    background-color: #f5f8ff;
    margin-right: 0.7143rem;
    cursor: pointer;

    &:hover,
    &:active {
      color: #ffffff;
      background-color: rgba(0, 84, 254, 0.8);
    }

    &.active {
      color: #ffffff;
      background-color: rgba(0, 84, 254, 0.8);
    }
  }

  ${media.s} {
    .txn-switcher-tip {
      margin-top: 0.5714rem;
    }
  }
`;
// @remove content, should be removed after 2 sprint, backup date: 2021.8.18, end <<<
