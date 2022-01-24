import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Card } from 'app/components/Card/Loadable';
import { Description } from 'app/components/Description/Loadable';
import { CopyButton } from 'app/components/CopyButton/Loadable';
import { Link } from 'app/components/Link/Loadable';
import SkeletonContainer from 'app/components/SkeletonContainer/Loadable';
import { Tooltip } from 'app/components/Tooltip/Loadable';
import { Security } from 'app/components/Security/Loadable';
import { getPercent, fromDripToCfx, formatTimeStamp, toThousands } from 'utils';
import { AddressContainer } from 'app/components/AddressContainer';
import { formatAddress } from 'utils';

export function DescriptionPanel({ data, loading }) {
  const { t } = useTranslation();

  const {
    hash,
    height,
    epochNumber,
    difficulty,
    miner,
    parentHash,
    nonce,
    blame,
    totalReward,
    gasUsed,
    timestamp,
    size,
    gasLimit,
    posReference,
  } = data || {};

  return (
    <Card>
      <Description
        title={
          <Tooltip
            text={t(translations.toolTip.block.blockHeight)}
            placement="top"
          >
            {t(translations.block.blockHeight)}
          </Tooltip>
        }
      >
        <SkeletonContainer shown={loading}>
          {toThousands(height)} <CopyButton copyText={height} />
        </SkeletonContainer>
      </Description>
      <Description
        title={
          <Tooltip text={t(translations.toolTip.block.epoch)} placement="top">
            {t(translations.block.epoch)}
          </Tooltip>
        }
      >
        <SkeletonContainer shown={loading}>
          <Link href={`/epoch/${epochNumber}`}>{toThousands(epochNumber)}</Link>{' '}
          <CopyButton copyText={epochNumber} />
        </SkeletonContainer>
      </Description>
      <Description
        title={
          <Tooltip
            text={t(translations.toolTip.block.difficulty)}
            placement="top"
          >
            {t(translations.block.difficulty)}
          </Tooltip>
        }
      >
        <SkeletonContainer shown={loading}>
          {toThousands(difficulty)} <CopyButton copyText={difficulty} />
        </SkeletonContainer>
      </Description>
      <Description
        title={
          <Tooltip text={t(translations.toolTip.block.miner)} placement="top">
            {t(translations.block.miner)}
          </Tooltip>
        }
      >
        <SkeletonContainer shown={loading}>
          {
            <>
              <AddressContainer value={miner} isFull={true} />{' '}
              <CopyButton copyText={formatAddress(miner)} />
            </>
          }
        </SkeletonContainer>
      </Description>
      <Description
        title={
          <Tooltip text={t(translations.toolTip.block.reward)} placement="top">
            {t(translations.block.reward)}
          </Tooltip>
        }
      >
        <SkeletonContainer shown={loading}>
          {totalReward ? `${fromDripToCfx(totalReward, true)} CFX` : '--'}
        </SkeletonContainer>
      </Description>
      <Description
        title={
          <Tooltip
            text={t(translations.toolTip.block.security)}
            placement="top"
          >
            {t(translations.block.security)}
          </Tooltip>
        }
      >
        <SkeletonContainer shown={loading}>
          <Security blockHash={hash} epochNumber={epochNumber}></Security>
        </SkeletonContainer>
      </Description>
      <Description
        title={
          <Tooltip text={t(translations.toolTip.block.blame)} placement="top">
            {t(translations.block.blame)}
          </Tooltip>
        }
      >
        <SkeletonContainer shown={loading}>{blame}</SkeletonContainer>
      </Description>
      <Description
        title={
          <Tooltip
            text={t(translations.toolTip.block.posBlockHash)}
            placement="top"
          >
            {t(translations.block.posBlockHash)}
          </Tooltip>
        }
      >
        <SkeletonContainer shown={loading}>
          {posReference ? (
            <>
              {posReference} <CopyButton copyText={posReference} />
            </>
          ) : (
            '--'
          )}
        </SkeletonContainer>
      </Description>
      <Description
        title={
          <Tooltip
            text={t(translations.toolTip.block.blockHash)}
            placement="top"
          >
            {t(translations.block.blockHash)}
          </Tooltip>
        }
      >
        <SkeletonContainer shown={loading}>
          {hash} <CopyButton copyText={hash} />
        </SkeletonContainer>
      </Description>
      <Description
        title={
          <Tooltip
            text={t(translations.toolTip.block.parentHash)}
            placement="top"
          >
            {t(translations.block.parentHash)}
          </Tooltip>
        }
      >
        <SkeletonContainer shown={loading}>
          {
            <>
              <Link href={`/block/${parentHash}`}>{parentHash}</Link>{' '}
              <CopyButton copyText={parentHash} />
            </>
          }
        </SkeletonContainer>
      </Description>
      <Description
        title={
          <Tooltip text={t(translations.toolTip.block.nonce)} placement="top">
            {t(translations.block.nonce)}
          </Tooltip>
        }
      >
        <SkeletonContainer shown={loading}>{nonce}</SkeletonContainer>
      </Description>
      <Description
        title={
          <Tooltip
            text={t(translations.toolTip.block.gasUsedLimit)}
            placement="top"
          >
            {t(translations.block.gasUsed)}
          </Tooltip>
        }
      >
        <SkeletonContainer shown={loading}>
          {`${gasUsed || '--'}/${gasLimit || '--'} (${getPercent(
            gasUsed,
            gasLimit,
          )})`}
        </SkeletonContainer>
      </Description>
      <Description
        title={
          <Tooltip
            text={t(translations.toolTip.block.timestamp)}
            placement="top"
          >
            {t(translations.block.timestamp)}
          </Tooltip>
        }
      >
        <SkeletonContainer shown={loading}>
          {formatTimeStamp(timestamp * 1000, 'timezone')}
        </SkeletonContainer>
      </Description>
      <Description
        title={
          <Tooltip text={t(translations.toolTip.block.size)} placement="top">
            {t(translations.block.size)}
          </Tooltip>
        }
        noBorder
      >
        <SkeletonContainer shown={loading}>{size}</SkeletonContainer>
      </Description>
    </Card>
  );
}
