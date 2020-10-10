/**
 *
 * NotFoundPage
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import notFoundImage from '../../../images/home/404.svg';
import { media } from 'styles/media';
import { translations } from 'locales/i18n';

export function NotFoundPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  return (
    <NotFoundPageWrapper>
      <NotFoundImage src={notFoundImage} />
      <RightWrap>
        <ErrorTitle>{t(translations.notFound.title)}</ErrorTitle>
        <ErrorLabel>{t(translations.notFound.label)}</ErrorLabel>
        <ErrorLabel>{t(translations.notFound.addressTip)}</ErrorLabel>
        <GoTo href="/">{t(translations.notFound.btn)}</GoTo>
      </RightWrap>
    </NotFoundPageWrapper>
  );
}

// wrapper
const NotFoundPageWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 16rem);
  background: #f5f6fa;
`;

// img
const NotFoundImage = styled.img`
  margin-right: 7rem;
  ${media.s} {
    margin-right: 0;
  }
`;
const RightWrap = styled.div`
  display: flex;
  flex-direction: column;
  ${media.m} {
    padding: 1rem;
  }
`;

const ErrorTitle = styled.span`
  display: inline-block;
  font-size: 1.5714rem;
  line-height: 2rem;
  color: #424242;
  margin-bottom: 1rem;
`;

const ErrorLabel = styled.span`
  display: inline-block;
  color: #4b4b4b;
  line-height: 1.2857rem;
  margin-bottom: 1rem;
`;

const GoTo = styled.a`
  width: 15.7143rem;
  height: 3.5714rem;
  background-color: #fff;
  border-radius: 2.8571rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #545454;
  font-size: 1.1429rem;
`;
