/**
 *
 * Header Search
 *
 */
import React from 'react';
import styled from 'styled-components/macro';

import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useBreakpoint } from 'styles/media';
import { useSearch } from 'utils/hooks/useSearch';
import { Input } from '@jnoodle/antd';
import { SearchIcon } from '../../../components/SearchIcon/Loadable';
import ClearIcon from '../../../../images/clear.png';

const { Search: SearchInput } = Input;

export const Search = () => {
  const { t } = useTranslation();
  const bp = useBreakpoint();
  const [, setSearch] = useSearch();

  const onEnterPress = value => {
    setSearch(value);
  };

  return (
    <Container className="header-search-container">
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
    </Container>
  );
};

const Container = styled.div`
  flex-grow: 1;
  padding: 0px 1.5rem;

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
