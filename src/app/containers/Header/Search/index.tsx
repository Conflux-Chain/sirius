/**
 *
 * Search
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
import { Logo as SearchIcon } from './Logo';
import { Input } from '@cfxjs/react-ui';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { media } from 'styles/media';

export function Search() {
  const { t } = useTranslation();

  return (
    <Outer>
      <Input
        width="100%"
        color="primary"
        iconRight={<SearchIcon />}
        placeholder={t(translations.header.searchPlaceHolder)}
        className="header-search-bar"
      />
    </Outer>
  );
}

const Outer = styled.div`
  max-width: 40rem;
  flex-grow: 1;
  .header-search-bar.input-container {
    height: 2.28rem;
    .input-wrapper {
      border-radius: 1.14rem;
      border-color: #0054fe;
      input {
        ::placeholder {
          color: #20253a;
        }
      }
    }
  }
  ${media.s} {
    display: none;
  }
`;
