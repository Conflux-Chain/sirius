/**
 *
 * NotFoundPage
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';
import { translations } from 'locales/i18n';
import img404 from 'images/home/404.svg';
import { IS_SHOW_BANNER } from 'utils/constants';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <PageWrapper $isShowBanner={IS_SHOW_BANNER}>
      <LeftImage alt="404" src={img404} />
      <RightWrap>
        <ErrorTitle>{t(translations.notFound.title)}</ErrorTitle>
        <ErrorLabel>{t(translations.notFound.label)}</ErrorLabel>
        <ErrorLabel>{t(translations.notFound.addressTip)}</ErrorLabel>
        <GoTo href="/">{t(translations.notFound.btn)}</GoTo>
      </RightWrap>
    </PageWrapper>
  );
}

// wrapper
const PageWrapper = styled.div<{ $isShowBanner?: boolean }>`
  display: flex;
  position: absolute;
  height: ${({ $isShowBanner }) =>
    $isShowBanner ? 'calc(100% - 8rem - 50px)' : 'calc(100% - 8rem)'};
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  background: #f5f6fa;
  width: 100%;

  ${media.s} {
    position: static;
    align-items: inherit;
    align-content: center;
  }
`;

// img
const LeftImage = styled.img`
  margin-right: 7rem;
  ${media.s} {
    margin-right: 0;
    max-width: 80%;
  }
`;
const RightWrap = styled.div`
  display: flex;
  flex-direction: column;
  ${media.m} {
    padding: 1rem;
    align-items: center;
    text-align: center;
  }
`;

const ErrorTitle = styled.span`
  display: inline-block;
  font-size: 1.5714rem;
  line-height: 2rem;
  color: #424242;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const ErrorLabel = styled.span`
  display: inline-block;
  color: #4b4b4b;
  opacity: 0.4;
  font-weight: 500;
  line-height: 1.2857rem;
  margin-bottom: 1rem;
  max-width: 540px;
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
  margin-top: 2rem;
`;
