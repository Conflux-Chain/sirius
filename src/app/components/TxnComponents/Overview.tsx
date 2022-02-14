import React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Link } from 'app/components/Link';
import { Description } from 'app/components/Description/Loadable';
import _ from 'lodash';

import { GasFee } from './GasFee';
import { StorageFee } from './StorageFee';
import { Nonce } from './Nonce';
import { TokenTransfer } from './TokenTransfer';
import { Status } from './Status';

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
    txExecErrorInfo,
  } = data;

  return (
    <StyledWrapper>
      <div className="overview-title">
        {t(translations.transaction.overview)}
      </div>
      <Description
        verticle
        size="tiny"
        title={t(translations.transaction.status)}
      >
        <div className="overview-status-and-confirmedEpochCount">
          <Status type={status} txExecErrorInfo={txExecErrorInfo}></Status>
        </div>
      </Description>
      {tokenTransfer?.total ? (
        <Description
          verticle
          size="tiny"
          title={t(translations.transaction.tokenTransferred)}
        >
          <StyledTokenTransferWrapper>
            <TokenTransfer
              transferList={tokenTransfer.list}
              tokenInfoMap={tokenTransferTokenInfo}
              type="overview"
            />
          </StyledTokenTransferWrapper>
        </Description>
      ) : null}
      <Description
        verticle
        size="tiny"
        title={t(translations.transaction.epochConfirmations)}
      >
        <span className="overview-confirmedEpochCount">
          {t(translations.transaction.epochConfirmations, {
            count: _.isNil(confirmedEpochCount) ? '--' : confirmedEpochCount,
          })}
        </span>
      </Description>
      <Description
        verticle
        size="tiny"
        title={t(translations.transaction.storageCollateralized)}
      >
        <StorageFee
          fee={storageCollateralized}
          sponsored={storageCoveredBySponsor}
        />
      </Description>
      <Description
        verticle
        size="tiny"
        title={t(translations.transaction.gasFee)}
      >
        <GasFee fee={gasFee} sponsored={gasCoveredBySponsor} />
      </Description>
      <Description
        verticle
        size="tiny"
        title={t(translations.transaction.nonce)}
        noBorder
      >
        <Nonce nonce={nonce} position={transactionIndex}></Nonce>
      </Description>
      {hash ? (
        <div className="overview-gotoDetail-container">
          <Link className="overview-gotoDetail" href={`/transaction/${hash}`}>
            {t(translations.transaction.gotoDetail)}
          </Link>{' '}
        </div>
      ) : null}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
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
    padding: 1rem 0 0 0;
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
    &.no-border {
      .right {
        border-bottom: none !important;
      }
    }
  }
`;

const StyledTokenTransferWrapper = styled.div`
  max-height: 11.4286rem;
  overflow: auto;
`;
