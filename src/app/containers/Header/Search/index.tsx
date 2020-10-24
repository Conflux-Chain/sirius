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
import { media, useBreakpoint } from 'styles/media';
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
  const bp = useBreakpoint();
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
        history.push(`/block/${inputValue}`);
        return;
      }

      if (isHash(inputValue as string)) {
        history.push(`/transaction/${inputValue}`);
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
        placeholder={
          bp === 'm'
            ? t(translations.header.searchPlaceHolderMobile)
            : t(translations.header.searchPlaceHolder)
        }
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
    max-width: unset;
    left: 20rem;
    right: 5rem;
    position: fixed;
    top: 0.68rem;
    z-index: 2000;
    padding: 0;
    flex-grow: 0;

    .header-search-bar.input-container {
      height: 2.67rem;
      .input-wrapper {
        background-color: rgba(0, 84, 254, 0.04);
        border: 0;
        input {
          ::placeholder {
            color: #222a44;
            text-aight: end;
          }
        }
      }
    }
  }

  ${media.s} {
    position: absolute;
    left: 1.33rem;
    right: 1.33rem;
    top: 5.67rem;
    z-index: 100;
  }
`;
