import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { translations } from '../../../locales/i18n';
import docCookies from '../../../utils/cookie';

export const GlobalTip = ({ tipKey = '' }: { tipKey: string }) => {
  const { t } = useTranslation();
  const key = 'confluxscan_global_tip_' + tipKey;
  const [agreed, setAgreed] = useState(
    !!docCookies.getItem(key) || !!localStorage.getItem(key),
  );
  const agreeCookie = () => {
    // @ts-ignore
    docCookies.setItem(key, 'true', Infinity);
    // for safari https://github.com/js-cookie/js-cookie/wiki/Frequently-Asked-Questions#why-is-my-expiration-time-capped-at-7-days-or-24-hours
    localStorage.setItem(key, 'true');
    setAgreed(true);
  };

  return agreed || !t(translations.footer[tipKey]) ? null : (
    <GlobalTipWrapper>
      <span
        dangerouslySetInnerHTML={{
          __html: t(translations.footer[tipKey]),
        }}
      />
      <span className="cookie-agree" onClick={agreeCookie}>
        {t(translations.footer.cookieAgree)}
      </span>
    </GlobalTipWrapper>
  );
};

const GlobalTipWrapper = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 21px;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
  color: #ffffff;
  background: #c65252;
  z-index: 999;

  img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }

  a {
    color: #fff;
    border-bottom: 1px solid #ddd;
    padding-bottom: 2px;

    &:hover {
      color: #fff;
      border-bottom: 1px solid #fff;
    }
  }

  .cookie-agree {
    display: inline-block;
    margin-left: 10px;
    width: 87px;
    height: 30px;
    background: #f9fafb;
    color: #000000;
    border-radius: 2px;
    font-weight: 500;
    text-align: center;
    text-transform: uppercase;
    cursor: pointer;
  }
`;
