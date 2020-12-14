/**
 *
 * Search
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
import { Search as SearchComp } from '../../../components/Search/Loadable';

import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { media, useBreakpoint } from 'styles/media';
import { useHistory } from 'react-router';
import {
  isAccountAddress,
  isContractAddress,
  isInnerContractAddress,
  isBlockHash,
  isHash,
  isEpochNumber,
  tranferToLowerCase,
} from 'utils';

export const Search = () => {
  const { t } = useTranslation();
  const bp = useBreakpoint();
  const history = useHistory();
  const onEnterPress = (e, value) => {
    let inputValue = value;
    if (typeof inputValue !== 'string') return;
    if (inputValue === '') return;
    inputValue = tranferToLowerCase(inputValue.trim());
    if (
      isContractAddress(inputValue) ||
      isAccountAddress(inputValue) ||
      isInnerContractAddress(inputValue)
    ) {
      history.push(`/address/${inputValue}`);
      return;
    }

    if (isEpochNumber(inputValue)) {
      history.push(`/epoch/${inputValue}`);
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
    <Container>
      <SearchComp
        outerClassname="outerContainer"
        inputClassname="header-search-bar"
        iconColor="#0054FE"
        placeholderText={
          bp === 'm'
            ? t(translations.header.searchPlaceHolderMobile)
            : t(translations.header.searchPlaceHolder)
        }
        onEnterPress={onEnterPress}
      ></SearchComp>
    </Container>
  );
};

const Container = styled.div`
  width: 30rem;
  .outerContainer {
    flex-grow: 1;
    padding: 0 1.5rem;
    .header-search-bar.input-container {
      height: 2.28rem;
      .input-wrapper {
        border-radius: 1.14rem;
        border-color: #0054fe;
        input {
          ::placeholder {
            color: #222a44;
            font-size: 12px;
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
              text-align: end;
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
  }
`;
