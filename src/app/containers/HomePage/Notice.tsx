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

const getScrollBarWidth = () => {
  const inner = document.createElement('p');
  inner.style.width = '100%';
  inner.style.height = '200px';

  const outer = document.createElement('div');
  outer.style.position = 'absolute';
  outer.style.top = '0px';
  outer.style.left = '0px';
  outer.style.visibility = 'hidden';
  outer.style.width = '200px';
  outer.style.height = '150px';
  outer.style.overflow = 'hidden';
  outer.style.zIndex = '-9999';
  outer.appendChild(inner);

  document.body.appendChild(outer);
  const w1 = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  let w2 = inner.offsetWidth;
  if (w1 === w2) w2 = outer.clientWidth;

  document.body.removeChild(outer);

  return w1 - w2;
};

const Main = styled.div`
  color: #212121;
  background: #eaeffb;
  overflow: auto;
  z-index: 2;
  width: 100vw;
  // Scroll bar width
  // OSX (Chrome, Safari, Firefox) - 15px
  // Windows XP (IE7, Chrome, Firefox) - 17px
  // Windows 7 (IE10, IE11, Chrome, Firefox) - 17px
  // Windows 8.1 (IE11, Chrome, Firefox) - 17px
  // Windows 10 (IE11, Chrome, Firefox) - 17px
  // Windows 10 (Edge 12/13) - 12px
  max-width: calc(
    100vw - ${getScrollBarWidth()}px
  ); // minus scroll bar width to fix home page horizontal scroll

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
