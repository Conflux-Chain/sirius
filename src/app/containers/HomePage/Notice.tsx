import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import 'utils/lazyJSSDK';
import { useClientVersion } from '@cfxjs/react-hooks';
import { media } from 'styles/media';
import clsx from 'clsx';

const NoticeItem = ({ children }) => (
  <StyledNoticeItemWrapper className="notice-item-wrapper">
    <div className="img">
      <img src="/notice.svg" alt="notice indicator" />
    </div>
    <div className="text">{children}</div>
  </StyledNoticeItemWrapper>
);

export function Notice() {
  const { t } = useTranslation();
  let v = useClientVersion();
  const loadingText = t(translations.general.loading);
  const version = (v && v?.replace('conflux-rust-', '')) || loadingText;
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
    <Main
      className={clsx('notice', notices.length > 1 ? 'multiple' : 'single')}
    >
      {notices}
    </Main>
  );
}

const StyledNoticeItemWrapper = styled.div`
  max-width: 1024px;
  margin: 1rem auto;
  display: flex;

  ${media.s} {
    padding: 0 16px;
    max-width: 100%;
  }

  .img {
    width: 1.5714rem;
    height: 1.5714rem;
    margin-right: 10px;
    img {
      max-width: inherit;
    }
  }
`;

const Main = styled.div`
  color: #212121;
  background: #eaeffb;
  overflow: auto;
  z-index: 2;
  width: 100vw;

  &.placeholder {
    position: relative;
  }

  .notice-item-wrapper {
    justify-content: center;
  }

  &.multiple {
    .notice-item-wrapper {
      justify-content: flex-start;
    }
  }

  ${media.s} {
    margin-top: 1.5rem;
    font-size: 0.9rem;
    overflow: auto;
  }
`;
