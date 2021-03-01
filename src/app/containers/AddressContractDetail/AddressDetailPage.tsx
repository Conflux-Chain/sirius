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
import { useBreakpoint } from 'styles/media';
import { Copy, Qrcode } from './HeadLineButtons';
import {
  BalanceCard,
  TokensCard,
  StorageStakingCard,
  NonceCard,
} from './AddressInfoCards';
import { Text } from 'app/components/Text';
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
import { isNullAddress } from '../../../utils';
import { useAccount } from '../../../utils/api';

interface RouteParams {
  address: string;
}

export const AddressDetailPage = memo(() => {
  const { t } = useTranslation();
  const { address } = useParams<RouteParams>();
  const bp = useBreakpoint();
  const { data: accountInfo } = useAccount(address, [
    'cfxTransferCount',
    'erc20TransferCount',
    'erc721TransferCount',
    'erc1155TransferCount',
    'stakingBalance',
  ]);

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
            {isNullAddress(address)
              ? t(translations.general.zeroAddress)
              : t(translations.general.address.address)}
          </Title>
          <HeadAddressLine>
            {bp === 's' ? (
              <Text maxWidth="14.75rem">{address}</Text>
            ) : (
              <span>{address}</span>
            )}
            <Copy address={address} />
            <Qrcode address={address} />
          </HeadAddressLine>
        </Head>
        <Top>
          <BalanceCard accountInfo={accountInfo} />
          <TokensCard address={address} />
          <StorageStakingCard accountInfo={accountInfo} />
          <NonceCard accountInfo={accountInfo} />
        </Top>
        <Middle key="middle">
          <AddressMetadata address={address} accountInfo={accountInfo} />
        </Middle>
        <Bottom>
          <Table address={address} addressInfo={accountInfo} />
        </Bottom>
      </Main>
    </>
  );
});
