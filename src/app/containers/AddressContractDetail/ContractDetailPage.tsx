/**
 *
 * ContractDetailPage
 *
 */

import React, { memo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useBreakpoint } from 'styles/media';
import { Apply, Copy, Edit, Jump, Qrcode } from './HeadLineButtons';
import {
  BalanceCard,
  NonceCard,
  StorageStakingCard,
  TokensCard,
} from './AddressInfoCards';
import { ContractMetadata, Table } from './Loadable';
import { Text } from 'app/components/Text';
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
import { isContractAddress, isInnerContractAddress } from 'utils';
import { FileText } from '@zeit-ui/react-icons';

interface RouteParams {
  address: string;
}

export const ContractDetailPage = memo(() => {
  const { t } = useTranslation();
  const { address } = useParams<RouteParams>();
  const bp = useBreakpoint();
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
    'erc20TransferCount',
    'erc721TransferCount',
    'erc1155TransferCount',
    'sourceCode',
    'abi',
  ]);

  useEffect(() => {
    // contract created by other contract, such as 0x8a497f33c6f9e12adf918594ffb5ab5083448e45
    // contractInfo.transactionHash === undefined
    // if (!isInnerContractAddress(address) && !contractInfo.transactionHash) {
    if (!isContractAddress(address) && !isInnerContractAddress(address)) {
      history.replace(`/notfound/${address}`, {
        type: 'contract',
      });
    }
  }, [address, history]);

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
          <Title>
            {isInnerContractAddress(address)
              ? t(translations.general.internalContract)
              : t(translations.general.contract)}
          </Title>
          <HeadAddressLine>
            {bp === 's' ? (
              <Text maxWidth="14.75rem">{address}</Text>
            ) : (
              <>
                <FileText
                  size={12}
                  color={
                    isInnerContractAddress(address) ? '#13b5c4' : '#9b9eac'
                  }
                />
                &nbsp;
                <span>{address}</span>
              </>
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
          <BalanceCard accountInfo={contractInfo} />
          <TokensCard address={address} />
          <StorageStakingCard accountInfo={contractInfo} />
          <NonceCard accountInfo={contractInfo} />
        </Top>
        {/* internal contract hide meta data panel */}
        {isContractAddress(address) && (
          <Middle key="middle">
            <ContractMetadata address={address} contractInfo={contractInfo} />
          </Middle>
        )}
        <Bottom key="bottom">
          <Table key="table" address={address} addressInfo={contractInfo} />
        </Bottom>
      </Main>
    </>
  );
});
