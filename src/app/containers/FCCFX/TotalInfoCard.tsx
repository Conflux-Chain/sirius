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
import { useBreakpoint, media } from 'styles/media';

export function TotalInfoCard({ info }: { info: TotalInfoType }) {
  const { t } = useTranslation();
  const { accounts } = usePortal();
  const bp = useBreakpoint();

  const data: Array<any> = [
    {
      key: 'balanceOfCfx',
      title: t(translations.fccfx.titleGenerate),
      value: formatBalance(
        info.balanceOfCfx,
        18,
        false,
        {
          withUnit: false,
          keepDecimal: false,
        },
        '0.001',
      ),
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
      value: formatBalance(
        info.fcSigned,
        18,
        false,
        {
          withUnit: false,
          keepDecimal: false,
        },
        '0.001',
      ),
      span: 13,
    },
    {
      key: 'fcSignedHistory',
      title: t(translations.fccfx.titleStakedHistory),
      value: formatBalance(
        info.fcSignedHistory,
        18,
        false,
        {
          withUnit: false,
          keepDecimal: false,
        },
        '0.001',
      ),
      span: 11,
    },
  ];

  const rate = useMemo(() => {
    let rate = 0;
    try {
      rate =
        Number(
          info.fcSigned
            .dividedBy(info.balanceOfCfx)
            .multipliedBy(100)
            .toFixed(2),
        ) || 0;
    } catch (e) {}
    return rate;
  }, [info.balanceOfCfx, info.fcSigned]);

  return (
    <StyledTotalInfoWrapper>
      <Row gutter={24}>
        <Col span={7} className="col-progress">
          <div className="fccfx-totalInfo-progressContainer">
            <Progress
              type="circle"
              percent={rate}
              trailColor="#dbe9ff"
              strokeWidth={10}
            />
          </div>
        </Col>
        <Col md={17} sm={24} className="col-info">
          <Row>
            {data.map((c, index) => (
              <Col
                span={bp === 's' ? 24 : c.span}
                className="fccfx-totalInfo-item"
                key={index}
              >
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
  ${media.s} {
    margin-left: 2.8571rem;
  }

  .col-progress {
    ${media.s} {
      margin-left: 2.8571rem;
    }
  }

  .col-info {
    ${media.s} {
      margin-top: 2rem;
    }
  }

  .fccfx-totalInfo-item {
    display: flex;
    flex-direction: column;
    position: relative;

    ${media.s} {
      margin-bottom: 0.7143rem;
    }

    &:first-child {
      margin-bottom: 2.8571rem;

      ${media.s} {
        margin-bottom: 0.7143rem;
      }
    }
  }

  .fccfx-totalInfo-title-0::before,
  .fccfx-totalInfo-title-2::before {
    position: absolute;
    content: '';
    width: 0.8571rem;
    height: 0.8571rem;
    border-radius: 50%;
    left: -2.0714rem;
    top: 0.4286rem;
  }

  .fccfx-totalInfo-title {
    & > span {
      margin-right: 0.3571rem;

      ${media.s} {
        font-size: 1rem;
      }
    }
  }

  .fccfx-totalInfo-title-0::before {
    background: #dbe9ff;
  }

  .fccfx-totalInfo-title-2::before {
    background: #1e3de4;
  }

  .fccfx-totalInfo-number {
    font-size: 1.7143rem;
    font-weight: bold;
    color: #0f1327;
    line-height: 2.5714rem;

    ${media.s} {
      font-size: 1.2857rem;
      line-height: 1.5;
    }
  }

  .fccfx-totalInfo-progressContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: -1.7143rem;
    height: 100%;

    .ant-progress-circle .ant-progress-text {
      font-size: 0.85em;
    }
  }
`;
