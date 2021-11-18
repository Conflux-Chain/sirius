import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Card } from 'app/components/Card/Loadable';
import { Description } from 'app/components/Description/Loadable';
import { CopyButton } from 'app/components/CopyButton/Loadable';
import SkeletonContainer from 'app/components/SkeletonContainer/Loadable';
import { formatTimeStamp } from 'utils';
import lodash from 'lodash';
import { Link } from 'app/components/Link/Loadable';

export function Overview({ data, loading }) {
  const { t } = useTranslation();

  return (
    <Card>
      <Description title={t(translations.pos.transaction.overview.hash)}>
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
      <Description title={t(translations.pos.transaction.overview.status)}>
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.status)
            ? '--'
            : t(translations.pos.common.txStatus[data.status])}
        </SkeletonContainer>
      </Description>
      <Description title={t(translations.pos.transaction.overview.type)}>
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.type)
            ? '--'
            : t(translations.pos.common.txType[data.type])}
        </SkeletonContainer>
      </Description>
      <Description title={t(translations.pos.transaction.overview.timestamp)}>
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.timestamp)
            ? '--'
            : formatTimeStamp(data.timestamp, 'timezone')}
        </SkeletonContainer>
      </Description>
      <Description title={t(translations.pos.transaction.overview.number)}>
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.number) ? (
            '--'
          ) : (
            <>
              {data.number} <CopyButton copyText={data.number} />
            </>
          )}
        </SkeletonContainer>
      </Description>
      <Description title={t(translations.pos.transaction.overview.blockHash)}>
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.blockHash) ? (
            '--'
          ) : (
            <>
              <Link href={`/pos/blocks/${data.blockHash}`}>
                {data.blockHash}
              </Link>{' '}
              <CopyButton copyText={data.blockHash} />
            </>
          )}
        </SkeletonContainer>
      </Description>
      <Description
        title={t(translations.pos.transaction.overview.blockNumber)}
        noBorder
      >
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.blockNumber) ? (
            '--'
          ) : (
            <>
              {data.blockNumber} <CopyButton copyText={data.blockNumber} />
            </>
          )}
        </SkeletonContainer>
      </Description>
      {/* <Description
        title={t(translations.pos.transaction.overview.payload)}
        noBorder
      >
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.blockNumber) ? (
            '--'
          ) : (
            <>
              {data.blockNumber} <CopyButton copyText={data.blockNumber} />
            </>
          )}
        </SkeletonContainer>
      </Description> */}
    </Card>
  );
}
