import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import ENV_CONFIG from 'env';
import HomePng from 'images/homepage/home.png';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';

export function HomePage() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t(translations.metadata.title)}</title>
        <meta
          name="description"
          content={t(translations.metadata.description)}
        />
      </Helmet>
      <Main>
        <img src={HomePng} alt="amoo store" />
        <div>数字证书查验</div>
        <div>
          <span>查看作品对应的链上数字证书和公开记录</span>
          <br />
          <span>请从AmooStore作品详情页进入，可获得完整作品信息</span>
        </div>
        <Link className="amoo-link" href={ENV_CONFIG.ENV_LINK}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="6"
            height="11"
            viewBox="0 0 6 11"
            fill="none"
          >
            <path
              d="M5.25 9.75L0.75 5.25L5.25 0.75"
              stroke="black"
              stroke-opacity="0.5"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>返回AmooStore</span>
        </Link>
      </Main>
    </>
  );
}

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
  max-width: 1368px;
  margin-top: 90px;
  > div {
    color: #fafafa;
    text-align: center;
    font-size: 24px;
    font-weight: 500;
    line-height: 40.8px; /* 170% */
    letter-spacing: 0.07px;
    > span {
      color: rgba(255, 255, 255, 0.5);
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      line-height: 23.8px; /* 170% */
      letter-spacing: -0.15px;
    }
  }
  > img {
    width: 320px;
    height: 320px;
    aspect-ratio: 1/1;
  }
  .amoo-link {
    display: flex;
    width: 303px;
    height: 40px;
    padding: 9px;
    justify-content: center;
    align-items: center;
    gap: 7px;
    border-radius: 100px;
    background: #fafafa;
    span {
      color: #000;
      text-align: center;
      font-size: 13px;
      font-weight: 500;
      line-height: normal;
      letter-spacing: -0.076px;
    }
  }

  ${media.s} {
    margin-top: 30px;
    & > img {
      width: 240px;
      height: 240px;
    }
  }
`;
