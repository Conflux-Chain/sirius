import React, { useState, useEffect, useMemo } from 'react';
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
import { ReactComponent as StatusIcon } from 'images/status.svg';
import { ReactComponent as WebsiteIcon } from 'images/website.svg';
import { fromDripToCfx } from '@cfxjs/sirius-next-common/dist/utils';

const statusColorMap = {
  Active: '#4AC2AB',
  Retiring: '#FFA500',
  'Force Retiring': '#FFA500',
  Forfeited: '#FA5D5D',
};

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

  const isValidURL = useMemo(() => {
    return (
      data.byte32NameTagInfo?.website &&
      /^https?:\/\//.test(data.byte32NameTagInfo.website)
    );
  }, [data.byte32NameTagInfo]);

  return (
    <Card>
      <Description title={t(translations.pos.account.overview.posAddress)}>
        <SkeletonContainer shown={loading}>
          {data.byte32NameTagInfo?.nameTag && (
            <StyledNameTag>{data.byte32NameTagInfo.nameTag}</StyledNameTag>
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
          {data.status ? (
            <>
              <StatusIcon
                style={{
                  color: statusColorMap[data.status],
                  marginRight: '5px',
                }}
              />
              {t(translations.pos.account.overview.statusValue[data.status])}
              {data.status === 'Force Retiring' && (
                <StyledTag># {data.forceRetired}</StyledTag>
              )}
            </>
          ) : (
            '--'
          )}
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
                <Link
                  href={
                    isValidURL ? data.byte32NameTagInfo?.website : undefined
                  }
                >
                  <WebsiteIcon
                    style={{ color: '#737682', marginRight: '6px' }}
                  />
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
      <Description title={t(translations.pos.account.overview.unlocking)}>
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
      <Description
        title={t(translations.pos.account.overview.totalIncome)}
        noBorder
      >
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.totalReward)
            ? '--'
            : `${fromDripToCfx(data.totalReward, true)} CFX`}
        </SkeletonContainer>
      </Description>
    </Card>
  );
}

const StyledNameTag = styled(Tag)`
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

const StyledTag = styled(Tag)`
  padding: 0px 8px;
  border-radius: 4px;
  background: #fff;
  color: #282d30;
  font-size: 12px;
  font-style: normal;
  font-weight: 450;
  line-height: 22px; /* 183.333% */
  border: 1px solid #ebeced;
  margin-left: 12px;
`;
