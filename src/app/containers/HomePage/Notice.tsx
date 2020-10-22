import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import 'utils/lazyJSSDK';
import { useClientVersion } from '@cfxjs/react-hooks';
import { media } from 'styles/media';

const NoticeItem = ({ children }) => (
  <p>
    <img
      style={{ marginRight: '0.57rem' }}
      src="/notice.svg"
      alt="notice indicator"
    />
    {children}
  </p>
);

export function Notice() {
  const { t } = useTranslation();
  let v = useClientVersion();
  const loadingText = t(translations.general.loading);

  const match = v?.match(/(\d+\.)?(\d+\.)?(\*|\d+)$/);
  const version = (match && match[0]) || loadingText;

  const notices: React.ReactNode[] = [];
  for (const n in translations.notice) {
    if (n === '0') {
      notices.push(
        <NoticeItem key={n}>
          {t(translations.notice[n], { version })}
        </NoticeItem>,
      );
    } else {
      notices.push(
        <NoticeItem key={n}>{t(translations.notice[n])}</NoticeItem>,
      );
    }
  }
  return (
    <Main style={{ textAlign: notices.length > 1 ? 'left' : 'center' }}>
      {notices}
    </Main>
  );
}

const Main = styled.div`
  margin-top: 1.71rem;
  color: #212121;
  margin-bottom: 3rem;

  ${media.s} {
    margin-bottom: 1.5rem;
    margin-top: 1.5rem;
    font-size: 0.9rem;
  }
`;
