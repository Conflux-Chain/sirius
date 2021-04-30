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
import { Link } from '../../../components/Link/Loadable';
import { formatAddress } from '../../../../utils/cfx';
import { useHistory } from 'react-router-dom';

const { Search: SearchInput } = Input;

function getRandomInt(max: number, min: number = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min; // eslint-disable-line no-mixed-operators
}
const searchResult = (query: string) =>
  new Array(getRandomInt(10))
    .join('.')
    .split('.')
    .map((_, idx) => {
      const token = {
        address: 'cfx:achc8nxj7r451c223m18w2dwjnmhkd6rxawrvkvsy2',
        icon:
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xNTAgMzAwQzIzMi44NDMgMzAwIDMwMCAyMzIuODQzIDMwMCAxNTBDMzAwIDY3LjE1NzMgMjMyLjg0MyAwIDE1MCAwQzY3LjE1NzMgMCAwIDY3LjE1NzMgMCAxNTBDMCAyMzIuODQzIDY3LjE1NzMgMzAwIDE1MCAzMDBaIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXIpIi8+CjxwYXRoIGQ9Ik0yMDUuNDk5IDIzNC4xOTlIMTMyLjc5OUMxMjYuMDk5IDIzNC4xOTkgMTIwLjY5OSAyMjguNzk5IDEyMC42OTkgMjIyLjA5OUMxMjAuNjk5IDIxNS4zOTkgMTI2LjA5OSAyMDkuOTk5IDEzMi43OTkgMjA5Ljk5OUgxOTguNDk5TDIyNy44OTkgMTU5LjA5OUwxOTQuOTk5IDEwMi4xOTlDMTkxLjY5OSA5Ni4zOTkzIDE5My41OTkgODguOTk5MyAxOTkuMzk5IDg1LjU5OTNDMjA1LjE5OSA4Mi4yOTkzIDIxMi41OTkgODQuMTk5MyAyMTUuOTk5IDg5Ljk5OTNMMjUyLjM5OSAxNTIuOTk5QzI1NC41OTkgMTU2Ljc5OSAyNTQuNTk5IDE2MS4zOTkgMjUyLjM5OSAxNjUuMDk5TDIxNS45OTkgMjI4LjA5OUMyMTMuNzk5IDIzMS44OTkgMjA5Ljc5OSAyMzQuMTk5IDIwNS40OTkgMjM0LjE5OVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNjcuMiA2NS44MDA4SDk0LjVDOTAuMiA2NS44MDA4IDg2LjIgNjguMTAwOCA4NCA3MS45MDA4TDQ3LjYgMTM0LjkwMVYxMzUuMDAxQzQ3LjQgMTM1LjQwMSA0Ny4xIDEzNS45MDEgNDYuOSAxMzYuMzAxVjEzNi40MDFDNDYuNyAxMzYuODAxIDQ2LjYgMTM3LjIwMSA0Ni41IDEzNy43MDFDNDYuNSAxMzcuODAxIDQ2LjQgMTM3LjkwMSA0Ni40IDEzOC4xMDFDNDYuMyAxMzguNTAxIDQ2LjIgMTM4LjgwMSA0Ni4yIDEzOS4yMDFDNDYuMiAxMzkuMzAxIDQ2LjIgMTM5LjQwMSA0Ni4xIDEzOS42MDFDNDYgMTQwLjEwMSA0NiAxNDAuNjAxIDQ2IDE0MS4wMDFDNDYgMTQxLjUwMSA0NiAxNDIuMDAxIDQ2LjEgMTQyLjQwMUM0Ni4xIDE0Mi41MDEgNDYuMSAxNDIuNjAxIDQ2LjIgMTQyLjgwMUM0Ni4zIDE0My4yMDEgNDYuMyAxNDMuNTAxIDQ2LjQgMTQzLjkwMUM0Ni40IDE0NC4wMDEgNDYuNSAxNDQuMTAxIDQ2LjUgMTQ0LjMwMUM0Ni42IDE0NC43MDEgNDYuOCAxNDUuMjAxIDQ2LjkgMTQ1LjYwMVYxNDUuNzAxQzQ3LjEgMTQ2LjIwMSA0Ny4zIDE0Ni42MDEgNDcuNiAxNDcuMDAxVjE0Ny4xMDFMODQgMjEwLjAwMUM4Ni4yIDIxMy45MDEgOTAuMyAyMTYuMTAxIDk0LjUgMjE2LjEwMUM5Ni42IDIxNi4xMDEgOTguNiAyMTUuNjAxIDEwMC41IDIxNC41MDFDMTA2LjMgMjExLjIwMSAxMDguMyAyMDMuNzAxIDEwNC45IDE5Ny45MDFMNzkuMSAxNTMuMDAxSDEzMC44QzEzNy41IDE1My4wMDEgMTQyLjkgMTQ3LjYwMSAxNDIuOSAxNDAuOTAxQzE0Mi45IDEzNC4yMDEgMTM3LjUgMTI4LjgwMSAxMzAuOCAxMjguODAxSDc5LjFMMTAxLjUgOTAuMDAwOEgxNjcuMkMxNzMuOSA5MC4wMDA4IDE3OS4zIDg0LjYwMDggMTc5LjMgNzcuOTAwOEMxNzkuMyA3MS4yMDA4IDE3My45IDY1LjgwMDggMTY3LjIgNjUuODAwOFoiIGZpbGw9IiMxRjFGMUYiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhciIgeDE9IjY0Ljg1MjgiIHkxPSIyOS40MjY2IiB4Mj0iMjMzLjgxNCIgeTI9IjI2OC42ODYiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzE0RjBDRiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4MjhDRkYiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K',
        name: 'FansCoin',
        website: 'https://moondex.io/trade/fcusdt',
        symbol: 'FC',
        totalPrice: '22660822.033596000000000000',
        transferType: 'ERC20',
      };
      return {
        value: formatAddress(token.address),
        label: (
          <TokenItemWrapper>
            <img src={token?.icon || defaultTokenIcon} alt="token icon" />
            <Link href={`/token/${formatAddress(token.address)}`}>
              <Translation>
                {t => (
                  <>
                    <div className="title">
                      {token?.name} ({token?.symbol}){' '}
                      <span className="tag">
                        {token?.transferType.replace('ERC', 'CRC')}
                      </span>
                    </div>
                    {token?.address ? (
                      <div className="address">{token?.address}</div>
                    ) : null}
                    {token?.website ? (
                      <div className="website">{token?.website}</div>
                    ) : null}
                  </>
                )}
              </Translation>
            </Link>
          </TokenItemWrapper>
        ),
      };
    });

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

  > a {
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

export const Search = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const bp = useBreakpoint();
  const [, setSearch] = useSearch();
  const [options, setOptions] = useState<SelectProps<object>['options']>([]);

  const onEnterPress = value => {
    setSearch(value);
  };

  const handleSearch = (value: string) => {
    if (value) {
      setOptions([
        {
          label: <LabelWrapper>{t(translations.header.tokens)}</LabelWrapper>,
          options: searchResult(value),
        },
      ]);
    }
  };

  const onSelect = (value: string) => {
    console.log('onSelect', value);
    history.push(`/token/${value}`);
  };

  return (
    <Container className="header-search-container">
      <AutoComplete
        style={{
          width: '100%',
        }}
        options={options}
        onSelect={onSelect}
        onSearch={handleSearch}
      >
        <SearchInput
          allowClear
          onSearch={value => {
            onEnterPress(value);
          }}
          placeholder={
            bp === 's'
              ? t(translations.header.searchPlaceHolderMobile)
              : t(translations.header.searchPlaceHolder)
          }
          onPressEnter={e => {
            onEnterPress(e.currentTarget.value);
          }}
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
