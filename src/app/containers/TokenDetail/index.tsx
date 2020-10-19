import React from 'react';
import styled from 'styled-components/macro';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Link } from '@cfxjs/react-ui';
import { translations } from '../../../locales/i18n';
import { Basic } from './Basic';
import { Transfers } from './Transfers';
import { useTokenQuery } from '../../../utils/api';
import { Tooltip } from '../../components/Tooltip/Loadable';

interface RouteParams {
  tokenAddress: string;
}

export function TokenDetail() {
  const { t } = useTranslation();
  const { tokenAddress } = useParams<RouteParams>();
  const params = { address: tokenAddress };
  let { data, error } = useTokenQuery(params, !!tokenAddress);

  if (!data && !error) {
    data = { result: {} };
  }

  return (
    <>
      <Helmet>
        <title>{t(translations.tokens.title)}</title>
        <meta name="description" content={t(translations.tokens.description)} />
      </Helmet>
      <TokenDetailWrap>
        <HeaderWrap>
          {!data.result?.isShuttleflow ? (
            <img alt="icon" src={data.result?.icon} />
          ) : (
            <Tooltip
              hoverable
              text={
                <span>
                  {t(translations.token.shuttleflow)}
                  <Link>Shuttleflow</Link>
                </span>
              }
            >
              <img alt="icon" src={data.result?.icon} />
            </Tooltip>
          )}
          <div className="basic-name">{data.result?.name}</div>
          <div className="basic-symbol">{`(${data.result?.symbol})`}</div>
        </HeaderWrap>
        <Basic {...data.result} tokenAddress={tokenAddress} />
        <Transfers tokenAddress={tokenAddress} symbol={data.result?.symbol} />
      </TokenDetailWrap>
    </>
  );
}

const TokenDetailWrap = styled.div`
  padding: 2.2857rem 0;
`;

const HeaderWrap = styled.div`
  display: flex;
  align-items: center;
  line-height: 2.2857rem;
  margin-bottom: 1.7143rem;
  .basic-name {
    font-size: 1.7143rem;
    font-weight: 500;
    color: #0f1327;
    margin: 0 0.5714rem;
  }
  .basic-symbol {
    color: #74798c;
    font-size: 1rem;
  }
`;
