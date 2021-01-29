import React from 'react';
import styled from 'styled-components/macro';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@cfxjs/react-ui';
import { Link } from '../../components/Link/Loadable';
import { translations } from '../../../locales/i18n';
import { Basic } from './Basic';
import { Transfers } from './Transfers';
import { useTokenQuery } from '../../../utils/api';
import { defaultTokenIcon } from '../../../constants';
import { Tooltip } from '../../components/Tooltip/Loadable';

interface RouteParams {
  tokenAddress: string;
}

export function TokenDetail() {
  const { t } = useTranslation();
  const { tokenAddress } = useParams<RouteParams>();
  const params = {
    address: tokenAddress,
    fields: ['icon', 'transferCount', 'price', 'totalPrice', 'quoteUrl'],
  };
  let { data } = useTokenQuery(params, !!tokenAddress);

  if (!data) {
    data = {};
  }

  // data.transferStatistic = data.transferStatistic || {};

  // set tokenType to the transferType which has max transfer count
  // maybe change

  // const transferCountArray = [
  //   data.transferStatistic.ERC20 || 0,
  //   data.transferStatistic.ERC721 || 0,
  //   data.transferStatistic.ERC1155 || 0,
  // ];
  //
  // data.transferCount = Math.max(...transferCountArray);
  //
  // let transferType = '';
  //
  // if (data.transferStatistic.ERC20 !== undefined) {
  //   switch (transferCountArray.indexOf(data.transferCount)) {
  //     case 0:
  //       transferType = cfxTokenTypes.erc20;
  //       break;
  //     case 1:
  //       transferType = cfxTokenTypes.erc721;
  //       break;
  //     case 2:
  //       transferType = cfxTokenTypes.erc1155;
  //       break;
  //     default:
  //       break;
  //   }
  // }

  return (
    <>
      <Helmet>
        <title>{t(translations.tokens.title)}</title>
        <meta name="description" content={t(translations.tokens.description)} />
      </Helmet>
      <TokenDetailWrap>
        {data.address ? (
          <HeaderWrap>
            {!data.isCustodianToken ? (
              <img
                className="img"
                alt="icon"
                src={data.icon || defaultTokenIcon}
              />
            ) : (
              <Tooltip
                hoverable
                text={
                  <span>
                    {t(translations.token.shuttleflow)}
                    <Link href="https://shuttleflow.io" target="_blank">
                      Shuttleflow
                    </Link>
                  </span>
                }
              >
                <img alt="icon" src={data.icon || defaultTokenIcon} />
              </Tooltip>
            )}
            <div className="basic-name">
              {data.name || t(translations.general.notAvailable)}
            </div>
            <div className="basic-symbol">{`(${
              data.symbol || t(translations.general.notAvailable)
            })`}</div>
          </HeaderWrap>
        ) : (
          <SkeletonWrap>
            <Skeleton className="sirius-tokendetail-skeleton"></Skeleton>
          </SkeletonWrap>
        )}
        <Basic
          {...data}
          tokenAddress={tokenAddress}
          transferType={data.transferType}
        />
        {data.transferType ? (
          <Transfers
            decimals={data.decimals || 0}
            tokenAddress={tokenAddress}
            symbol={data.symbol}
            transferType={data.transferType}
          />
        ) : null}
      </TokenDetailWrap>
    </>
  );
}

const TokenDetailWrap = styled.div`
  padding: 2.2857rem 0;
`;

const SkeletonWrap = styled.div`
  .skeleton.sirius-tokendetail-skeleton.text {
    width: 8.5714rem;
    height: 2.5714rem;
    margin-bottom: 1.7143rem;
  }
`;

const HeaderWrap = styled.div`
  display: flex;
  align-items: center;
  line-height: 2.2857rem;
  margin-bottom: 1.7143rem;
  img {
    width: 20px;
    height: 20px;
  }
  a {
    color: #00acff !important;
  }
  .basic-name {
    font-size: 1.7143rem;
    font-weight: 500;
    color: #1a1a1a;
    margin: 0 0.5714rem;
  }
  .basic-symbol {
    color: #74798c;
    font-size: 1rem;
  }
`;
