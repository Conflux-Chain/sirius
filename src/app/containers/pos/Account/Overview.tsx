import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Card } from '@cfxjs/sirius-next-common/dist/components/Card';
import { Description } from '@cfxjs/sirius-next-common/dist/components/Description';
import { CopyButton } from '@cfxjs/sirius-next-common/dist/components/CopyButton';
import { SkeletonContainer } from '@cfxjs/sirius-next-common/dist/components/SkeletonContainer';
import { toThousands, formatTimeStamp } from 'utils';
import { reqPoSAccountOverview } from 'utils/httpRequest';
import { useParams } from 'react-router-dom';
import lodash from 'lodash';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { Tag } from '@cfxjs/antd';
import styled from 'styled-components';

export function Overview() {
  const { t } = useTranslation();
  const { address } = useParams<{
    address: string;
  }>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    setLoading(true);

    reqPoSAccountOverview({
      query: {
        address,
      },
    })
      .then(setData)
      .catch(e => {
        console.log('reqPoSAccountOverview error:', e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [address]);

  return (
    <Card>
      <Description title={t(translations.pos.account.overview.posAddress)}>
        <SkeletonContainer shown={loading}>
          {data.byte32NameTagInfo?.nameTag && (
            <StyledTag>{data.byte32NameTagInfo.nameTag}</StyledTag>
          )}
          {address} <CopyButton copyText={address} />
        </SkeletonContainer>
      </Description>
      <Description title={t(translations.pos.account.overview.timestamp)}>
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.createdAt)
            ? '--'
            : formatTimeStamp(data.createdAt)}
        </SkeletonContainer>
      </Description>
      <Description title={t(translations.pos.account.overview.nodeType)}>
        <SkeletonContainer shown={loading}>
          {data.type
            ? t(translations.pos.account.overview.nodeTypeValue[data.type])
            : '--'}
        </SkeletonContainer>
      </Description>
      <Description title={t(translations.pos.account.overview.status)}>
        <SkeletonContainer shown={loading}>
          {data.status
            ? t(translations.pos.account.overview.statusValue[data.status])
            : '--'}
        </SkeletonContainer>
      </Description>
      <Description
        title={t(translations.pos.account.overview.totalVotingPower)}
      >
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.availableVotesInCfx) ? (
            '--'
          ) : (
            <>
              {toThousands(data.availableVotesInCfx ?? 0)}
              {' CFX'}
            </>
          )}
        </SkeletonContainer>
      </Description>
      {/* <Description title={t(translations.pos.account.overview.staker)}>
        <SkeletonContainer shown={loading}>
          {t(translations.pos.account.overview.stakerValue, {
            count: toThousands(data.stakers ?? 0),
          })}
        </SkeletonContainer>
      </Description> */}
      {data.type === 'Public Pos Pool' && (
        <>
          <Description title={t(translations.pos.account.overview.poolName)}>
            <SkeletonContainer shown={loading}>
              {data.poolInfo?.name}
            </SkeletonContainer>
          </Description>
          <Description
            title={t(translations.pos.account.overview.poolContractAddress)}
          >
            <SkeletonContainer shown={loading}>
              {data.poolInfo?.address}
            </SkeletonContainer>
          </Description>
          <Description title={t(translations.pos.account.overview.links)}>
            <SkeletonContainer shown={loading}>
              {data.byte32NameTagInfo?.website && (
                <Link href={data.byte32NameTagInfo.website}>
                  {t(translations.pos.account.overview.linkValue.website)}
                </Link>
              )}
            </SkeletonContainer>
          </Description>
        </>
      )}
      <Description title={t(translations.pos.account.overview.withdrawable)}>
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.withdrawableInCfx) ? (
            '--'
          ) : (
            <>
              {toThousands(data.withdrawableInCfx ?? 0)}
              {' CFX'}
            </>
          )}
        </SkeletonContainer>
      </Description>
      <Description title={t(translations.pos.account.overview.freezing)}>
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.lockingInCfx) ? (
            '--'
          ) : (
            <>
              {toThousands(data.lockingInCfx ?? 0)}
              {' CFX'}
            </>
          )}
        </SkeletonContainer>
      </Description>
      <Description
        title={t(translations.pos.account.overview.unlocking)}
        noBorder
      >
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.unlockingInCfx) ? (
            '--'
          ) : (
            <>
              {toThousands(data.unlockingInCfx ?? 0)}
              {' CFX'}
            </>
          )}
        </SkeletonContainer>
      </Description>
    </Card>
  );
}

const StyledTag = styled(Tag)`
  padding: 0px 8px;
  border-radius: 4px;
  background: #f1f5fe;
  color: #282d30;
  font-size: 12px;
  font-style: normal;
  font-weight: 450;
  line-height: 22px; /* 183.333% */
  border: none;
  margin-right: 12px;
`;
