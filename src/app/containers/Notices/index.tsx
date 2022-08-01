import React from 'react';
import announcementNotification from 'images/notice/announcementNotification.png';
import FAQNotification from 'images/notice/FAQNotification.png';
import updateNotification from 'images/notice/updateNotification.png';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Link } from 'app/components/Link/Loadable';
import styled from 'styled-components/macro';
import { media } from 'styles/media';

export const noticeInfo = {
  hot: false,
  type: 'Announcement',
  brief: {
    en: 'ConfluxScan v2.15.0 Released!',
    zh: 'ConfluxScan v2.15.0 发布喽！',
  },
  link: {
    en:
      'https://confluxscansupportcenter.zendesk.com/hc/en-us/articles/7607301421339-Jul-5-2022-Jul-24-2022',
    zh:
      'https://confluxscansupportcenter.zendesk.com/hc/zh-cn/articles/7607301421339-2022-7-5-2022-7-24',
  },
};

const ImgNotice = () => {
  if (noticeInfo.type === 'Announcement') {
    return <img src={announcementNotification} alt="notice indicator" />;
  } else if (noticeInfo.type === 'FAQ') {
    return <img src={FAQNotification} alt="notice indicator" />;
  } else if (noticeInfo.type === 'update') {
    return <img src={updateNotification} alt="notice indicator" />;
  }
  return null;
};
// notice
export const Notices = React.memo(() => {
  const { t, i18n } = useTranslation();
  const iszh = i18n.language.includes('zh');

  return (
    <NoticeWrapper className="notice">
      <ImgNotice />
      <div className={`content ${noticeInfo.hot ? 'hot' : ''}`}>
        {noticeInfo.brief[iszh ? 'zh' : 'en']}
      </div>
      <Link href={noticeInfo.link[iszh ? 'zh' : 'en']} className="more">
        {t(translations.header.more)}
      </Link>
    </NoticeWrapper>
  );
});

const NoticeWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;

  ${media.s} {
    margin-top: 10px;
  }

  img {
    width: 16px;
    height: 16px;
    margin-right: 10px;
  }

  .content {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #6c6d75;

    &.hot {
      color: #e64e4e;
    }
  }

  .more {
    white-space: nowrap;
    margin-left: 24px;
    margin-right: 10px;
    border-bottom: 1px solid #1e3de4;

    &:hover,
    &:active {
      border-bottom: 1px solid #0f23bd;
    }
  }
`;
