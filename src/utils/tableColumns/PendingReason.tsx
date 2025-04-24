import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components';
import { Popover } from '@cfxjs/sirius-next-common/dist/components/Popover';
import { reqPendingTxs } from 'utils/httpRequest';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { formatAddress, formatBalance } from 'utils';
import BigNumber from 'bignumber.js';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';

interface Props {
  detail?: any;
  account?: string;
  hash?: string;
}

export const PendingReason = ({
  detail: _detail,
  account,
  hash: _hash,
}: Props) => {
  const { t } = useTranslation();
  const [detail, setDetail] = useState(_detail || {});

  useEffect(() => {
    async function main() {
      if (account) {
        const data = await reqPendingTxs({
          query: {
            accountAddress: account,
          },
        });

        if (data) {
          const { pendingDetail, pendingTransactions } = data;

          // not current tx pending reason
          if (pendingTransactions[0]?.hash === _hash) {
            setDetail(pendingDetail);
          }
        }
      }
    }

    main().catch(console.log);
  }, [_hash, account]);

  const codeMap = useMemo(() => {
    const {
      futrueNonce,
      notEnoughCash,
      readyToPack,
      tooOldEpoch,
      fullnodeInnerError,
    } = translations.transaction.pendingDetails;
    return {
      '11': {
        summary: futrueNonce.summary,
        detail: futrueNonce.detail,
        tip: futrueNonce.tip,
      },
      '20': {
        summary: notEnoughCash.summary,
        detail: notEnoughCash.original.detail,
        tip: notEnoughCash.original.tip,
      },
      '21': {
        summary: notEnoughCash.summary,
        detail: notEnoughCash.contractCreateAndToEOA.detail,
        tip: notEnoughCash.contractCreateAndToEOA.tip,
      },
      '22': {
        summary: notEnoughCash.summary,
        detail: notEnoughCash.contractCreateAndToEOA.detail,
        tip: notEnoughCash.contractCreateAndToEOA.tip,
      },
      '23': {
        summary: notEnoughCash.summary,
        detail: notEnoughCash.toContract.detail,
        tip: notEnoughCash.toContract.tip,
        reason: notEnoughCash.toContract.reason,
      },
      '31': {
        summary: readyToPack.summary,
        detail: readyToPack.epochExceed.detail,
        tip: readyToPack.epochExceed.tip,
      },
      '32': {
        summary: readyToPack.summary,
        detail: readyToPack.lowGasPrice.detail,
        tip: readyToPack.lowGasPrice.tip,
      },
      '41': {
        summary: tooOldEpoch.summary,
        detail: tooOldEpoch.detail,
        tip: tooOldEpoch.tip,
      },
      '51': {
        summary: fullnodeInnerError.summary,
        detail: fullnodeInnerError.detail,
        tip: fullnodeInnerError.tip,
      },
    };
  }, []);

  const getDetail = useCallback(() => {
    const { notEnoughCash } = translations.transaction.pendingDetails;
    const i18n = codeMap[detail.code];

    let params = {};

    if (detail.code === 11 || detail.code === 31 || detail.code === 32) {
      params = detail.params;
    } else if (detail.code === 20) {
      params = {
        original: detail.message,
      };
    } else if (detail.code === 21 || detail.code === 22) {
      const { value, gas, gasPrice, storageLimit, balance } = detail.params;

      params = {
        total: formatBalance(
          new BigNumber(value)
            .plus(new BigNumber(gas).multipliedBy(gasPrice))
            .plus(new BigNumber(storageLimit).multipliedBy(1e18).div(1024)),
          18,
          false,
          {
            precision: 18,
          },
        ),
        value: detail.params.value,
        gas: detail.params.gas,
        gasPrice: detail.params.gasPrice,
        storageLimit: detail.params.storageLimit,
        balance: formatBalance(balance),
      };
    } else if (detail.code === 23) {
      const {
        value,
        gas,
        gasPrice,
        storageLimit,
        balance,
        isWhitelisted,
        isGasFeeSponsored,
        isColFeeSponsored,
        sponsorInfo: {
          sponsorGasBound,
          sponsorBalanceForGas,
          sponsorBalanceForCollateral,
        },
      } = detail.params;

      const gasFee = new BigNumber(gas).multipliedBy(gasPrice);
      const storageFee = new BigNumber(storageLimit)
        .multipliedBy(1e18)
        .div(1024);
      let total = new BigNumber(value).plus(gasFee).plus(storageFee);
      let gasSponsorStr = '';
      let storageSponsorStr = '';
      let reason = '';

      if (isWhitelisted) {
        if (isGasFeeSponsored) {
          total = total.minus(gasFee);
          gasSponsorStr = ` - gasFee sponsored (${gasFee.toNumber()})`;
        } else {
          if (gasFee.isGreaterThan(sponsorGasBound)) {
            reason = t(notEnoughCash.toContract.reason.exceedUpperBound, {
              sponsorGasBound,
            });
          } else if (gasFee.isGreaterThan(sponsorBalanceForGas)) {
            reason = t(notEnoughCash.toContract.reason.exceedGasFeeBalance, {
              sponsorBalanceForGas,
            });
          }
        }
        if (isColFeeSponsored) {
          total = total.minus(storageFee);
          gasSponsorStr = ` - storageFee sponsored (${storageFee.toNumber()})`;
        } else {
          if (storageFee.isGreaterThan(sponsorBalanceForCollateral)) {
            reason = t(
              notEnoughCash.toContract.reason.exceedStorageFeeBalance,
              {
                sponsorBalanceForCollateral,
              },
            );
          }
        }
      } else {
        reason = t(notEnoughCash.toContract.reason.notSponsored);
      }

      params = {
        total: formatBalance(total, 18, false, {
          precision: 18,
        }),
        value: detail.params.value,
        gas: detail.params.gas,
        gasPrice: detail.params.gasPrice,
        storageLimit: detail.params.storageLimit,
        balance: formatBalance(balance),
        gasSponsor: gasSponsorStr,
        storageSponsor: storageSponsorStr,
        reason,
      };
    }

    const content = (
      <StyledPendingContentWrapper>
        <div>
          <b>{t(translations.transaction.pending.detail)} </b>
          {t(i18n.detail, { ...params })}
        </div>
        <div>
          <b>{t(translations.transaction.pending.tip)}</b> {t(i18n.tip)}
        </div>
        <div>
          <b>{t(translations.transaction.pending.reference)}</b>{' '}
          <a href={t(translations.transaction.pending.link)} target="__blank">
            {t(translations.transaction.pending.link)}
          </a>
        </div>
      </StyledPendingContentWrapper>
    );

    return (
      <StyledPendingReasonWrapper>
        <div className="summary">{t(i18n.summary)}</div>
        <Popover content={content}>
          <div className="detail">
            {t(translations.transaction.pending.view)}
          </div>
        </Popover>
      </StyledPendingReasonWrapper>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail]);

  if (account) {
    if (detail.code) {
      return getDetail();
    } else {
      return (
        <Link
          href={`/address/${formatAddress(
            account as string,
          )}?transactionType=pending`}
        >
          {t(translations.transaction.pendingReasonLink)}
        </Link>
      );
    }
  } else {
    if (detail.code) {
      return getDetail();
    } else {
      return <>--</>;
    }
  }
};

const StyledPendingReasonWrapper = styled.div`
  display: inline-flex;
  color: #333;

  .summary {
    padding-right: 10px;
  }

  .detail {
    color: var(--theme-color-blue2);
    display: inline;
  }
`;

const StyledPendingContentWrapper = styled.div`
  max-width: 450px;

  ${media.s} {
    max-width: 300px;
  }
  b {
    color: var(--theme-color-blue0);
  }
`;
