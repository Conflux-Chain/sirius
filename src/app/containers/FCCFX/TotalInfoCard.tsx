import React, { useMemo } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Row, Col, Progress } from '@cfxjs/antd';
import { StyledTitle1474798C } from 'app/components/StyledComponent';
import { formatBalance } from 'utils';
import { TotalInfoType } from './Common';
import { usePortal } from 'utils/hooks/usePortal';
import { InfoIconWithTooltip } from 'app/components/InfoIconWithTooltip';

export function TotalInfoCard({ info }: { info: TotalInfoType }) {
  const { t } = useTranslation();
  const { accounts } = usePortal();

  const data: Array<any> = [
    {
      key: 'balanceOfCfx',
      title: t(translations.fccfx.titleGenerate),
      value: formatBalance(info.balanceOfCfx, 18, false, {}, '0.001'),
      span: 13,
    },
    {
      key: 'fcMiningAPY',
      title: t(translations.fccfx.titleAPY),
      value:
        info.fcMiningAPY
          .dividedBy(10 ** 18)
          .multipliedBy(100)
          .toFixed(2) + '%',
      span: 11,
      tip: (
        <InfoIconWithTooltip
          info={t(translations.fccfx.tip.APY)}
        ></InfoIconWithTooltip>
      ),
    },
    {
      key: 'fcSigned',
      title: t(translations.fccfx.titleStakedFC),
      value: formatBalance(info.fcSigned, 18, false, {}, '0.001'),
      span: 13,
    },
    {
      key: 'fcSignedHistory',
      title: t(translations.fccfx.titleStakedHistory),
      value: formatBalance(info.fcSignedHistory, 18, false, {}, '0.001'),
      span: 11,
    },
  ];

  const rate = useMemo(() => {
    let rate = 0;
    try {
      rate =
        Number(info.fcSigned.dividedBy(info.balanceOfCfx).toFixed(4)) * 100 ||
        0;
    } catch (e) {}
    return rate;
  }, [info.balanceOfCfx, info.fcSigned]);

  return (
    <StyledTotalInfoWrapper>
      <Row gutter={24}>
        <Col span={7}>
          <div className="fccfx-totalInfo-progressContainer">
            <Progress
              type="circle"
              percent={rate}
              trailColor="#dbe9ff"
              strokeWidth={10}
            />
          </div>
        </Col>
        <Col span={17}>
          <Row>
            {data.map((c, index) => (
              <Col span={c.span} className="fccfx-totalInfo-item" key={index}>
                <StyledTitle1474798C
                  className={`fccfx-totalInfo-title fccfx-totalInfo-title-${index}`}
                >
                  <span>{c.title}</span> {c.tip}
                </StyledTitle1474798C>
                <span className="fccfx-totalInfo-number">
                  {accounts.length ? c.value : '--'}
                </span>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </StyledTotalInfoWrapper>
  );
}

const StyledTotalInfoWrapper = styled.div`
  .fccfx-totalInfo-item {
    display: flex;
    flex-direction: column;
    position: relative;

    &:first-child {
      margin-bottom: 40px;
    }
  }

  .fccfx-totalInfo-title-0::before,
  .fccfx-totalInfo-title-2::before {
    position: absolute;
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 50%;
    left: -29px;
    top: 6px;
  }

  .fccfx-totalInfo-title {
    & > span {
      margin-right: 5px;
    }
  }

  .fccfx-totalInfo-title-0::before {
    background: #dbe9ff;
  }

  .fccfx-totalInfo-title-2::before {
    background: #1e3de4;
  }

  .fccfx-totalInfo-number {
    font-size: 24px;
    font-weight: bold;
    color: #0f1327;
    line-height: 36px;
  }

  .fccfx-totalInfo-progressContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: -24px;
    height: 100%;
  }
`;
