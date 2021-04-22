import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components/macro';
import { translations } from 'locales/i18n';
import { PageHeader } from 'app/components/PageHeader';
import { Timeline } from '@jnoodle/antd';
import { TethysNotices, TestnetNotices } from './notices';
import { useTestnet } from '../../../utils/hooks/useTestnet';
import { media } from '../../../styles/media';
import { useClientVersion } from '../../../utils/api';
import { monospaceFont } from '../../../styles/variable';

export function Notices() {
  const { t, i18n } = useTranslation();
  const isTestnet = useTestnet();
  let v = useClientVersion();
  const notices = (
    (isTestnet ? TestnetNotices : TethysNotices) || []
  ).sort((a, b) => b.date.localeCompare(a.date));
  const lang = i18n.language.indexOf('en') > -1 ? 'en' : 'zh';
  const loadingText = t(translations.general.loading);
  const version = (v && v?.replace('conflux-rust-', '')) || loadingText;
  const dateFormat = date =>
    dayjs(date).format(lang === 'en' ? 'MMM DD, YYYY' : 'YYYY-MM-DD');
  return (
    <>
      <Helmet>
        <title>{t(translations.header.notice)}</title>
        <meta
          name="description"
          content={t(translations.metadata.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.header.notice)}</PageHeader>
      <StyledListWrapper>
        <Timeline>
          {notices.map((n, i) => (
            <Timeline.Item key={i}>
              <div className="content-container">
                <div className="date">{n.date ? dateFormat(n.date) : '--'}</div>
                <div className="content">
                  <ol>
                    {n.content[lang].map((c, j) => (
                      <li
                        dangerouslySetInnerHTML={{
                          __html: c.replace('{{version}}', version),
                        }}
                        key={j}
                      />
                    ))}
                  </ol>
                </div>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </StyledListWrapper>
    </>
  );
}

const StyledListWrapper = styled.div`
  display: block;
  margin-top: 30px;
  margin-bottom: 30px;

  ul li:before {
    display: none;
  }

  .content-container {
    display: flex;
    flex-direction: row;
    font-size: 14px;
    color: #333333;

    ${media.m} {
      flex-direction: column;
    }

    .date {
      color: #002257;
      width: 100px;
      white-space: nowrap;
      margin-right: 60px;
      margin-bottom: 16px;
    }

    .content {
      width: 100%;

      ol {
        margin-left: 23px;
      }

      li,
      p {
        margin-top: 0;
        margin-bottom: 8px;
      }
      li::marker {
        font-family: ${monospaceFont};
      }
    }
  }

  .ant-timeline-item {
    padding-bottom: 30px;

    .ant-timeline-item-head-blue {
      color: #999;
      border-color: #999;
    }

    &:first-child {
      .ant-timeline-item-head-blue {
        color: #1e3de4;
        border-color: #1e3de4;
      }

      .date {
        color: #1e3de4;
        font-weight: 600;
      }
    }
  }

  .ant-timeline-item-head {
    width: 12px;
    height: 12px;
  }

  .ant-timeline-item-tail {
    left: 5px;
    border: 1px solid #bdc0d6;
  }
  .ant-timeline-item-content {
    top: -5px;
  }
`;
