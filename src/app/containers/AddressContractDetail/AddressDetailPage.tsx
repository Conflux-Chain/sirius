/**
 *
 * AddressDetailPage
 *
 */

import React, { memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Copy, Qrcode } from './HeadLineButtons';
import {
  BalanceCard,
  TokensCard,
  StorageStakingCard,
  NonceCard,
} from './AddressInfoCards';
import {
  Main,
  Title,
  Bottom,
  HeadAddressLine,
  Top,
  Head,
  Middle,
} from './layouts';
import { AddressMetadata, Table } from './Loadable';
import { isZeroAddress } from '../../../utils';
import { useAccount } from '../../../utils/api';
import { Dropdown, Menu } from '@jnoodle/antd';
import { Link as RouterLink } from 'react-router-dom';
import DownIcon from '../../../images/down.png';
import styled from 'styled-components';
import { media } from '../../../styles/media';
import { NETWORK_TYPES, NETWORK_TYPE } from '../../../utils/constants';

interface RouteParams {
  address: string;
}

export const AddressDetailPage = memo(() => {
  const { t } = useTranslation();
  const { address } = useParams<RouteParams>();
  const { data: accountInfo } = useAccount(address, [
    'cfxTransferCount',
    'erc20TransferCount',
    'erc721TransferCount',
    'erc1155TransferCount',
    'stakingBalance',
  ]);

  const menu = (
    <MenuWrapper>
      <Menu.Item>
        <RouterLink to={`/balance-checker?address=${address}`}>
          {t(translations.general.address.more.balanceChecker)}
        </RouterLink>
      </Menu.Item>
      <Menu.Item>
        <RouterLink to={`/report?address=${address}`}>
          {t(translations.general.address.more.report)}
        </RouterLink>
      </Menu.Item>
    </MenuWrapper>
  );

  return (
    <>
      <Helmet>
        <title>{`${t(translations.addressDetail.title)} ${address}`}</title>
        <meta
          name="description"
          content={`${t(translations.addressDetail.content)} ${address}`}
        />
      </Helmet>
      <Main>
        <Head>
          <Title>
            {isZeroAddress(address)
              ? t(translations.general.zeroAddress)
              : t(translations.general.address.address)}
          </Title>
          <HeadAddressLine>
            <span className="address">{address}</span>
            <div className="icons">
              <Copy address={address} />
              <Qrcode address={address} />
              <DropdownWrapper overlay={menu} trigger={['click']}>
                <span onClick={e => e.preventDefault()}>
                  {t(translations.general.address.more.title)}{' '}
                  <img
                    src={DownIcon}
                    alt={t(translations.general.address.more.title)}
                  />
                </span>
              </DropdownWrapper>
              {/*<Report address={address} />*/}
            </div>
          </HeadAddressLine>
        </Head>
        <Top>
          <BalanceCard accountInfo={accountInfo} />
          <TokensCard address={address} />
          <StorageStakingCard accountInfo={accountInfo} />
          <NonceCard accountInfo={accountInfo} />
        </Top>
        {[NETWORK_TYPES.mainnet, NETWORK_TYPES.testnet].includes(
          NETWORK_TYPE,
        ) ? (
          <Middle key="middle">
            <AddressMetadata address={address} accountInfo={accountInfo} />
          </Middle>
        ) : null}
        <Bottom>
          <Table address={address} addressInfo={accountInfo} />
        </Bottom>
      </Main>
    </>
  );
});

export const DropdownWrapper = styled(Dropdown)`
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 0 !important;

  ${media.s} {
    position: relative;
  }

  img {
    width: 11px;
    margin-left: 5px;
  }
`;

export const MenuWrapper = styled(Menu)`
  min-width: 100px;

  li {
    list-style: none;

    &:before {
      display: none;
    }

    a {
      color: #65709a;
    }

    &:hover {
      background-color: #65709a;

      a {
        color: #fff;
      }
    }
  }
`;
