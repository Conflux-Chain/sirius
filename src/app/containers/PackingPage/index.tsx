/**
 *
 * PackingPage
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import leftImage from '../../../images/home/packing.svg';
import { media } from 'styles/media';
import { translations } from 'locales/i18n';
import { useParams } from 'react-router-dom';
import { CopyButton } from '../../components/CopyButton/Loadable';

interface RouteParams {
  txHash: string;
}

export function PackingPage() {
  const { t } = useTranslation();
  const { txHash } = useParams<RouteParams>();

  return (
    <PageWrapper>
      <LeftImage src={leftImage} />
      <RightWrap>
        <ErrorTitle>{t(translations.packing.title)}</ErrorTitle>
        <ErrorLabel>
          <span>{txHash}</span>
          <CopyButton copyText={txHash} />
        </ErrorLabel>
        <GoTo href="/">{t(translations.packing.btn)}</GoTo>
      </RightWrap>
    </PageWrapper>
  );
}

// wrapper
const PageWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  background: #f5f6fa;
`;

// img
const LeftImage = styled.img`
  margin-right: 7rem;
  ${media.s} {
    margin-right: 0;
  }
`;
const RightWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  ${media.m} {
    padding: 1rem;
  }
`;

const ErrorTitle = styled.span`
  display: inline-block;
  font-size: 1.5714rem;
  line-height: 2rem;
  color: #555;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const ErrorLabel = styled.div`
  display: flex;
  margin-bottom: 2.3571rem;
  align-items: center;
  span {
    display: inline-block;
    color: #6a6a6a;
    font-weight: 500;
    line-height: 1.2857rem;
    margin-right: 3px;
  }
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
