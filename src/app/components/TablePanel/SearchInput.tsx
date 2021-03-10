/**
 * TokenDetail
 */
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components/macro';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useMessages } from '@cfxjs/react-ui';
import { isAddress, isHash, tranferToLowerCase, formatBalance } from 'utils';
import { useBalance } from '@cfxjs/react-hooks';
import 'utils/lazyJSSDK';
import { Search as SearchComp } from '../Search/Loadable';
import { cfxTokenTypes, zeroAddress } from 'utils/constants';
import { ActionButton } from '../../components/ActionButton';
import { useClickAway } from '@cfxjs/react-ui';
import { media, useBreakpoint } from '../../../styles/media';

import imgSearch from 'images/search.svg';

interface FilterProps {
  filter: string;
  tokenAddress: string;
  transferType: string;
  symbol: string;
  decimals: number;
  onFilter: (value: string) => void;
  placeholder: string;
}

interface Query {
  accountAddress?: string;
  transactionHash?: string;
}

// @todo extract to common search component with mobile compatible
export const TableSearchInput = ({
  filter,
  tokenAddress,
  transferType,
  symbol,
  decimals,
  onFilter,
  placeholder,
}: FilterProps) => {
  const { t } = useTranslation();
  const bp = useBreakpoint();
  const [, setMessage] = useMessages();
  const lFilter = tranferToLowerCase(filter);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [value, setValue] = useState(lFilter);
  const [visible, setVisible] = useState<boolean>(false);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  useClickAway(inputRef, () => visible && setVisible(false));

  useEffect(() => {
    setValue(lFilter);
  }, [lFilter]);

  let addr: null | string = null;
  if (isAddress(lFilter)) {
    addr = lFilter;
  }

  const tokenAddrs = [tokenAddress];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, [tokenBalanceRaw]] = useBalance(addr, tokenAddrs);
  const tokenBalance = formatBalance(tokenBalanceRaw || '0', decimals);

  const onEnterPress = () => {
    if (value === '') {
      return;
    }
    // deal with zero address
    if (value === '0x0') {
      setValue(zeroAddress);
      if (zeroAddress !== lFilter) {
        onFilter(zeroAddress);
      }
      return;
    }

    if (
      !isAddress(value) &&
      !isHash(value) &&
      !(transferType !== cfxTokenTypes.erc20 && _.isInteger(+value))
    ) {
      setMessage({
        text: t(translations.token.transferList.searchError),
      });
      return;
    }
    if (value !== lFilter) {
      onFilter(value);
    }
  };

  // clear search box need to reset search result
  const onClear = () => {
    onFilter('');
  };

  return (
    <FilterWrap>
      {bp === 's' && (
        <ActionButton
          onClick={() => setVisible(!visible)}
          ref={filterButtonRef}
        >
          <img
            src={imgSearch}
            alt="alarm icon"
            className="mobile-icon-search"
          ></img>
        </ActionButton>
      )}
      {(bp !== 's' || visible) && (
        <div ref={inputRef}>
          <SearchComp
            outerClassname="outerContainer"
            inputClassname="transfer-search"
            iconColor="#74798C"
            placeholderText={placeholder}
            onEnterPress={onEnterPress}
            onChange={val => setValue(tranferToLowerCase(val))}
            onClear={onClear}
            val={value}
          />
          {transferType === cfxTokenTypes.erc20 &&
            tokenBalance !== '0' &&
            symbol && (
              <BalanceWrap>
                {`${t(
                  translations.token.transferList.balance,
                )}${tokenBalance} ${symbol}`}{' '}
              </BalanceWrap>
            )}
        </div>
      )}
    </FilterWrap>
  );
};

const FilterWrap = styled.div`
  display: flex;
  margin-right: 0.7143rem;

  .outerContainer {
    flex-grow: 1;
    width: 18rem;

    .transfer-search.input-container {
      height: 2.28rem;
      .input-wrapper {
        border: none;
        border-radius: 1.14rem;
        background: rgba(0, 84, 254, 0.04);
        input {
          color: #74798c;
          ::placeholder {
            color: rgba(116, 121, 140, 0.6);
            font-size: 12px;
          }
        }
        &.hover {
          background-color: rgba(0, 84, 254, 0.1);
          input {
            color: #74798c;
          }
        }
        &.focus {
          input {
            color: #74798c;
          }
        }
      }
    }

    ${media.s} {
      width: 14rem;
    }
  }

  .mobile-icon-search {
    width: 14px;
  }
`;

const BalanceWrap = styled.div`
  background-color: #4b5fe3;
  border-radius: 1.1429rem;
  height: 1.7143rem;
  color: #fff;
  padding: 0.2857rem 1.7143rem;
  margin-left: 1.2857rem;
  white-space: nowrap;
  display: flex;
  align-items: center;
`;
