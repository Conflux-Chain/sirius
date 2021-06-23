/**
 *
 * Header Search
 *
 */
import React, { useState } from 'react';
import styled from 'styled-components';

import { Translation, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useBreakpoint } from 'styles/media';
import { useSearch } from 'utils/hooks/useSearch';
import { AutoComplete, Input, SelectProps } from '@jnoodle/antd';
import { SearchIcon } from '../../../components/SearchIcon/Loadable';
import ClearIcon from '../../../../images/clear.png';
import { defaultTokenIcon } from '../../../../constants';
import { formatAddress } from '../../../../utils/cfx';
import _ from 'lodash';
import fetch from 'utils/request';
import {
  isAccountAddress,
  isEpochNumber,
  isHash,
  isInnerContractAddress,
  isSpecialAddress,
} from '../../../../utils';
import { appendApiPrefix } from '../../../../utils/api';
import { cfxTokenTypes } from '../../../../utils/constants';

const { Search: SearchInput } = Input;

const TokenItemWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  > img {
    width: 24px;
    height: 24px;
    margin-top: 4px;
    margin-right: 10px;
  }

  > span {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    font-size: 12px;

    .title {
      font-size: 14px;
    }

    .address,
    .website {
      color: #6c6d75;
    }

    .holders {
      position: absolute;
      right: 10px;
      top: 50%;
      margin-top: -11px;
    }

    .tag {
      color: #6c6d75;
      padding: 1px 5px;
      font-size: 12px;
      background-color: #f9f9f9;
      border: 1px solid #e8e8e8;
      border-radius: 3px;
    }
  }
`;

const searchResult = (list: any[], notAvailable = '-', type = 'token') =>
  list.map(l => {
    const token = {
      ...l,
      icon: l.icon || defaultTokenIcon,
      name: l.name || notAvailable,
    };
    return {
      key: `${type}-${formatAddress(token.address)}`,
      // add type prefix for duplicate value with different type
      value: `${type}-${formatAddress(token.address)}`,
      type,
      label: (
        <TokenItemWrapper
          onClick={() => {
            window.location.href = `/${
              type === 'token' ? 'token' : 'address'
            }/${formatAddress(token.address)}`;
          }}
        >
          {type === 'token' && (
            <img src={token?.icon || defaultTokenIcon} alt="icon" />
          )}
          <span>
            <Translation>
              {t => (
                <>
                  <div className="title">
                    {token?.name}
                    {token?.symbol ? ` (${token.symbol}) ` : ' '}
                    {token?.transferType && (
                      <span className="tag">
                        {token?.transferType.replace('ERC', 'CRC')}
                      </span>
                    )}
                  </div>
                  {token?.address ? (
                    <div className="address">{token?.address}</div>
                  ) : null}
                  {/*{token?.website ? (*/}
                  {/*  <div className="website">{token?.website}</div>*/}
                  {/*) : null}*/}
                  {token?.holderCount &&
                  token?.transferType !== cfxTokenTypes.erc1155 ? (
                    <div className="holders">
                      {token?.holderCount}{' '}
                      {t(translations.tokens.table.holders)}
                    </div>
                  ) : null}
                </>
              )}
            </Translation>
          </span>
        </TokenItemWrapper>
      ),
    };
  });

let controller = new AbortController();

export const Search = () => {
  const { t } = useTranslation();
  const bp = useBreakpoint();
  const [, setSearch] = useSearch();
  const [options, setOptions] = useState<SelectProps<object>['options']>([]);
  const [autoCompleteValue, setAutoCompleteValue] = useState('');

  const notAvailable = t(translations.general.notAvailable);

  const handleSearch = (value: string) => {
    if (
      value &&
      value.length > 1 &&
      !(
        value === '0x0' ||
        isAccountAddress(value) ||
        // isContractAddress(value) ||
        isInnerContractAddress(value) ||
        isSpecialAddress(value) ||
        isEpochNumber(value) ||
        isHash(value)
      )
    ) {
      // abort pre search
      controller.abort();

      controller = new AbortController();

      fetch(appendApiPrefix('/stat/tokens/name?name=' + value), {
        signal: controller.signal,
      })
        .then(res => {
          if (res) {
            const options: any = [];
            if (res.list && res.list.length > 0)
              options.push({
                label: (
                  <LabelWrapper>
                    {t(translations.header.search.tokens)}
                  </LabelWrapper>
                ),
                options: searchResult(res.list, notAvailable, 'token'),
              });
            if (res.contractList && res.contractList.length > 0)
              options.push({
                label: (
                  <LabelWrapper>
                    {t(translations.header.search.contracts)}
                    {res.contractList.length > 10
                      ? ` (${t(translations.header.search.contractsTip)})`
                      : null}
                  </LabelWrapper>
                ),
                options: searchResult(
                  res.contractList.length > 10
                    ? res.contractList.slice(0, 10)
                    : res.contractList,
                  notAvailable,
                  'contract',
                ),
              });
            setOptions(options);
          } else {
            setOptions([]);
          }
        })
        .catch(e => {
          if (e.name !== 'AbortError') {
            console.error(e);
          }
        });
    } else {
      setOptions([]);
    }
  };

  const onSelect = (value: string, option?: any) => {
    if (option && option.type) {
      const address = value.replace(option.type + '-', '');
      setAutoCompleteValue('');
      // @ts-ignore
      window.location =
        window.location.origin +
        `/${option.type === 'token' ? 'token' : 'address'}/${address}`;
    } else {
      setSearch(value);
      setAutoCompleteValue('');
    }
  };

  return (
    <Container className="header-search-container">
      <AutoComplete
        style={{
          width: '100%',
        }}
        options={options}
        value={autoCompleteValue}
        onChange={v => {
          setAutoCompleteValue(v);
        }}
        // open={true}
        onSelect={onSelect}
        onSearch={_.debounce(handleSearch, 500)}
        dropdownClassName="header-search-dropdown"
      >
        <SearchInput
          allowClear
          onSearch={value => {
            onSelect(value);
          }}
          placeholder={
            bp === 's'
              ? t(translations.header.searchPlaceHolderMobile)
              : t(translations.header.searchPlaceHolder)
          }
          enterButton={<SearchIcon color="#fff" />}
        />
      </AutoComplete>
    </Container>
  );
};

const LabelWrapper = styled.div`
  background-color: #f9f9f9;
  border-radius: 3px;
  padding: 3px 10px;
  color: #1a1a1a;
