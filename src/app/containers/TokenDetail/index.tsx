import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@cfxjs/react-ui';
import { Link } from '../../components/Link/Loadable';
import { translations } from '../../../locales/i18n';
import { Basic } from './Basic';
import { Transfers } from './Transfers';
import { useTokenQuery } from '../../../utils/api';
import { ICON_DEFAULT_TOKEN } from 'utils/constants';
import { Tooltip } from '../../components/Tooltip/Loadable';
import { media } from '../../../styles/media';
import DownIcon from '../../../images/down.png';
import { MenuWrapper } from '../AddressContractDetail/AddressDetailPage';
import { Dropdown, Menu } from '@cfxjs/antd';
import descIcon from 'images/table-desc.svg';
import ENV_CONFIG from 'env';

interface RouteParams {
  tokenAddress: string;
}

export function TokenDetail() {
  const { t } = useTranslation();
  const { tokenAddress } = useParams<RouteParams>();
  const params = {
    address: tokenAddress,
    fields: ['iconUrl', 'transferCount', 'price', 'totalPrice', 'quoteUrl'],
  };
  let { data } = useTokenQuery(params, !!tokenAddress);

  if (!data) {
    data = {};
  }

  if (data.base32 && !data.address) data.address = data.base32;

  data.holderCount = data.holderCount === '-' ? 0 : data.holderCount;

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
  //       transferType = CFX_TOKEN_TYPES.erc20;
  //       break;
  //     case 1:
  //       transferType = CFX_TOKEN_TYPES.erc721;
  //       break;
  //     case 2:
  //       transferType = CFX_TOKEN_TYPES.erc1155;
  //       break;
  //     default:
  //       break;
  //   }
  // }

  const isFC = tokenAddress === ENV_CONFIG.ENV_FC_ADDRESS;

  const menu = (
    <MenuWrapper>
      <Menu.Item>
        <RouterLink to={`/token-info/${tokenAddress}`}>
          {t(translations.general.address.more.editToken)}
        </RouterLink>
      </Menu.Item>
      <Menu.Item>
        <RouterLink to={`/balance-checker?address=${tokenAddress}`}>
          {t(translations.general.address.more.balanceChecker)}
        </RouterLink>
      </Menu.Item>
      <Menu.Item>
        <RouterLink to={`/report?address=${tokenAddress}`}>
          {t(translations.general.address.more.report)}
        </RouterLink>
      </Menu.Item>
    </MenuWrapper>
  );

  return (
    <>
      <Helmet>
        <title>{t(translations.tokens.title)}</title>
        <meta name="description" content={t(translations.tokens.description)} />
      </Helmet>
      <TokenDetailWrap>
        {data.address || tokenAddress ? (
          <HeaderWrap>
            {!data.isCustodianToken ? (
              <img
                className="img"
                alt="icon"
                src={data.iconUrl || ICON_DEFAULT_TOKEN}
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
                <img alt="icon" src={data.iconUrl || ICON_DEFAULT_TOKEN} />
              </Tooltip>
            )}
            <div className="basic-name">
              {data.name || t(translations.general.notAvailable)}
            </div>
            <div className="basic-symbol">{`(${
              data.symbol || t(translations.general.notAvailable)
            })`}</div>
            {isFC ? (
              <div className="basic-link">
                <Link href={'/fccfx'} target="_blank">
                  {t(translations.token.fcMining)}
                </Link>
              </div>
            ) : null}
            <DropdownWrapper overlay={menu} trigger={['click']}>
              <span onClick={e => e.preventDefault()}>
                {t(translations.general.address.more.title)}{' '}
                <img
                  src={DownIcon}
                  alt={t(translations.general.address.more.title)}
                />
              </span>
            </DropdownWrapper>
            {/* {data &&
            typeof data.isRegistered !== 'undefined' &&
            data.isRegistered ? (
              <WarningInfoWrapper>
                {t(translations.token.notRegistered)}
                {'  '}
                <Link href={`/token-info/${tokenAddress}`}>
                  {t(translations.token.tokenRegistration)}
                </Link>
              </WarningInfoWrapper>
            ) : undefined} */}
          </HeaderWrap>
        ) : (
          <SkeletonWrap>
            <Skeleton className="sirius-tokendetail-skeleton" />
          </SkeletonWrap>
        )}
        <Basic
          {...data}
          tokenAddress={tokenAddress}
          transferType={data.transferType}
        />
        {data.address ? (
          <Transfers
            tokenData={data}
            // tokenName={data.name}
            // decimals={data.decimals || 0}
            // price={data.price || 0}
            // totalSupply={data.totalSupply || 0}
            // holderCount={data.holderCount || 0}
            // tokenAddress={tokenAddress}
            // symbol={data.symbol}
            // transferType={data.transferType}
          />
        ) : null}
      </TokenDetailWrap>
    </>
  );
}

const TokenDetailWrap = styled.div`
  padding: 2.2857rem 0;

  table .sortable.balance.desc {
    cursor: not-allowed !important;
    background-image: url(${descIcon}) !important;

    &:hover {
      color: inherit !important;
    }
  }
`;

const SkeletonWrap = styled.div`
  .skeleton.sirius-tokendetail-skeleton.text {
    width: 8.5714rem;
    height: 2.5714rem;
    margin-bottom: 1.7143rem;
  }
`;

const HeaderWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  line-height: 2.2857rem;
  margin-bottom: 1.7143rem;

  ${media.s} {
    flex-wrap: wrap;
  }

  img {
    width: 32px;
    height: 32px;
  }

  a {
    color: #00acff !important;
  }

  .basic-name {
    font-size: 1.7143rem;
    font-weight: 500;
    color: #1a1a1a;
    margin: 0 0.6rem;
  }

  .basic-symbol {
    color: #74798c;
    font-size: 1rem;
  }

  .basic-link {
    font-size: 14px;
    line-height: 22px;
    margin-left: 10px;
    border-bottom: 1px solid #1e3de4;

    &:hover {
      border-bottom: 1px solid #0f23bd;
    }

    a {
      color: #1e3de4 !important;

      &:hover {
        color: #0f23bd !important;
      }
    }
  }
`;

export const DropdownWrapper = styled(Dropdown)`
  position: absolute;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #74798c;
  height: 21px;

  img {
    width: 11px;
    height: 6px;
    margin-left: 5px;
  }
`;

// const WarningInfoWrapper = styled.div`
//   color: #c65252;
//   margin-left: 10px;
// `;
