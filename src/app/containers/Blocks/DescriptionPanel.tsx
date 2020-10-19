import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import styled from 'styled-components/macro';
import { Card } from '@cfxjs/react-ui';
import { useBlockQuery } from '../../../utils/api';
import { Description } from '../../components/Description/Loadable';
import { CopyButton } from '../../components/CopyButton/Loadable';
import { Link } from 'react-router-dom';
import SkeletonContainer from '../../components/SkeletonContainer/Loadable';
import { Tooltip } from '../../components/Tooltip/Loadable';

export function DescriptionPanel({ hash: blockHash }) {
  const { t } = useTranslation();

  let loading = false;
  const { data, error } = useBlockQuery({ hash: blockHash });

  if (!data && !error) loading = true;

  const {
    hash,
    height,
    epochNumber,
    difficulty,
    miner,
    parentHash,
    timestamp,
    nonce,
    blame,
    blockIndex,
  } = data?.result || {};
  /**
   * ISSUE LIST:
   * - gas used/limit: 用哪两个值算? - miss gas used, backend will provide later
   * - timestamp: todo, need to be formatted
   * - reward: todo, miss
   * - security: todo, extract a Security component
   * - others:
   *  - CopyButton: 目前是 block 的，后续 react-ui/Tooltip 更新后会解决
   *  - Skeleton: 显示文字 - 后续 react-ui/Skeleton 更新后会解决
   *  - title tooltip: 需要给定文案后确定哪些需要添加
   */

  return (
    <StyledCardWrapper>
      <Card className="sirius-blocks-card">
        <Description
          title={
            <Tooltip text={t(translations.blocks.blockHeight)} placement="top">
              {t(translations.blocks.blockHeight)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>{height}</SkeletonContainer>
        </Description>
        <Description title={t(translations.blocks.epoch)}>
          <SkeletonContainer shown={loading}>
            {<Link to={`/epochs/${epochNumber}`}>{epochNumber}</Link>}
          </SkeletonContainer>
        </Description>
        <Description title={t(translations.blocks.difficulty)}>
          <SkeletonContainer shown={loading}>{difficulty}</SkeletonContainer>
        </Description>
        <Description title={t(translations.blocks.miner)}>
          <SkeletonContainer shown={loading}>
            {
              <>
                <Link to={`/address/${miner}`}>{miner}</Link>{' '}
                <CopyButton copyText={miner} />
              </>
            }
          </SkeletonContainer>
        </Description>
        <Description title={t(translations.blocks.reward)}>
          <SkeletonContainer shown={loading}>{'todo'}</SkeletonContainer>
        </Description>
        <Description title={t(translations.blocks.security)}>
          <SkeletonContainer shown={loading}>{'todo'}</SkeletonContainer>
        </Description>
        <Description title={t(translations.blocks.blame)}>
          <SkeletonContainer shown={loading}>{blame}</SkeletonContainer>
        </Description>
        <Description
          title={
            <Tooltip text={t(translations.blocks.blockHash)} placement="top">
              {t(translations.blocks.blockHash)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {hash} <CopyButton copyText={hash} />
          </SkeletonContainer>
        </Description>
        <Description title={t(translations.blocks.parentHash)}>
          <SkeletonContainer shown={loading}>
            {
              <>
                <Link to={`/blocks/${parentHash}`}>{parentHash}</Link>{' '}
                <CopyButton copyText={parentHash} />
              </>
            }
          </SkeletonContainer>
        </Description>
        <Description title={t(translations.blocks.nonce)}>
          <SkeletonContainer shown={loading}>{nonce}</SkeletonContainer>
        </Description>
        <Description title={t(translations.blocks.gasUsed)}>
          <SkeletonContainer shown={loading}>{'todo'}</SkeletonContainer>
        </Description>
        <Description title={t(translations.blocks.timestamp)}>
          <SkeletonContainer shown={loading}>{timestamp}</SkeletonContainer>
        </Description>
        <Description title={t(translations.blocks.size)} noBorder>
          <SkeletonContainer shown={loading}>{blockIndex}</SkeletonContainer>
        </Description>
      </Card>
    </StyledCardWrapper>
  );
}

const StyledCardWrapper = styled.div`
  .card.sirius-blocks-card {
    .content {
      padding: 0 18px;
    }
  }
`;
