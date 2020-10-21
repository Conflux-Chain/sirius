/**
 *
 * Search
 *
 */
import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { Logo as SearchIcon } from './Logo';
import { Input } from '@cfxjs/react-ui';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { media } from 'styles/media';
import { useHistory } from 'react-router';
import {
  isAccountAddress,
  isContractAddress,
  isBlockHash,
  isHash,
  isEpochNumber,
} from 'utils/util';

export const Search = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [focused, setFocused] = useState(false);
  const { ref: inputRef, getValue: getInputValue } = Input.useInputHandle();
  const onEnterPress = () => {
    let inputValue = getInputValue();
    if (typeof inputValue !== 'string') return;
    inputValue = inputValue.trim();

    if (inputValue === '') return;

    if (isContractAddress(inputValue) || isAccountAddress(inputValue)) {
      history.push(`/address/${inputValue}`);
      return;
    }

    if (isEpochNumber(inputValue)) {
      history.push(`/epochs/${inputValue}`);
      return;
    }

    isBlockHash(inputValue).then(isBlock => {
      if (isBlock) {
        history.push(`/blocks/${inputValue}`);
        return;
      }

      if (isHash(inputValue as string)) {
        history.push(`/transactions/${inputValue}`);
        return;
      }

      history.push('/404');
      return;
    });
  };

  return (
    <Outer>
      <Input
        clearable
        ref={inputRef}
        width="100%"
        color="primary"
        icon={focused && <SearchIcon />}
        iconRight={!focused && <SearchIcon />}
        placeholder={t(translations.header.searchPlaceHolder)}
        className="header-search-bar"
        onKeyPress={e => {
          if (e.key === 'Enter') onEnterPress();
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </Outer>
  );
};

const Outer = styled.div`
  max-width: 40rem;
  flex-grow: 1;
  padding: 0 1.5rem;
  .header-search-bar.input-container {
    height: 2.28rem;
    .input-wrapper {
      border-radius: 1.14rem;
      border-color: #1e3de4;
      input {
        ::placeholder {
          color: #333333;
        }
      }
    }
  }
  ${media.m} {
    display: none;
  }
`;
