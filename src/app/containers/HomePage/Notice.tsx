import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { media } from 'styles/media';
import clsx from 'clsx';
import { useTestnet } from 'utils/hooks/useTestnet';
import { Link } from 'app/components/Link/Loadable';
import announcementNotification from 'images/notice/announcementNotification.png';
import FAQNotification from 'images/notice/FAQNotification.png';
import updateNotification from 'images/notice/updateNotification.png';
import { CurrentTestnetNotice, CurrentTethysNotice } from '../Notices/notices';

const ImgNotice = () => {
  if (CurrentTethysNotice.type === 'Announcement') {
    return <img src={announcementNotification} alt="notice indicator" />;
  } else if (CurrentTethysNotice.type === 'FAQ') {
    return <img src={FAQNotification} alt="notice indicator" />;
  } else if (CurrentTethysNotice.type === 'update') {
    return <img src={updateNotification} alt="notice indicator" />;
  }
  return null;
};

const NoticeItem = ({ children }) => (
  <StyledNoticeItemWrapper className="notice-item-wrapper">
    <div className="img">
      <ImgNotice />
    </div>
    <div className="text">{children}</div>
  </StyledNoticeItemWrapper>
);

export function getLatestNoticeLink(lang, isTestnet): string {
  if (lang === 'en') {
    return isTestnet
      ? 'https://confluxscansupportcenter.zendesk.com/hc/en-us/articles/4404540235675-Jul-19-2021-Aug-1-2021'
      : 'https://confluxscansupportcenter.zendesk.com/hc/en-us/articles/4404540235675-Jul-19-2021-Aug-1-2021';
  } else {
    return isTestnet
      ? 'https://confluxscansupportcenter.zendesk.com/hc/zh-cn/articles/4404540235675-2021-7-19-2021-8-1'
      : 'https://confluxscansupportcenter.zendesk.com/hc/zh-cn/articles/4404540235675-2021-7-19-2021-8-1';
  }
}

export function Notice() {
  const { t, i18n } = useTranslation();
  const isTestnet = useTestnet();
  const lang = i18n.language.indexOf('en') > -1 ? 'en' : 'zh';
  const notices: React.ReactNode[] = [];

  // let v = useClientVersion();
  // const loadingText = t(translations.general.loading);
  // const version = (v && v?.replace('conflux-rust-', '')) || loadingText;
  // const notices: React.ReactNode[] = [];
  // const transationsNotice = isTestnet
  //   ? translations.notice.testnet
  //   : translations.notice.mainnet;
  // const transationsNoticeLink = isTestnet
  //   ? translations.notice.testnetLink
  //   : translations.notice.link;
  // const isEn = i18n.language.startsWith('en');
  // for (const n in transationsNotice) {
  //   if (n === '0') {
  //     notices.push(
  //       <NoticeItem key={n}>{t(transationsNotice[n], { version })}</NoticeItem>,
  //     );
  //   } else if (n === '1') {
  //     notices.push(
  //       <NoticeItem key={n}>
  //         {t(transationsNotice[n])}
  //         {`${isEn ? ' (' : '（'}`}
  //         <Link href={t(transationsNoticeLink)}>
  //           {isEn ? 'Click to view details' : '详情链接'}
  //         </Link>
  //         {`${isEn ? ').' : '）。'}`}
  //       </NoticeItem>,
  //     );
  //   } else {
  //     notices.push(<NoticeItem key={n}>{t(transationsNotice[n])}</NoticeItem>);
  //   }
  // }
  notices.push(
    <NoticeItem key="latest">
      <div
        className={`content ${
          (isTestnet ? CurrentTestnetNotice.hot : CurrentTethysNotice.hot)
            ? 'hot'
            : ''
        }`}
      >
        {isTestnet ? CurrentTestnetNotice[lang] : CurrentTethysNotice[lang]}
      </div>
    </NoticeItem>,
  );
  notices.push(
    <NoticeItem key="more">
      <Link href={getLatestNoticeLink(lang, isTestnet)} className="more">
        {t(translations.header.more)}
      </Link>
    </NoticeItem>,
  );
  return <Main className={clsx('notice')}>{notices}</Main>;
}

const StyledNoticeItemWrapper = styled.div`
  max-width: 1368px;
  margin: 0 auto 10px;
  display: flex;

  ${media.s} {
    padding: 0 16px;
    max-width: 100%;
  }

  ${media.xl} {
    padding-left: 10px;
    padding-right: 10px;
  }

  .img {
    margin-right: 10px;

    img {
      width: 16px;
      height: 16px;
      visibility: hidden;
      max-width: unset;
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
  box-sizing: border-box;
  padding: 10px 10px 0;
  // // Scroll bar width
  // // OSX (Chrome, Safari, Firefox) - 15px
  // // Windows XP (IE7, Chrome, Firefox) - 17px
  // // Windows 7 (IE10, IE11, Chrome, Firefox) - 17px
  // // Windows 8.1 (IE11, Chrome, Firefox) - 17px
  // // Windows 10 (IE11, Chrome, Firefox) - 17px
  // // Windows 10 (Edge 12/13) - 12px
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
