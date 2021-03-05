import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { media } from 'styles/media';
import clsx from 'clsx';
import { useTestnet } from 'utils/hooks/useTestnet';
import { useClientVersion } from 'utils/api';
import { Link } from 'app/components/Link/Loadable';
import imgNotice from 'images/notice.svg';

const NoticeItem = ({ children }) => (
  <StyledNoticeItemWrapper className="notice-item-wrapper">
    <div className="img">
      <img src={imgNotice} alt="notice indicator" />
    </div>
    <div className="text">{children}</div>
  </StyledNoticeItemWrapper>
);

export function Notice() {
  const { t, i18n } = useTranslation();
  const isTestnet = useTestnet();
  let v = useClientVersion();
  const loadingText = t(translations.general.loading);
  const version = (v && v?.replace('conflux-rust-', '')) || loadingText;
  const notices: React.ReactNode[] = [];
  const transationsNotice = isTestnet
    ? translations.notice.testnet
    : translations.notice.mainnet;
  const transationsNoticeLink = isTestnet
    ? translations.notice.testnetLink
    : translations.notice.link;
  const isEn = i18n.language.startsWith('en');
  for (const n in transationsNotice) {
    if (n === '0') {
      notices.push(
        <NoticeItem key={n}>{t(transationsNotice[n], { version })}</NoticeItem>,
      );
    } else if (n === '1') {
      notices.push(
        <NoticeItem key={n}>
          {t(transationsNotice[n])}
          {/* {`${isEn ? ' (' : '（'}`} */}
          <Link href={t(transationsNoticeLink)}>
            {isEn ? 'Click to view details' : '详情链接'}
          </Link>
          {/* {`${isEn ? ').' : '）。'}`} */}
        </NoticeItem>,
      );
    } else {
      notices.push(<NoticeItem key={n}>{t(transationsNotice[n])}</NoticeItem>);
    }
  }
  return <Main className={clsx('notice')}>{notices}</Main>;
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
      visibility: hidden;
    }
  }
`;

const Main = styled.div`
  color: #212121;
  background: #eaeffb;
  overflow: auto;
  z-index: 2;
  width: 100vw;
  max-width: ${document.body.clientWidth
    ? document.body.clientWidth + 'px'
    : 'calc(100vw - 18px)'}; // fix home page horizontal scroll

  &.placeholder {
    position: relative;
  }

  /* only show the first one trumpet now, hide others, may show back in the future */
  .notice-item-wrapper:first-child {
    img {
      visibility: visible;
    }
  }

  ${media.s} {
    margin-top: 2rem;
    font-size: 0.9rem;
    overflow: auto;
  }
`;
