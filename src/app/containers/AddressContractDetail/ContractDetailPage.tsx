/**
 *
 * ContractDetailPage
 *
 */

import React, { memo, useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory, useParams } from 'react-router-dom';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
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
  StyledLabelWrapper,
} from './layouts';
import {
  isCoreContractAddress,
  isInnerContractAddress,
  isSpecialAddress,
} from 'utils';
import ContractIcon from '../../../images/contract-icon.png';
import warningInfo from '../../../images/info-white.svg';
import InternalContractIcon from '../../../images/internal-contract-icon.png';
import styled from 'styled-components';
import DownIcon from '../../../images/down.png';
import { MenuItem } from '@cfxjs/sirius-next-common/dist/components/Dropdown';
import { DropdownWrapper, MenuWrapper } from './AddressDetailPage';
import { tokenTypeTag } from '../TokenDetail/Basic';
import { useGlobalData } from 'utils/hooks/useGlobal';
import { Bookmark } from '@zeit-ui/react-icons';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
import { CreateAddressLabel } from '../Profile/CreateAddressLabel';
import { getLabelInfo } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/label';
import { useENS } from '@cfxjs/sirius-next-common/dist/utils/hooks/useENS';
import Nametag from './Nametag';
import { LOCALSTORAGE_KEYS_MAP } from 'utils/enum';
import { IS_CORESPACE, IS_MAINNET, IS_TESTNET } from 'env';

interface RouteParams {
  address: string;
}

export const ContractDetailPage = memo(() => {
  const [globalData] = useGlobalData();
  const { t } = useTranslation();
  const { address } = useParams<RouteParams>();
  const history = useHistory();
  const [visible, setVisible] = useState(false);

  const { data: contractInfo } = useContract(address, [
    'name',
    'iconUrl',
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
    if (!isCoreContractAddress(address) && !isSpecialAddress(address)) {
      history.replace(`/notfound/${address}`, {
        type: 'contract',
      });
    }
  }, [address, history]);

  const { ens } = useENS(address);

  const websiteUrl = contractInfo?.website || '';
  const hasWebsite =
    !!websiteUrl &&
    websiteUrl !== 'https://' &&
    websiteUrl !== 'http://' &&
    websiteUrl !== t(translations.general.loading);
  const addressLabelMap = globalData[LOCALSTORAGE_KEYS_MAP.addressLabel];
  const addressLabel = addressLabelMap?.[address];

  const { label, icon } = useMemo(
    () => getLabelInfo(ens[address]?.name, 'ens'),
    [address, ens],
  );

  const menu = (
    <MenuWrapper>
      {!contractInfo?.verify?.exactMatch ? (
        <MenuItem>
          <Link href={`/contract-verification?address=${address}`}>
            {t(translations.general.address.more.verifyContract)}
          </Link>
        </MenuItem>
      ) : null}
      <MenuItem>
        <Link href={`/balance-checker?address=${address}`}>
          {t(translations.general.address.more.balanceChecker)}
        </Link>
      </MenuItem>
      <MenuItem>
        <Link href={`/contract-info/${address}`}>
          {t(translations.general.address.more.editContract)}
        </Link>
      </MenuItem>
      <MenuItem>
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
      </MenuItem>
      {IS_CORESPACE && (IS_MAINNET || IS_TESTNET) ? (
        <MenuItem>
          <Link href={`/sponsor/${address}`}>
            {t(translations.general.address.more.sponsor)}
          </Link>
        </MenuItem>
      ) : null}
      {hasWebsite && (
        <MenuItem>
          <Link
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();

              const link = websiteUrl.startsWith('http')
                ? websiteUrl
                : `http://${websiteUrl}`;

              window.open(link);
            }}
          >
            {t(translations.general.address.more.website)}
          </Link>
        </MenuItem>
      )}
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
            <Link href={`/cns-search?text=${label}`}>
              <StyledLabelWrapper $show={!!label}>
                {icon}
                {label}
              </StyledLabelWrapper>
            </Link>{' '}
            <Nametag address={address}></Nametag>
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
              {addressLabel ? (
                <>
                  {' '}
                  (
                  <Text
                    tag="span"
                    hoverValue={t(translations.profile.tip.label)}
                  >
                    <Bookmark color="var(--theme-color-gray2)" size={16} />
                  </Text>
                  {addressLabel})
                </>
              ) : (
                ''
              )}
            </IconWrapper>
            <div className="icons">
              <Copy address={address} />
              <Qrcode address={address} />
              <DropdownWrapper overlay={menu}>
                <span onClick={e => e.preventDefault()}>
                  {t(translations.general.address.more.title)}{' '}
                  <img
                    src={DownIcon}
                    alt={t(translations.general.address.more.title)}
                  />
                </span>
              </DropdownWrapper>
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
        {isCoreContractAddress(address, false) && (
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
          <Table key={address} address={address} addressInfo={contractInfo} />
        </Bottom>
        <CreateAddressLabel {...props}></CreateAddressLabel>
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
