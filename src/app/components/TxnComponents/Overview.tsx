import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { Description } from '@cfxjs/sirius-next-common/dist/components/Description';
import { hideInDotNet } from 'utils';
import { TransactionAction } from '@cfxjs/sirius-next-common/dist/components/TransactionAction/coreTransactionAction';
import { SkeletonContainer } from '@cfxjs/sirius-next-common/dist/components/SkeletonContainer';
import { reqContract, reqTransactionEventlogs } from 'utils/httpRequest';
import _ from 'lodash';

import { GasFee } from './GasFee';
import { StorageFee } from './StorageFee';
import { Nonce } from './Nonce';
import { Status } from './Status';

export const Overview = ({ data }) => {
  const { t } = useTranslation();
  const {
    hash,
    status,
    to,
    confirmedEpochCount,
    gasFee,
    gasCoveredBySponsor,
    storageCollateralized,
    storageCoveredBySponsor,
    nonce,
    transactionIndex,
    txExecErrorInfo,
    from,
    tokenTransferTokenInfo,
  } = data;

  const [contractInfo, setContractInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [eventlogs, setEventlogs] = useState<any>([]);
  const tokenTransferTokenInfoList = useMemo(() => {
    if (tokenTransferTokenInfo && typeof tokenTransferTokenInfo === 'object') {
      return Object.keys(tokenTransferTokenInfo).map(key => ({
        token: tokenTransferTokenInfo[key],
      }));
    }
    return [];
  }, [tokenTransferTokenInfo]);
  const customInfoList = useMemo(() => {
    if (tokenTransferTokenInfoList.length > 0) {
      return [contractInfo, ...tokenTransferTokenInfoList];
    }
    return [contractInfo];
  }, [tokenTransferTokenInfoList, contractInfo]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!hash) return;
        setLoading(true);

        const reqArr: Promise<any>[] = [];
        if (to) {
          reqArr.push(
            reqContract({
              address: to,
              fields: ['token'],
            }),
          );
        }

        reqArr.push(
          reqTransactionEventlogs({
            transactionHash: hash,
            aggregate: false,
          }),
        );

        const res = await Promise.all(reqArr);

        if (
          to &&
          res[0] &&
          _.isObject(res[0].token) &&
          !_.isEmpty(res[0].token)
        ) {
          setContractInfo({
            token: { address: res[0].address, ...res[0].token },
          });
        }

        const eventlogsIndex = to ? 1 : 0;
        if (
          res[eventlogsIndex] &&
          res[eventlogsIndex].list &&
          res[eventlogsIndex].list.length > 0
        ) {
          setEventlogs(res[eventlogsIndex].list);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [to, hash]);

  const transactionAction = TransactionAction({
    transaction: data,
    event: eventlogs,
    customInfo: customInfoList,
  });
  return (
    <StyledWrapper>
      <div className="overview-title">
        {t(translations.transaction.overview)}
      </div>
      <Description
        vertical
        size="tiny"
        title={t(translations.transaction.status)}
      >
        <div className="overview-status-and-confirmedEpochCount">
          <Status
            type={status}
            txExecErrorInfo={txExecErrorInfo}
            address={from}
            hash={hash}
          ></Status>
        </div>
      </Description>
      {status === 0 && transactionAction && transactionAction.show && (
        <Description
          vertical
          size="tiny"
          title={t(translations.transaction.action.title)}
        >
          <SkeletonContainer shown={loading}>
            {transactionAction.content}
          </SkeletonContainer>
        </Description>
      )}

      <Description
        vertical
        size="tiny"
        title={t(translations.transaction.epochConfirmations)}
      >
        <span className="overview-confirmedEpochCount">
          {t(translations.transaction.epochConfirmations, {
            count: _.isNil(confirmedEpochCount) ? '--' : confirmedEpochCount,
          })}
        </span>
      </Description>
      {hideInDotNet(
        <>
          <Description
            vertical
            size="tiny"
            title={t(translations.transaction.storageCollateralized)}
          >
            <StorageFee
              fee={storageCollateralized}
              sponsored={storageCoveredBySponsor}
            />
          </Description>
          <Description
            vertical
            size="tiny"
            title={t(translations.transaction.gasFee)}
          >
            <GasFee fee={gasFee} sponsored={gasCoveredBySponsor} />
          </Description>
        </>,
      )}
      <Description
        vertical
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
