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

export const Search = () => {
  const { t } = useTranslation();
  const [focused, setFocused] = useState(false);

  return (
    <Outer>
      <Input
        clearable
        width="100%"
        color="primary"
        icon={focused && <SearchIcon />}
        iconRight={!focused && <SearchIcon />}
        placeholder={t(translations.header.searchPlaceHolder)}
        className="header-search-bar"
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
