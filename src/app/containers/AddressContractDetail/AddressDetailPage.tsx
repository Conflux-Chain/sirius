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
import { Main, Title, Bottom, HeadAddressLine, Top, Head } from './layouts';
import { Table } from './Table';

interface RouteParams {
  address: string;
}

export const AddressDetailPage = memo(() => {
  const { t } = useTranslation();
  const { address } = useParams<RouteParams>();
  const bp = useBreakpoint();

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
          <Title>{t(translations.general.address.address)}</Title>
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
          <BalanceCard address={address} />
          <TokensCard address={address} />
          <StorageStakingCard address={address} />
          <NonceCard address={address} />
        </Top>
        <Bottom>
          <Table address={address} />
        </Bottom>
      </Main>
    </>
  );
});
