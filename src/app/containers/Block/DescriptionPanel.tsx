import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Card } from '@cfxjs/sirius-next-common/dist/components/Card';
import { Description } from '@cfxjs/sirius-next-common/dist/components/Description';
import { CopyButton } from '@cfxjs/sirius-next-common/dist/components/CopyButton';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { SkeletonContainer } from '@cfxjs/sirius-next-common/dist/components/SkeletonContainer';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';
import { Security } from 'app/components/Security/Loadable';
import {
  getPercent,
  formatTimeStamp,
  toThousands,
  getCoreGasTargetUsage,
} from 'utils';
import { CoreAddressContainer } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/CoreAddressContainer';
import { formatAddress } from 'utils';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
import styled from 'styled-components';
import {
  fromDripToCfx,
  fromDripToGdrip,
} from '@cfxjs/sirius-next-common/dist/utils';
import { IncreasePercent } from '@cfxjs/sirius-next-common/dist/components/IncreasePercent';
import imgChevronDown from 'images/chevronDown.png';
import clsx from 'clsx';
import { Progress } from '@cfxjs/antd';

const GasTargetUsage: React.FC<{
  gasUsed: string;
}> = ({ gasUsed }) => {
  const { isNegative, percent, value } = getCoreGasTargetUsage(gasUsed);
  return (
    <GasTargetUsageWrapper>
      <Progress
        type="dashboard"
        size="small"
        gapDegree={180}
        showInfo={false}
        strokeWidth={8}
        strokeColor={isNegative ? '#FA5D5D' : '#4AC2AB'}
        trailColor="#eeeeee"
        percent={Math.abs(value)}
        width={40}
      />
      <IncreasePercent value={percent} showPlus />
    </GasTargetUsageWrapper>
  );
};

