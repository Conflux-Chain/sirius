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
import styled from 'styled-components';
import { media } from 'styles/media';
import { Typography } from '@cfxjs/antd';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { PoSAddressContainer } from 'app/components/AddressContainer/Loadable';

const { Text } = Typography;

export function Overview({ data, loading }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.includes('zh') ? 'zh' : 'en';

  let payloadInfoItems: Array<{
    label: React.ReactNode;
    content: React.ReactNode;
  }> = [];

  try {
    if (!lodash.isNil(data.payload)) {
      payloadInfoItems = Object.keys(data.payload).map(p => {
        let label: React.ReactNode;
        let content: React.ReactNode;

        if (p === 'conflictingVotes') {
          label = `${t(translations.pos.common.txPayload.conflictingVotes)}`;

          try {
            content = `${t(
              translations.pos.common.txPayload.conflictVoteType,
            )}: ${t(
              translations.pos.common.txPayload[
                data.payload[p].conflictVoteType
              ] || '--',
            )}, ${t(translations.pos.common.txPayload.first)}: ${
              data.payload[p].first
            }, ${t(translations.pos.common.txPayload.second)}: ${
              data.payload[p].second
            }`;
          } catch (e) {}
        } else {
          label = t(translations.pos.common.txPayload[p]) || p;
          content = data.payload[p];
        }

        if (lodash.isNil(content)) {
          content = '--';
        } else if (['targetTerm', 'votingPower', 'height'].includes(p)) {
          content = SDK.format.uInt(content);
        } else if (p === 'address') {
          content = (
            <>
              <PoSAddressContainer
                value={content as string}
                isFull={true}
              ></PoSAddressContainer>{' '}
              <CopyButton copyText={content as string} />
            </>
          );
        } else if (p === 'blockHash') {
          content = (
            <>
              <Link href={`/block/${content}`}>{content}</Link>{' '}
              <CopyButton copyText={content as string} />
            </>
          );
        }

        return {
          label: label,
          content: content,
        };
      });
    }
  } catch (e) {
    console.log('payload error: ', e);
  }

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
              {data.number} <CopyButton copyText={String(data.number)} />
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
      <Description title={t(translations.pos.transaction.overview.blockNumber)}>
        <SkeletonContainer shown={loading}>
          {lodash.isNil(data.blockNumber) ? (
            '--'
          ) : (
            <>
              {data.blockNumber}{' '}
              <CopyButton copyText={String(data.blockNumber)} />
            </>
          )}
        </SkeletonContainer>
      </Description>
      <Description
        title={t(translations.pos.transaction.overview.payload)}
        noBorder
      >
        <SkeletonContainer shown={loading}>
          {!payloadInfoItems.length ? (
            '--'
          ) : (
            <StyledPayloadWrapper>
              <DescriptionInline
                data={payloadInfoItems}
                type={data.type}
                labelWidth={lang === 'zh' ? 90 : 180}
              ></DescriptionInline>
            </StyledPayloadWrapper>
          )}
        </SkeletonContainer>
      </Description>
    </Card>
  );
}

const StyledPayloadWrapper = styled.div`
  background-color: rgb(247, 247, 248);
  margin: -0.3571rem;
  padding: 0.3571rem;
`;

interface DescriptionInlinePropsType {
  data: Array<{
    key?: string | number;
    label: React.ReactNode;
    content: React.ReactNode;
  }>;
  type: string;
  labelWidth?: number;
}
const DescriptionInline = ({
  data,
  type,
  labelWidth = 100,
}: DescriptionInlinePropsType) => {
  return (
    <StyledDescriptionInlineWrapper labelWidth={labelWidth}>
      {data.map((d, i) => {
        return (
          <div className="description-inline-item" key={d.key || i}>
            <Text
              className="description-inline-item-label"
              ellipsis={{
                suffix: ':',
                tooltip: d.label,
              }}
            >
              {d.label}
            </Text>{' '}
            <span className="description-inline-item-content">{d.content}</span>
          </div>
        );
      })}
    </StyledDescriptionInlineWrapper>
  );
};

const StyledDescriptionInlineWrapper = styled.div<{
  labelWidth?: number;
}>`
  .description-inline-item {
    display: flex;

    ${media.s} {
      flex-direction: column;
      margin-bottom: 0.4286rem;
    }

    .description-inline-item-label {
      width: ${props => `${props.labelWidth}px`};
      flex-shrink: 0;
    }

    .description-inline-item-content {
      flex-grow: 1;
    }
  }
`;