`;

const Container = styled.div`
  flex-grow: 1;
  padding: 0 1.5rem;

  // override antd style
  .ant-input-search .ant-input-group .ant-input-affix-wrapper:not(:last-child) {
    border-radius: 16px;
  }

  .ant-input-affix-wrapper {
    border-color: #b6bad2;
    padding-left: 16px;
    padding-right: 16px;
    font-size: 12px;
    color: #333;
    box-shadow: none !important;
    &:hover,
    &:focus {
      border-color: #424a71;
      box-shadow: none !important;
    }
  }
  .ant-input-affix-wrapper-focused {
    border-color: #424a71;
  }

  .ant-input {
    &::placeholder {
      color: rgba(51, 51, 51, 0.6);
    }
    &:hover,
    &:focus {
      border-color: #424a71;
    }
  }

  .ant-input-group-addon {
    position: absolute;
    right: 50px;
    top: 0;
    left: auto !important;
    width: 0;
  }

  .ant-input-search-button {
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    background: #424a71;
    border-radius: 16px !important;
    width: 50px;
    z-index: 5;

    &:hover {
      border: none;
      outline: none;
      background: #68719c;
    }
    svg {
      fill: #fff;
    }
  }
  .ant-input-suffix {
    margin-right: 40px;
    border: none;

    .ant-input-clear-icon-hidden {
      display: none;
    }

    .anticon {
      width: 24px;
      height: 100%;
      background: url(${ClearIcon}) no-repeat center center;
      background-size: 16px 16px;
      opacity: 0.6;
      &:hover {
        opacity: 1;
      }
      svg {
        display: none;
      }
    }
  }
`;
