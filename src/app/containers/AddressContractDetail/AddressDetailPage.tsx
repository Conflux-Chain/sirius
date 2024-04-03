/**
 *
 * AddressDetailPage
 *
 */

import React, { memo, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { translations } from 'sirius-next/packages/common/dist/locales/i18n';
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
  StyledLabelWrapper,
} from './layouts';
import { AddressMetadata, Table } from './Loadable';
import { isZeroAddress } from '../../../utils';
import { useAccount } from '../../../utils/api';
import { Dropdown, Menu } from '@cfxjs/antd';
import { Link as RouterLink } from 'react-router-dom';
import DownIcon from '../../../images/down.png';
import styled from 'styled-components';
import { media } from '../../../styles/media';
import { useGlobalData } from 'utils/hooks/useGlobal';
import { Bookmark } from '@zeit-ui/react-icons';
import { Text } from 'app/components/Text/Loadable';
import { CreateAddressLabel } from '../Profile/CreateAddressLabel';
import { getLabelInfo } from 'app/components/AddressContainer';
import { useENS } from 'utils/hooks/useENS';
import Nametag from './Nametag';
import { LOCALSTORAGE_KEYS_MAP } from 'utils/enum';

interface RouteParams {
  address: string;
}

export const AddressDetailPage = memo(() => {
  const [globalData = {}] = useGlobalData();
  const { t } = useTranslation();
  const { address } = useParams<RouteParams>();
  const { data: accountInfo } = useAccount(address, [
    'cfxTransferCount',
    'erc20TransferCount',
    'erc721TransferCount',
    'erc1155TransferCount',
    'stakingBalance',
  ]);
  const [visible, setVisible] = useState(false);
  const [ensMap] = useENS({
    address: [address],
  });

  const addressLabelMap = globalData[LOCALSTORAGE_KEYS_MAP.addressLabel];
  const addressLabel = addressLabelMap[address];

  const { label, icon } = useMemo(
    () => getLabelInfo(ensMap[address]?.name, 'ens'),
    [address, ensMap],
  );

  const menu = (
    <MenuWrapper>
      <Menu.Item>
        <RouterLink to={`/balance-checker?address=${address}`}>
          {t(translations.general.address.more.balanceChecker)}
        </RouterLink>
      </Menu.Item>
      <Menu.Item>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            setVisible(true);
          }}
          href=""
        >
          {t(
            translations.general.address.more[
              addressLabel ? 'updateLabel' : 'addLabel'
            ],
          )}
        </a>
      </Menu.Item>
    </MenuWrapper>
  );

  const props = {
    stage: addressLabel ? 'edit' : 'create',
    visible,
    data: {
      address,
    },
    onOk: () => {
      setVisible(false);
    },
    onCancel: () => {
      setVisible(false);
    },
  };

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
            <RouterLink to={`/cns-search?text=${label}`}>
              <StyledLabelWrapper show={!!label}>
                {icon}
                {label}
              </StyledLabelWrapper>
            </RouterLink>{' '}
            <Nametag address={address}></Nametag>
          </Title>
          <HeadAddressLine>
            <span className="address">
              {address}
              {addressLabel ? (
                <>
                  {' '}
                  (
                  <Text span hoverValue={t(translations.profile.tip.label)}>
                    <Bookmark color="var(--theme-color-gray2)" size={16} />
                  </Text>
                  {addressLabel})
                </>
              ) : (
                ''
              )}
            </span>
            <div className="icons">
              <Copy address={address} />
              <Qrcode address={address} />
              <DropdownWrapper overlay={menu} trigger={['hover']}>
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
        <div key="middle">
          <AddressMetadata address={address} accountInfo={accountInfo} />
        </div>
        <Bottom>
          <Table address={address} addressInfo={accountInfo} key={address} />
        </Bottom>
        <CreateAddressLabel {...props}></CreateAddressLabel>
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
      background-color: var(--theme-color-blue0);

      a {
        color: #fff;
      }
    }
  }
`;
