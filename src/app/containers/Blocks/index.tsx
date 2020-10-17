import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import styled from 'styled-components/macro';
import { PageHeader } from '../../components/PageHeader/Loadable';
import { media } from '../../../styles/media';
import { Card } from '@cfxjs/react-ui';
import { Description } from '../../components/Description/Loadable';
import { useParams } from 'react-router-dom';
import { useBlockQuery } from '../../../utils/api';
import { CopyButton } from '../../components/CopyButton/Loadable';
import { Link } from 'react-router-dom';
import SkeletonContainer from '../../components/SkeletonContainer/Loadable';
import { Status } from '../../components/Status/Loadable';
import Tooltip from '../../components/Tooltip';

export const Blocks = () => {
  const { t } = useTranslation();
  const { hash: searchHash } = useParams<{
    hash: string;
  }>();
  let loading = false;
  const { data, error } = useBlockQuery({ hash: searchHash });

  if (!data && !error) loading = true;

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

  return (
    <StyledblocksWrapper>
      <Helmet>
        <title>{t(translations.blocks.title)}</title>
        <meta name="description" content={t(translations.blocks.description)} />
      </Helmet>
      <PageHeader>{t(translations.blocks.title)}</PageHeader>
      <StyledCardWrapper>
        <Card className="sirius-blocks-card">
          <Description
            title={
              <Tooltip
                text={t(translations.blocks.blockHeight)}
                placement="top"
              >
                {t(translations.blocks.blockHeight)}
              </Tooltip>
            }
          >
            <SkeletonContainer shown={loading}>{height}</SkeletonContainer>
          </Description>
          <Description title={t(translations.blocks.epoch)}>
            <Link to={`/epochs/${epochNumber}`}>{epochNumber}</Link>
          </Description>
          <Description title={t(translations.blocks.difficulty)}>
            {difficulty}
          </Description>
          <Description title={t(translations.blocks.miner)}>
            <Link to={`/address/${miner}`}>{miner}</Link>{' '}
            <CopyButton copyText={miner} />
          </Description>
          <Description title={t(translations.blocks.reward)}>
            {'todo'}
          </Description>
          <Description title={t(translations.blocks.security)}>
            {'todo'}
          </Description>
          <Description title={t(translations.blocks.blame)}>
            {blame}
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
            <Link to={`/blocks/${parentHash}`}>{parentHash}</Link>{' '}
            <CopyButton copyText={parentHash} />
          </Description>
          <Description title={t(translations.blocks.nonce)}>
            {nonce}
          </Description>
          <Description title={t(translations.blocks.gasUsed)}>
            {'todo'}
          </Description>
          <Description title={t(translations.blocks.timestamp)}>
            {timestamp}
          </Description>
          <Description title={t(translations.blocks.size)} noBorder>
            {blockIndex}
          </Description>
        </Card>
      </StyledCardWrapper>
    </StyledblocksWrapper>
  );
};

const StyledCardWrapper = styled.div`
  .card.sirius-blocks-card {
    .content {
      padding: 0 18px;
    }
  }
`;

const StyledblocksWrapper = styled.div`
  padding: 32px 0;

  ${media.s} {
    padding-bottom: 0;
  }
`;
