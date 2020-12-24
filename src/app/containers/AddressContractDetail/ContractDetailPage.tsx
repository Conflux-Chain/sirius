/**
 *
 * ContractDetailPage
 *
 */

import React, { memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useBreakpoint } from 'styles/media';
import { Copy, Qrcode, Edit, Jump, Apply } from './HeadLineButtons';
import {
  BalanceCard,
  TokensCard,
  StorageStakingCard,
  NonceCard,
} from './AddressInfoCards';
import { ContractMetadata } from './Loadable';
import { Table } from './Loadable';
import { Text } from 'app/components/Text';
import { useContract } from 'utils/api';
import {
  Main,
  Title,
  Middle,
  Bottom,
  HeadAddressLine,
  Top,
  Head,
} from './layouts';
import { isContractAddress } from 'utils';

interface RouteParams {
  address: string;
}

export const ContractDetailPage = memo(() => {
  const { t } = useTranslation();
  const { address } = useParams<RouteParams>();
  const bp = useBreakpoint();

  const { data: contractInfo } = useContract(address, ['website']);
  const websiteUrl = contractInfo?.website || '';
  const hasWebsite =
    !!websiteUrl && websiteUrl !== t(translations.general.loading);

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
          <Title>{t(translations.general.contract)}</Title>
          <HeadAddressLine>
            {bp === 's' ? (
              <Text maxWidth="14.75rem">{address}</Text>
            ) : (
              <span>{address}</span>
            )}
            <Copy address={address} />
            <Qrcode address={address} />
            <Edit address={address} />
            <Apply address={address} />
            {hasWebsite && (
              <Jump
                onClick={() => {
                  const url = websiteUrl.startsWith('http')
                    ? websiteUrl
                    : `http://${websiteUrl}`;
                  window.open(url);
                }}
              />
            )}
          </HeadAddressLine>
        </Head>
        <Top key="top">
          <BalanceCard address={address} />
          <TokensCard address={address} />
          <StorageStakingCard address={address} />
          <NonceCard address={address} />
        </Top>
        {isContractAddress(address) && (
          <Middle key="middle">
            <ContractMetadata address={address} />
          </Middle>
        )}
        <Bottom key="bottom">
          <Table key="table" address={address} />
        </Bottom>
      </Main>
    </>
  );
});
