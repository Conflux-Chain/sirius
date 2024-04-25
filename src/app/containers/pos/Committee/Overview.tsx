import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Card } from 'sirius-next/packages/common/dist/components/Card';
import { Description } from 'sirius-next/packages/common/dist/components/Description';
import { CopyButton } from 'sirius-next/packages/common/dist/components/CopyButton';
import { SkeletonContainer } from 'sirius-next/packages/common/dist/components/SkeletonContainer';
import { toThousands } from 'utils';
import lodash from 'lodash';

export function Overview({ data, loading }) {
  const { t } = useTranslation();

  return (
    <Card>
      <Description
        title={t(translations.pos.committee.overview.committeeEpoch)}
      >
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.epochNumber) ? (
            '--'
          ) : (
            <>
              {toThousands(data.epochNumber)}{' '}
              <CopyButton copyText={data.epochNumber} />
            </>
          )}
        </SkeletonContainer>
      </Description>
      <Description title={t(translations.pos.committee.overview.totalVotes)}>
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.totalVotingPower) ? (
            '--'
          ) : (
            <>{toThousands(data.totalVotingPower)} </>
          )}
        </SkeletonContainer>
      </Description>
      <Description
        title={t(translations.pos.committee.overview.consensusVotes)}
        noBorder
      >
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.quorumVotingPower) ? (
            '--'
          ) : (
            <>{toThousands(data.quorumVotingPower)} </>
          )}
        </SkeletonContainer>
      </Description>
    </Card>
  );
}
