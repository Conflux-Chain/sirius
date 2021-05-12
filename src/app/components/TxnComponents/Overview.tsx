import React from 'react';
import styled from 'styled-components/macro';
import { Status } from 'app/components/Status/Loadable';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Link } from 'app/components/Link';
import { Description } from 'app/components/Description/Loadable';

import { GasFee } from './GasFee';
import { StorageFee } from './StorageFee';
import { Nonce } from './Nonce';
import { TokenTransfer } from './TokenTransfer';

export const Overview = ({ data }) => {
  const { t } = useTranslation();
  const {
    hash,
    status,
    confirmedEpochCount,
    gasFee,
    gasCoveredBySponsor,
    storageCollateralized,
    storageCoveredBySponsor,
    nonce,
    transactionIndex,
    tokenTransferTokenInfo,
    tokenTransfer,
  } = data;

  return (
    <StyledWrapper>
      <div className="overview-title">
        {t(translations.transaction.overview)}
      </div>
      <Description verticle small title={t(translations.transaction.status)}>
        <div className="overview-status-and-confirmedEpochCount">
          <Status type={status} />
          {t(translations.transaction.epochConfirmations, {
            count: confirmedEpochCount || '--',
          })}
        </div>
      </Description>
      {tokenTransfer?.total ? (
        <Description
          verticle
          small
          title={
            <>
              {t(translations.transaction.tokenTransferred)}
              {` (${tokenTransfer.list.length}/${tokenTransfer.total})`}
            </>
          }
        >
          <TokenTransfer
            transferList={tokenTransfer.list.slice(0, 3)}
            tokenInfoMap={tokenTransferTokenInfo}
          />
        </Description>
      ) : null}
      <Description
        verticle
        small
        title={t(translations.transaction.storageCollateralized)}
      >
        <StorageFee
          fee={storageCollateralized}
          sponsored={storageCoveredBySponsor}
        />
      </Description>
      <Description verticle small title={t(translations.transaction.gasFee)}>
        <GasFee fee={gasFee} sponsored={gasCoveredBySponsor} />
      </Description>
      <Description
        verticle
        small
        title={t(translations.transaction.nonce)}
        noBorder
      >
        <Nonce nonce={nonce} position={transactionIndex}></Nonce>
      </Description>
      <div className="overview-gotoDetail-container">
        <Link className="overview-gotoDetail" href={`/transaction/${hash}`}>
          {t(translations.transaction.gotoDetail)}
        </Link>{' '}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  border: 1px solid;
  width: 25.7143rem;
  padding: 0.3571rem;
  overflow: hidden;

  .overview-title {
    font-weight: 500;
    color: #7e8598;
    line-height: 1.2857rem;
    border-bottom: 1px solid #e8e9ea !important;
    padding-bottom: 0.8571rem;
  }

  .overview-status-and-confirmedEpochCount {
    display: flex;
  }

  .overview-gotoDetail-container {
    padding: 1.4286rem 0 0 0;
    margin-bottom: -0.5714rem;
    display: flex;
    justify-content: flex-end;

    .link.overview-gotoDetail {
      text-decoration: underline;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .description {
    .right {
      border-bottom: 1px solid #e8e9ea !important;
    }

    &.no-border {
      .right {
        border-bottom: none !important;
      }
    }
  }
`;
