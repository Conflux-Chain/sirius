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

interface FooterProps {
  readonly type?: string;
  readonly pathname: string;
}

interface QueryProps {
  [index: string]: string;
}

interface SearchInputQueryProps {
  accountAddress?: string;
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
  readonly address: string;
  readonly total: number;
  readonly showDatepicker?: boolean;
  readonly showTotalTip?: boolean;
  readonly showFilter?: boolean;
  readonly showSearchInput?: boolean;
  readonly filterOptions?: Array<any>; // ['txTypeAll', 'txTypeOutgoing', 'txTypeIncoming', 'status1', 'txTypeCreate']
  readonly searchInputOptions?: SearchInputProps; // ['txTypeAll', 'txTypeOutgoing', 'txTypeIncoming', 'status1', 'txTypeCreate']
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
      address,
      transactionHash,
      blockHash,
      tokenId,
      epoch,
      ...others
    } = qs.parse(location.search);

    let inputValue =
      accountAddress ||
      address ||
      transactionHash ||
      blockHash ||
      tokenId ||
      epoch;

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
          object.accountAddress = str;
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
  showDatepicker,
  showTotalTip,
  showFilter,
  showSearchInput,
  filterOptions = [],
  searchInputOptions,
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
      <div className="table-title-tip-total">{getTotalTip}</div>
      <FilterWrap>
        {getSearchInput}
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
  searchInputOptions: {
    type: 'txn',
    addressType: 'user',
    inputFields: [],
  },
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

  ${media.s} {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .table-title-tip-total {
    margin-bottom: 5px;
  }
`;

const FilterWrap = styled.div`
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
