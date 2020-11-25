/**
 * TokenDetail
 */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Input, useMessages } from '@cfxjs/react-ui';
import { Search } from '@geist-ui/react-icons';
import { isAddress, isHash } from '../../../utils';
import { formatBalance } from '../../../utils';
import { useBalance } from '@cfxjs/react-hooks';
import 'utils/lazyJSSDK';

interface FilterProps {
  filter: string;
  tokenAddress: string;
  symbol: string;
  decimals: number;
  onFilter: (value: string) => void;
}

interface Query {
  accountAddress?: string;
  transactionHash?: string;
}

export const Filter = ({
  filter,
  tokenAddress,
  symbol,
  decimals,
  onFilter,
}: FilterProps) => {
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [messages, setMessage] = useMessages();
  const [value, setValue] = useState(filter);

  const tokenAddrs = [tokenAddress];
  let addr: null | string = null;
  if (isAddress(filter)) {
    addr = filter;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [balance, [tokenBalanceRaw]] = useBalance(addr, tokenAddrs);
  const tokenBalance = formatBalance(tokenBalanceRaw || '0', decimals);

  useEffect(() => {
    setValue(filter);
  }, [filter]);

  const onIconClick = () => {
    if (value === '') {
      return;
    }
    if (!isAddress(value) && !isHash(value)) {
      setMessage({
        text: t(translations.token.transferList.searchError),
      });
      return;
    }
    if (value !== filter) {
      onFilter(value);
    }
  };

  const onClearClick = () => {
    if (filter !== '') {
      onFilter('');
    } else {
      setValue('');
    }
  };

  return (
    <FilterWrap>
      <Input
        iconClickable
        clearable
        value={value}
        placeholder={t(translations.token.transferList.searchPlaceHolder)}
        onChange={e => setValue(e.target.value)}
        onIconClick={onIconClick}
        onKeyPress={e => {
          if (e.key === 'Enter') onIconClick();
        }}
        onClearClick={onClearClick}
        icon={<Search />}
      />
      {tokenBalance !== '0' && (
        <BalanceWrap>{`${t(
          translations.token.transferList.balance,
        )}${tokenBalance}${symbol}`}</BalanceWrap>
      )}
    </FilterWrap>
  );
};

const FilterWrap = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.2857rem 1.1429rem;
  background: rgba(0, 84, 254, 0.04);
  border-radius: 0.1429rem;
  display: flex;
  align-items: center;
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
