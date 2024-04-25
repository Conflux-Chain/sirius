import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Card } from 'sirius-next/packages/common/dist/components/Card';
import { Description } from 'sirius-next/packages/common/dist/components/Description';
import { CopyButton } from 'sirius-next/packages/common/dist/components/CopyButton';
import { SkeletonContainer } from 'sirius-next/packages/common/dist/components/SkeletonContainer';
import { toThousands, formatTimeStamp } from 'utils';
import lodash from 'lodash';
import { Link } from 'sirius-next/packages/common/dist/components/Link';

export function Overview({ data, loading }) {
  const { t } = useTranslation();

  return (
    <Card>
      <Description title={t(translations.pos.block.overview.blockHash)}>
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.hash) ? (
            '--'
          ) : (
            <>
              {data.hash} <CopyButton copyText={data.hash} />
            </>
          )}
        </SkeletonContainer>
      </Description>
      <Description title={t(translations.pos.block.overview.epoch)}>
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.epoch) ? (
            '--'
          ) : (
            <>
              {toThousands(data.epoch)} <CopyButton copyText={data.epoch} />
            </>
          )}
        </SkeletonContainer>
      </Description>
      <Description title={t(translations.pos.block.overview.blockNumber)}>
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.blockHeight) ? (
            '--'
          ) : (
            <>
              {toThousands(data.blockHeight)}{' '}
              <CopyButton copyText={data.blockHeight} />
            </>
          )}
        </SkeletonContainer>
      </Description>
      <Description title={t(translations.pos.block.overview.minerAddress)}>
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.miner) ? (
            '--'
          ) : (
            <>
              <Link href={`/pos/accounts/${data.miner}`}>{data.miner} </Link>{' '}
              <CopyButton copyText={data.miner} />
            </>
          )}
        </SkeletonContainer>
      </Description>
      <Description title={t(translations.pos.block.overview.timestamp)}>
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.timestamp)
            ? '--'
            : formatTimeStamp(data.timestamp, 'timezone')}
        </SkeletonContainer>
      </Description>
      <Description title={t(translations.pos.block.overview.status)}>
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.status)
            ? '--'
            : t(translations.pos.common.votingStatus[data.status])}
        </SkeletonContainer>
      </Description>
      <Description
        title={t(translations.pos.block.overview.powBlockHash)}
        noBorder
      >
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.powBlockHash) ? (
            '--'
          ) : (
            <>
              <Link href={`/block/${data.powBlockHash}`}>
                {data.powBlockHash}{' '}
              </Link>{' '}
              <CopyButton copyText={data.powBlockHash} />
            </>
          )}
        </SkeletonContainer>
      </Description>
    </Card>
  );
}
