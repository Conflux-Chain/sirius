import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import styled from 'styled-components/macro';
import { Card } from '@cfxjs/react-ui';
import { useBlockQuery } from '../../../utils/api';
import { Description } from '../../components/Description/Loadable';
import { CopyButton } from '../../components/CopyButton/Loadable';
import { Link } from '../../components/Link/Loadable';
import SkeletonContainer from '../../components/SkeletonContainer/Loadable';
import { Tooltip } from '../../components/Tooltip/Loadable';
import { Security } from '../../components/Security/Loadable';
import { reqConfirmationRiskByHash } from '../../../utils/httpRequest';
import { util as cfxUtil } from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { delay } from '../../../utils';
export function DescriptionPanel({ hash: blockHash }) {
  const { t } = useTranslation();
  const [risk, setRisk] = useState('');
  let loading = false;
  const { data, error } = useBlockQuery({ hash: blockHash });

  if (!data && !error) loading = true;

  const getConfirmRisk = async blockHash => {
    let looping = true;
    let riskLevel;
    while (looping) {
      riskLevel = await reqConfirmationRiskByHash(blockHash);
      setRisk(riskLevel);
      if (riskLevel === '') {
        await delay(1000);
      } else if (riskLevel === 'lv0') {
        looping = false;
      } else {
        await delay(10 * 1000);
      }
    }
  };

  const transferDrip = (dripStr: string) => {
    if (dripStr) {
      return cfxUtil.unit.fromDripToCFX(Number(dripStr));
    }
    return '--';
  };

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
    syncTimestamp,
    size,
    gasLimit,
  } = data || {};
  if (data) {
    getConfirmRisk(hash);
  }
  /**
   * ISSUE LIST:
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
            {<Link href={`/epoch/${epochNumber}`}>{epochNumber}</Link>}
          </SkeletonContainer>
        </Description>
        <Description title={t(translations.blocks.difficulty)}>
          <SkeletonContainer shown={loading}>{difficulty}</SkeletonContainer>
        </Description>
        <Description title={t(translations.blocks.miner)}>
          <SkeletonContainer shown={loading}>
            {
              <>
                <Link href={`/address/${miner}`}>{miner}</Link>{' '}
                <CopyButton copyText={miner} />
              </>
            }
          </SkeletonContainer>
        </Description>
        <Description title={t(translations.blocks.reward)}>
          <SkeletonContainer shown={loading}>
            {transferDrip(totalReward)}
          </SkeletonContainer>
        </Description>
        <Description title={t(translations.blocks.security)}>
          <SkeletonContainer shown={loading}>
            <Security type={risk}></Security>
          </SkeletonContainer>
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
                <Link href={`/blocks/${parentHash}`}>{parentHash}</Link>{' '}
                <CopyButton copyText={parentHash} />
              </>
            }
          </SkeletonContainer>
        </Description>
        <Description title={t(translations.blocks.nonce)}>
          <SkeletonContainer shown={loading}>{nonce}</SkeletonContainer>
        </Description>
        <Description title={t(translations.blocks.gasUsed)}>
          <SkeletonContainer shown={loading}>
            {gasUsed || '--'}/{gasLimit || '--'}
          </SkeletonContainer>
        </Description>
        <Description title={t(translations.blocks.timestamp)}>
          <SkeletonContainer shown={loading}>{syncTimestamp}</SkeletonContainer>
        </Description>
        <Description title={t(translations.blocks.size)} noBorder>
          <SkeletonContainer shown={loading}>{size}</SkeletonContainer>
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
