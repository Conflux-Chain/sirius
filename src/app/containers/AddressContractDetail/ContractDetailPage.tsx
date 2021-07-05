/**
 *
 * ContractDetailPage
 *
 */

import React, { memo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Copy, Qrcode } from './HeadLineButtons';
import {
  BalanceCard,
  NonceCard,
  StorageStakingCard,
  TokensCard,
} from './AddressInfoCards';
import { AddressMetadata, ContractMetadata, Table } from './Loadable';
import { useContract } from 'utils/api';
import {
  Bottom,
  Head,
  HeadAddressLine,
  Main,
  Middle,
  Title,
  Top,
} from './layouts';
import {
  isContractAddress,
  isInnerContractAddress,
  isSpecialAddress,
} from 'utils';
import ContractIcon from '../../../images/contract-icon.png';
import warningInfo from '../../../images/info-white.svg';
import InternalContractIcon from '../../../images/internal-contract-icon.png';
import styled from 'styled-components/macro';
import DownIcon from '../../../images/down.png';
import { Menu } from '@jnoodle/antd';
import { DropdownWrapper, MenuWrapper } from './AddressDetailPage';
import { tokenTypeTag } from '../TokenDetail/Basic';

interface RouteParams {
  address: string;
}

export const ContractDetailPage = memo(() => {
  const { t } = useTranslation();
  const { address } = useParams<RouteParams>();
  const history = useHistory();

  const { data: contractInfo } = useContract(address, [
    'name',
    'icon',
    'sponsor',
    'admin',
    'from',
    'code',
    'website',
    'transactionHash',
    'cfxTransferCount',
    'erc20TransferCount',
    'erc721TransferCount',
    'erc1155TransferCount',
    'stakingBalance',
    'sourceCode',
    'abi',
    'isRegistered',
    'verifyInfo',
  ]);

  useEffect(() => {
    // contract created by other contract, such as 0x8a497f33c6f9e12adf918594ffb5ab5083448e45
    // contractInfo.transactionHash === undefined
    // if (!isInnerContractAddress(address) && !contractInfo.transactionHash) {
    if (
      !isContractAddress(address) &&
      !isInnerContractAddress(address) &&
      !isSpecialAddress(address)
    ) {
      history.replace(`/notfound/${address}`, {
        type: 'contract',
      });
    }
  }, [address, history]);

  const websiteUrl = contractInfo?.website || '';
  const hasWebsite =
    !!websiteUrl &&
    websiteUrl !== 'https://' &&
    websiteUrl !== 'http://' &&
    websiteUrl !== t(translations.general.loading);

  const menu = (
    <MenuWrapper>
      <Menu.Item>
        <RouterLink to={`/contract/${address}`}>
          {t(translations.general.address.more.editContract)}
        </RouterLink>
      </Menu.Item>
      <Menu.Item>
        <RouterLink to={`/sponsor/${address}`}>
          {t(translations.general.address.more.sponsor)}
        </RouterLink>
      </Menu.Item>
      <Menu.Item>
        <RouterLink to={`/report?address=${address}`}>
          {t(translations.general.address.more.report)}
        </RouterLink>
      </Menu.Item>
      {hasWebsite && (
        <Menu.Item>
          <RouterLink
            to={
              websiteUrl.startsWith('http')
                ? websiteUrl
                : `http://${websiteUrl}`
            }
            target="_blank"
          >
            {t(translations.general.address.more.website)}
          </RouterLink>
        </Menu.Item>
      )}
    </MenuWrapper>
  );

  return (
    <>
      <Helmet>
        <title>{`${t(translations.contractDetail.title)} ${address}`}</title>
        <meta
          name="description"
          content={`${t(translations.contractDetail.content)} ${address}`}
        />
      </Helmet>
      <Main key="main">
        <Head key="head">
          <Title>
            {isInnerContractAddress(address)
              ? `${t(translations.general.internalContract)}: ${
                  contractInfo.name
                }`
              : isSpecialAddress(address)
              ? t(translations.general.specialAddress)
              : t(translations.general.contract)}
          </Title>
          <HeadAddressLine>
            <IconWrapper className="address">
              {isInnerContractAddress(address) ? (
                <img
                  src={InternalContractIcon}
                  alt={t(translations.general.internalContract)}
                />
              ) : isSpecialAddress(address) ? null : (
                <img
                  src={ContractIcon}
                  alt={t(translations.general.contract)}
                />
              )}
              &nbsp;
              <span>{address}</span>
            </IconWrapper>
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
              {/*<Edit address={address} />*/}
              {/*<Apply address={address} />*/}
              {/*<Report address={address} />*/}
              {/*{hasWebsite && (*/}
              {/*  <Jump*/}
              {/*    onClick={() => {*/}
              {/*      const url = websiteUrl.startsWith('http')*/}
              {/*        ? websiteUrl*/}
              {/*        : `http://${websiteUrl}`;*/}
              {/*      window.open(url);*/}
              {/*    }}*/}
              {/*  />*/}
              {/*)}*/}
              {isSpecialAddress(address) ? (
                <WarningInfoWrapper>
                  <img src={warningInfo} alt="warning" />
                  <span>{t(translations.general.invalidAddressWarning)}</span>
                </WarningInfoWrapper>
              ) : null}
            </div>
          </HeadAddressLine>
        </Head>
        <Top key="top">
          <BalanceCard accountInfo={contractInfo} />
          <TokensCard address={address} />
          <StorageStakingCard accountInfo={contractInfo} />
          <NonceCard accountInfo={contractInfo} />
        </Top>
        {/* internal contract hide meta data panel */}
        {isContractAddress(address) && (
          <Middle key="middle">
            {contractInfo.stakingBalance != null &&
            contractInfo.stakingBalance !== '0' ? (
              <StakingWrapper>
                <AddressMetadata address={address} accountInfo={contractInfo} />
              </StakingWrapper>
            ) : null}
            <div style={{ position: 'relative' }}>
              <ContractMetadata address={address} contractInfo={contractInfo} />
              {contractInfo.isRegistered && tokenTypeTag(t, 'registered')}
            </div>
          </Middle>
        )}
        <Bottom key="bottom">
          <Table key="table" address={address} addressInfo={contractInfo} />
        </Bottom>
      </Main>
    </>
  );
});

const StakingWrapper = styled.div`
  margin-bottom: 24px;
`;

const IconWrapper = styled.span`
  margin-right: 2px;

  img {
    width: 16px;
    height: 16px;
    margin-bottom: 4px;
  }
`;

const WarningInfoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  background-color: #c65252;
  padding: 5px 16px;
  margin-bottom: 5px;
  margin-top: 5px;
  color: #fff;

  span {
    margin-left: 5px;
  }
`;
