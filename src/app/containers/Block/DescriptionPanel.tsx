import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import { useHistory } from 'react-router-dom';
import {
  delay,
  getPercent,
  fromDripToCfx,
  formatTimeStamp,
  toThousands,
} from '../../../utils';
import { AddressContainer } from '../../components/AddressContainer';
import { formatAddress } from '../../../utils/cfx';
export function DescriptionPanel({ hash: blockHash }) {
  const history = useHistory();
  const { t } = useTranslation();
  const [risk, setRisk] = useState('');
  let loading = false;
  const hashQuery = useMemo(() => ({ hash: blockHash }), [blockHash]);
  const { data } = useBlockQuery(hashQuery);

  useEffect(() => {
    if (data && !data.hash) {
      history.push(`/notfound/${blockHash}`, {
        type: 'block',
      });
    }
  }, [blockHash, data, history]);

  const intervalToClear = useRef(false);
  if (!data) loading = true;

  const getConfirmRisk = async blockHash => {
    intervalToClear.current = true;
    let riskLevel;
    while (intervalToClear.current) {
      riskLevel = await reqConfirmationRiskByHash(blockHash);
      setRisk(riskLevel);
      if (riskLevel === '') {
        await delay(1000);
      } else if (riskLevel === 'lv0') {
        intervalToClear.current = false;
      } else {
        await delay(10 * 1000);
      }
    }
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

  useEffect(() => {
    return () => {
      intervalToClear.current = false;
    };
  }, [intervalToClear]);
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
            <Tooltip
              text={t(translations.toolTip.block.blockHeight)}
              placement="top"
            >
              {t(translations.block.blockHeight)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>
            {toThousands(height)}
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
            {
              <Link href={`/epoch/${epochNumber}`}>
                {toThousands(epochNumber)}
              </Link>
            }
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
            {toThousands(difficulty)}
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
            <Tooltip
              text={t(translations.toolTip.block.reward)}
              placement="top"
            >
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
            <Security type={risk}></Security>
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
            {formatTimeStamp(syncTimestamp * 1000, 'timezone')}
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
