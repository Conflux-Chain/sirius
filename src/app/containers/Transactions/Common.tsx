import React, { useMemo } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { media } from 'styles/media';
import {
  TableSearchDatepicker,
  TableSearchDropdown,
  TableSearchInput,
} from 'app/components/TablePanel';
import {
  toThousands,
  // isAccountAddress,
  isContractAddress,
  isInnerContractAddress,
  isAddress,
  isHash,
} from 'utils';
import { DownloadCSV } from 'app/components/DownloadCSV/Loadable';
import qs from 'query-string';
import { useParams } from 'react-router-dom';
import lodash from 'lodash';
import { useMessages } from '@cfxjs/react-ui';
import { useHistory, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { TitleTotal } from 'app/components/TablePanelNew';

interface FooterProps {
  type?: string;
  pathname: string;
}

interface QueryProps {
  [index: string]: string;
}

interface SearchInputQueryProps {
  accountAddress?: string;
  opponentAddress?: string;
  address?: string;
  transactionHash?: string;
  blockHash?: string;
  tokenId?: string;
  epochNumber?: string;
}

interface SearchInputProps {
  type?: 'txn' | 'crc20' | 'crc721' | 'crc1155' | 'minedBlock' | 'cfxTxn';
  inputFields?: Array<
    'blockHash' | 'txnHash' | 'address' | 'tokenID' | 'epoch' | 'accountAddress'
  >;
  addressType?: 'user' | 'contract';
}

interface TitleProps {
  address: string;
  total: number;
  listLimit?: number;
  showDatepicker?: boolean;
  showTotalTip?: boolean;
  showFilter?: boolean;
  showSearchInput?: boolean;
  filterOptions?: Array<any>; // ['txTypeAll', 'txTypeOutgoing', 'txTypeIncoming', 'status1', 'txTypeCreate']
  searchInputOptions?: SearchInputProps; // ['txTypeAll', 'txTypeOutgoing', 'txTypeIncoming', 'status1', 'txTypeCreate']
}

// accountAddress - user address
// address - contract address

// inputFields: ['blockHash', 'txnHash', 'address', 'tokenId', 'epochNumber']
// type: txn, crc20, crc721, crc1155, minedBlock, cfxTxn
const SearchInput = React.memo(
  ({
    type = 'txn',
    inputFields = [],
  }: // addressType = 'user',
  SearchInputProps) => {
    const [, setMessage] = useMessages();
    const location = useLocation();
    const history = useHistory();
    const { t } = useTranslation();

    const {
      accountAddress,
      opponentAddress,
      address,
      transactionHash,
      blockHash,
      tokenId,
      epochNumber,
      ...others
    } = qs.parse(location.search);

    let inputValue =
      accountAddress ||
      opponentAddress ||
      address ||
      transactionHash ||
      blockHash ||
      tokenId ||
      epochNumber;

    const placeholder = useMemo(() => {
      const len = inputFields.length;
      return inputFields
        .map((i, index) => {
          return (
            t(translations.general.searchInputPlaceholder[i]) +
            (index === len - 1 ? '' : ' / ')
          );
        })
        .join('');
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSearch = (str: string) => {
      let object: SearchInputQueryProps = {};

      if (str) {
        if (type === 'txn') {
          // /transaction api always need a accountAddress param
          object.accountAddress = accountAddress as string;
        }

        if (isAddress(str)) {
          object.opponentAddress = str;
          // if (type === 'txn') {
          //   object.accountAddress = str;
          // } else if (isContractAddress(str) || isInnerContractAddress(str)) {
          //   object.address = str;
          // } else {
          //   object.accountAddress = str;
          // }
        } else if (isHash(str)) {
          if (type === 'minedBlock') {
            object.blockHash = str;
          } else {
            object.transactionHash = str;
          }
        } else if (lodash.isInteger(+str)) {
          if (['crc721', 'crc1155'].includes(type)) {
            object.tokenId = str;
          } else if (type === 'minedBlock') {
            object.epochNumber = str;
            // @ts-ignore
            // object.miner = '';
          } else {
            setMessage({
              text: t(translations.token.transferList.searchError),
            });
            return;
          }
        } else {
          setMessage({
            text: t(translations.token.transferList.searchError),
          });
          return;
        }
      }

      const urlWithQuery = qs.stringifyUrl({
        url: location.pathname,
        query: {
          ...others,
          ...object,
          skip: '0',
        },
      });
      history.push(urlWithQuery);
    };

    return (
      <TableSearchInput
        onFilter={onSearch}
        filter={inputValue as string}
        placeholder={placeholder}
      />
    );
  },
);

export const Title = ({
  address,
  total,
  listLimit,
  showDatepicker,
  showTotalTip,
  showFilter,
  showSearchInput,
  filterOptions = [],
  searchInputOptions,
}: Readonly<TitleProps>) => {
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

  const getSearchInput = useMemo(() => {
    return showSearchInput ? <SearchInput {...searchInputOptions} /> : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSearchInput]);

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
    return showTotalTip ? (
      <TitleTotal total={total} listLimit={listLimit || total}></TitleTotal>
    ) : // ? t(
    //     total > 10000
    //       ? translations.general.totalRecordLimit
    //       : translations.general.totalRecord,
    //     {
    //       total: toThousands(total),
    //     },
    //   )
    null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, listLimit]);

  return (
    <StyledTableHeaderWrapper>
      <div className="table-title-tip-total">{getTotalTip}</div>
      <StyledFilterWrapper>
        {getSearchInput}
        {getSearchDatepicker}
        {getSearchFilter}
      </StyledFilterWrapper>
    </StyledTableHeaderWrapper>
  );
};
Title.defaultProps = {
  address: '',
  total: 0,
  listLimit: 0,
  showDatepicker: false,
  showTotalTip: true,
  showFilter: false,
  showSearchInput: false,
  filterOptions: [],
  searchInputOptions: {
    type: 'txn',
    addressType: 'user',
    inputFields: [],
  },
};

export const Footer = ({ pathname, type }: Readonly<FooterProps>) => {
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

interface TxnSwitcherProps {
  total: number;
  isAccount?: boolean;
}

export const TxnSwitcher = ({
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
      ? t(translations.general.totalRecord, {
          total: toThousands(total),
        })
      : total > 10
      ? t(translations.transactions.pendingTotal, {
          total: toThousands(total),
        })
      : t(translations.general.totalRecord, {
          total: toThousands(total),
        });

  return (
    <StyledTxnSwitcherWrapper>
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
    </StyledTxnSwitcherWrapper>
  );
};

const StyledTableHeaderWrapper = styled.div`
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
`;

const StyledFilterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 200;

  ${media.s} {
    flex-direction: row;
    align-items: flex-start;
    right: unset;
    left: 0;
    top: 7rem;
    z-index: 10;
  }
`;

const StyledTxnSwitcherWrapper = styled.div`
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
