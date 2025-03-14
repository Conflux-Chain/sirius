import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components';
import { useInterval } from 'react-use';
import countdownBG from 'images/countdown-bg.png';
import mobileCountdownBG from 'images/mobile-countdown-bg.png';
import { InfoIconWithTooltip } from '@cfxjs/sirius-next-common/dist/components/InfoIconWithTooltip';
import dayjs from 'dayjs';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';

interface CountdownProps {
  type: string;
  target: dayjs.Dayjs;
}

const countTime = (seconds: number) => {
  const dayBase = 86400;
  const hourBase = 3600;
  const minBase = 60;
  const days = Math.floor(seconds / dayBase);
  const hours = Math.floor((seconds - days * dayBase) / hourBase);
  const mins = Math.floor(
    (seconds - days * dayBase - hours * hourBase) / minBase,
  );
  const secs = Math.floor(
    seconds - days * dayBase - hours * hourBase - mins * minBase,
  );
  return { days, hours, mins, secs };
};

export function Countdown({ target, type }: CountdownProps) {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.indexOf('en') > -1;

  const [secs, setSecs] = useState(0);
  const targetDate = useMemo(
    () =>
      target.format(
        isEn ? 'MMM DD YYYY HH:mm:ss (UTCZ)' : 'YYYY年MM月DD日 HH:mm:ss (UTCZ)',
      ),
    [target, isEn],
  );
  const [timeObj, setTimeObj] = useState<{
    days: number;
    hours: number;
    mins: number;
    secs: number;
  } | null>(null);

  const countdown = useCallback(() => {
    const seconds = target.diff(dayjs(), 'second');
    if (seconds >= 0) {
      setTimeObj(countTime(seconds));
      setSecs(seconds - 1);
    }
  }, [target]);

  useEffect(() => {
    countdown();
  }, [countdown]);

  useInterval(countdown, secs >= 0 ? 1000 : null);

  return (
    <CountdownWrapper>
      <div className="countdown-title">
        {t(translations.blocknumberCalc.countdown)}
        <div className="countdown-tooltip">
          <InfoIconWithTooltip
            size={16}
            info={t(translations.blocknumberCalc[type].tooltip)}
          />
        </div>
      </div>
      <div className="countdown-card-wrapper">
        {timeObj ? (
          <>
            <div className="countdown-card">
              <span className="countdown-number">{timeObj.days}</span>
              <span className="countdown-unit">
                {t(translations.blocknumberCalc.day)}
              </span>
            </div>
            <div className="countdown-card">
              <span className="countdown-number">{timeObj.hours}</span>
              <span className="countdown-unit">
                {t(translations.blocknumberCalc.hour)}
              </span>
            </div>
            <div className="countdown-card">
              <span className="countdown-number">{timeObj.mins}</span>
              <span className="countdown-unit">
                {t(translations.blocknumberCalc.min)}
              </span>
            </div>
            <div className="countdown-card">
              <span className="countdown-number">{timeObj.secs}</span>
              <span className="countdown-unit">
                {t(translations.blocknumberCalc.sec)}
              </span>
            </div>
          </>
        ) : null}
      </div>
      <StyledTargetDateWrapper>
        {t(translations.blocknumberCalc.targetDate)}: <span>{targetDate}</span>
      </StyledTargetDateWrapper>
    </CountdownWrapper>
  );
}

const CountdownWrapper = styled.div`
  width: 100%;
  height: 286px;
  padding-top: 32px;
  margin-bottom: 24px;
  border-radius: 5px;
  background: #fff;
  background-image: url(${countdownBG});
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 6px 4px 12px -6px rgba(20, 27, 50, 0.06);
  ${media.s} {
    height: 188px;
    padding-top: 15px;
    margin-bottom: 12px;
    background-image: url(${mobileCountdownBG});
  }

  .countdown-title {
    color: #000;
    font-weight: 500;
    font-size: 16px;
    margin-bottom: 30px;
    ${media.s} {
      margin-bottom: 13px;
    }
    .countdown-tooltip {
      display: inline-flex;
      width: 24px;
      height: 24px;
      align-items: center;
      justify-content: center;
    }
  }
  .countdown-card-wrapper {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    ${media.s} {
      gap: 10px;
      margin-bottom: 16px;
    }
    .countdown-card {
      min-width: 120px;
      height: 120px;
      padding: 15px;
      background: #f1f3f9;
      border-radius: 5px;
      box-shadow: 6px 4px 12px -6px rgba(20, 27, 50, 0.12);
      display: flex;
      gap: 16px;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      ${media.s} {
        min-width: 74px;
        height: 70px;
        padding: 0;
        border-radius: 3px;
        box-shadow: 3.716px 2.477px 7.432px -3.716px rgba(20, 27, 50, 0.12);
        gap: 10px;
      }
      .countdown-number {
        color: #26244b;
        text-align: center;
        font-size: 32px;
        font-style: normal;
        font-weight: 900;
        line-height: normal;

        ${media.s} {
          font-size: 20px;
        }
      }
      .countdown-unit {
        color: #777791;
        text-align: center;
        font-size: 14px;
        font-style: normal;
        font-weight: 450;
        line-height: normal;
        ${media.s} {
          font-size: 10px;
        }
      }
    }
  }
`;

const StyledTargetDateWrapper = styled.div`
  font-size: 14px;
  font-weight: 450;
  color: #777791;
  line-height: 18px;
  ${media.s} {
    font-size: 12px;
  }
`;