export function DescriptionPanel({ data, loading }) {
  const { t } = useTranslation();
  const [folded, setFolded] = useState(true);
  const handleFolded = () => setFolded(folded => !folded);

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
    rewardDetail,
    baseFeePerGas,
    baseFeePerGasRef,
    burntGasFee,
  } = data || {};

  return (
    <StyledCardWrapper>
      <Description
        title={
          <Tooltip title={t(translations.toolTip.block.blockHeight)}>
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
          <Tooltip title={t(translations.toolTip.block.epoch)}>
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
          <Tooltip title={t(translations.toolTip.block.security)}>
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
          <Tooltip title={t(translations.toolTip.block.timestamp)}>
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
          <Tooltip title={t(translations.toolTip.block.blame)}>
            {t(translations.block.blame)}
          </Tooltip>
        }
      >
        <SkeletonContainer shown={loading}>{blame}</SkeletonContainer>
      </Description>
      <Description
        title={
          <Tooltip title={t(translations.toolTip.block.miner)}>
            {t(translations.block.miner)}
          </Tooltip>
        }
      >
        <SkeletonContainer shown={loading}>
          {
            <>
              <CoreAddressContainer value={miner} isFull={true} />{' '}
              <CopyButton copyText={formatAddress(miner)} />
            </>
          }
        </SkeletonContainer>
      </Description>
      <Description
        title={
          <Tooltip title={t(translations.toolTip.block.reward)}>
            {t(translations.block.reward)}
          </Tooltip>
        }
      >
        <SkeletonContainer shown={loading}>
          <ResetTooltipWrapper>
            <Text
              hoverValue={
                rewardDetail && (
                  <div>
                    <div>
                      {t(translations.toolTip.block.powBaseBlockReward, {
                        amount: `${fromDripToCfx(
                          rewardDetail.baseReward,
                          true,
                        )} CFX`,
                      })}
                    </div>
                    <div>
                      {t(translations.toolTip.block.transactionFees, {
                        amount: `${fromDripToCfx(
                          rewardDetail.txFee,
                          true,
                        )} CFX`,
                      })}
                    </div>
                    <div>
                      {t(translations.toolTip.block.storageInterest, {
                        amount: `${fromDripToCfx(
                          rewardDetail.storageCollateralInterest,
                          true,
                        )} CFX`,
                      })}
                    </div>
                    <div>
                      {t(translations.toolTip.block.burntFees, {
                        amount: `${fromDripToCfx(
                          rewardDetail.burntGasFee,
                          true,
                        )} CFX`,
                      })}
                    </div>
                  </div>
                )
              }
            >
              {totalReward ? `${fromDripToCfx(totalReward, true)} CFX` : '--'}
            </Text>
          </ResetTooltipWrapper>
        </SkeletonContainer>
      </Description>
      <Description
        title={
          <Tooltip title={t(translations.toolTip.block.difficulty)}>
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
          <Tooltip title={t(translations.toolTip.block.size)}>
            {t(translations.block.size)}
          </Tooltip>
        }
      >
        <SkeletonContainer shown={loading}>{size}</SkeletonContainer>
      </Description>
      <Description
        title={
          <Tooltip title={t(translations.toolTip.block.gasUsedLimit)}>
            {t(translations.block.gasUsed)}
          </Tooltip>
        }
      >
        <SkeletonContainer shown={loading}>
          {`${gasLimit || '--'} | ${gasUsed || '--'} (${getPercent(
            gasUsed,
            gasLimit,
            2,
          )})`}
        </SkeletonContainer>
      </Description>
      <Description
        title={
          <Tooltip title={t(translations.toolTip.block.gasTargetUsage)}>
            {t(translations.block.gasTargetUsage)}
          </Tooltip>
        }
      >
        <SkeletonContainer shown={loading}>
          <GasTargetUsage gasUsed={gasUsed} />
        </SkeletonContainer>
      </Description>
      <Description
        title={
          <Tooltip title={t(translations.toolTip.block.baseFeePerGas)}>
            {t(translations.block.baseFeePerGas)}
          </Tooltip>
        }
      >
        <SkeletonContainer shown={loading}>
          {baseFeePerGas
            ? `${fromDripToGdrip(baseFeePerGas, true)} Gdrip `
            : '--'}
          {baseFeePerGas && baseFeePerGasRef?.prePivot?.baseFeePerGas && (
            <Tooltip
              title={
                baseFeePerGasRef?.prePivot?.height && (
                  <div>
                    {t(translations.toolTip.block.compareToPivotBlock, {
                      block: baseFeePerGasRef.prePivot.height,
                    })}
                    <CopyButton
                      copyText={baseFeePerGasRef.prePivot.height}
                      color="#ECECEC"
                      className="copy-button-in-tooltip"
                    />
                  </div>
                )
              }
            >
              <BaseFeeIncreaseWrapper>
                <IncreasePercent
                  base={baseFeePerGas}
                  prev={baseFeePerGasRef.prePivot.baseFeePerGas}
                  showArrow
                />
              </BaseFeeIncreaseWrapper>
            </Tooltip>
          )}
        </SkeletonContainer>
      </Description>
      <Description
        title={
          <Tooltip title={t(translations.toolTip.block.burntFeesLabel)}>
            {t(translations.block.burntFeesLabel)}
          </Tooltip>
        }
      >
        <SkeletonContainer shown={loading}>
          {burntGasFee ? `🔥 ${fromDripToCfx(burntGasFee, true)} CFX` : '--'}
        </SkeletonContainer>
      </Description>
      <FoldedWrapper
        className={clsx({
          folded: folded,
        })}
      >
        <Description
          title={
            <Tooltip title={t(translations.toolTip.block.posBlockHash)}>
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
            <Tooltip title={t(translations.toolTip.block.blockHash)}>
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
            <Tooltip title={t(translations.toolTip.block.parentHash)}>
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
            <Tooltip title={t(translations.toolTip.block.nonce)}>
              {t(translations.block.nonce)}
            </Tooltip>
          }
        >
          <SkeletonContainer shown={loading}>{nonce}</SkeletonContainer>
        </Description>
      </FoldedWrapper>
      <Description
        title={
          <StyledFoldButtonWrapper>
            <div
              className={clsx('detailResetFoldButton', {
                folded: folded,
              })}
              onClick={handleFolded}
            >
              {t(translations.general[folded ? 'viewMore' : 'showLess'])}
            </div>
          </StyledFoldButtonWrapper>
        }
        noBorder
      >
        {' '}
      </Description>
    </StyledCardWrapper>
  );
}

const BaseFeeIncreaseWrapper = styled.div`
  display: inline-block;
  padding: 4px 16px;
  border: 1px solid #ebeced;
  margin-left: 16px;
`;

const GasTargetUsageWrapper = styled.div`
  display: inline-flex;
  gap: 16px;
  height: 22px;
`;

const StyledCardWrapper = styled(Card)`
  .copy-button-in-tooltip {
    margin-left: 8px;
  }
`;

const FoldedWrapper = styled.div`
  height: inherit;
  overflow: hidden;
  &.folded {
    height: 0;
  }
`;

const ResetTooltipWrapper = styled.div`
  .sirius-next-tooltip {
    max-width: unset !important;
  }
`;

const StyledFoldButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;

  .detailResetFoldButton {
    display: flex;
    align-items: center;
    justify-items: center;
    padding: 0.8571rem 0;
    font-size: 1rem;
    color: #002257;
    cursor: pointer;
    padding: 0;

    &::after {
      content: '';
      background-image: url(${imgChevronDown});
      transform: rotate(180deg);
      width: 1.1429rem;
      height: 1.1429rem;
      display: inline-block;
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
      margin-left: 0.3571rem;
    }

    &.folded::after {
      transform: rotate(0);
    }
  }
`;
