import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Card } from 'sirius-next/packages/common/dist/components/Card';
import { Description } from 'sirius-next/packages/common/dist/components/Description';
import { CopyButton } from 'sirius-next/packages/common/dist/components/CopyButton';
import SkeletonContainer from 'app/components/SkeletonContainer/Loadable';
import { toThousands, formatTimeStamp } from 'utils';
import { reqPoSAccount } from 'utils/httpRequest';
import { useParams } from 'react-router-dom';
import lodash from 'lodash';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';

export function Overview() {
  const { t } = useTranslation();
  const { address } = useParams<{
    address: string;
  }>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    setLoading(true);

    reqPoSAccount({
      query: {
        identifier: address,
      },
    })
      .then(data => {
        let inQueuePower = 0;
        let outQueuePower = 0;

        try {
          if (Array.isArray(data?.inQueue)) {
            inQueuePower = data.inQueue.reduce(
              (prev, curr) => prev + curr.power,
              0,
            );
          }

          if (Array.isArray(data?.outQueue)) {
            outQueuePower = data.outQueue.reduce(
              (prev, curr) => prev + curr.power,
              0,
            );
          }
        } catch (e) {}

        setData({
          ...data,
          inQueuePower,
          outQueuePower,
        });
      })
      .catch(e => {
        console.log('reqPoSAccount error:', e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [address]);

  return (
    <Card>
      <Description title={t(translations.pos.account.overview.posAddress)}>
        <SkeletonContainer shown={loading}>
          {address} <CopyButton copyText={address} />
        </SkeletonContainer>
      </Description>
      <Description title={t(translations.pos.account.overview.timestamp)}>
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.createdAt)
            ? '--'
            : formatTimeStamp(data.createdAt, 'timezone')}
        </SkeletonContainer>
      </Description>
      <Description title={t(translations.pos.account.overview.lockingRights)}>
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.inQueue) ? (
            '--'
          ) : (
            <>
              {toThousands(data.inQueuePower)}{' '}
              <CopyButton copyText={data.inQueuePower} />
            </>
          )}
        </SkeletonContainer>
      </Description>
      <Description title={t(translations.pos.account.overview.lockedRights)}>
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.locked) ? (
            '--'
          ) : (
            <>
              {toThousands(data.locked)} <CopyButton copyText={data.locked} />
            </>
          )}
        </SkeletonContainer>
      </Description>
      <Description title={t(translations.pos.account.overview.unlockingRights)}>
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.outQueue) ? (
            '--'
          ) : (
            <>
              {toThousands(data.outQueuePower)}{' '}
              <CopyButton copyText={data.outQueuePower} />
            </>
          )}
        </SkeletonContainer>
      </Description>
      <Description title={t(translations.pos.account.overview.unlockRights)}>
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.unlocked) ? (
            '--'
          ) : (
            <>
              {toThousands(data.unlocked)}{' '}
              <CopyButton copyText={data.unlocked} />
            </>
          )}
        </SkeletonContainer>
      </Description>
      <Description
        title={t(translations.pos.account.overview.retiredBlocknumber)}
      >
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.forceRetired) ? (
            '--'
          ) : (
            <>
              {toThousands(data.forceRetired)}{' '}
              <CopyButton copyText={data.forceRetired} />
            </>
          )}
        </SkeletonContainer>
      </Description>
      <Description title={t(translations.pos.account.overview.availableVotes)}>
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.availableVotes) ? (
            '--'
          ) : (
            <>
              {toThousands(data.availableVotes)}{' '}
              <CopyButton copyText={data.availableVotes} />
            </>
          )}
        </SkeletonContainer>
      </Description>
      <Description
        title={t(translations.pos.account.overview.currentCommitteeMember)}
      >
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.committeeInfo) ? (
            '--'
          ) : data.committeeInfo.votingPower > 0 ? (
            <>
              {t(translations.general.yes)} {data.committeeInfo.epochNumber}{' '}
              <CopyButton copyText={data.committeeInfo.epochNumber} />
            </>
          ) : (
            t(translations.general.no)
          )}
        </SkeletonContainer>
      </Description>
      <Description
        title={t(translations.pos.account.overview.rightsInCommittee)}
      >
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.committeeInfo) ? (
            '--'
          ) : (
            <>
              {data.committeeInfo.votingPower}{' '}
              <CopyButton copyText={data.committeeInfo.votingPower} />
            </>
          )}
        </SkeletonContainer>
      </Description>
      <Description title={t(translations.pos.account.overview.totalIncoming)}>
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.totalReward)
            ? '--'
            : `${SDK.Drip(data.totalReward).toCFX()} CFX`}
        </SkeletonContainer>
      </Description>
      <Description
        title={t(translations.pos.account.overview.punishment)}
        noBorder
      >
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.forfeited)
            ? '--'
            : data.forfeited > 0
            ? `${t(translations.general.yes)} (${data.forfeited} ${t(
                translations.pos.common.right,
              )})`
            : t(translations.general.no)}
        </SkeletonContainer>
      </Description>
    </Card>
  );
}
