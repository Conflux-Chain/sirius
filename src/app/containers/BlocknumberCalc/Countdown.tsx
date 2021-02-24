import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import styled from 'styled-components';
import { useInterval } from 'react-use';

interface CountdownProps {
  seconds: number;
}

const countTime = (seconds: number) => {
  const dayBase = 86400;
  const hourBase = 3600;
  const minBase = 60;
  const days = Math.floor(seconds / dayBase);
  const hours = Math.floor((seconds - days * dayBase) / hourBase);
  const mins = Math.floor(
    (seconds - days * dayBase - hours * minBase) / minBase,
  );
  const secs = Math.floor(
    seconds - days * dayBase - hours * minBase - mins * minBase,
  );
  return { days, hours, mins, secs };
};

export function Countdown({ seconds }: CountdownProps) {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.indexOf('en') > -1;

  const [secs, setSecs] = useState(seconds);
  const [timeObj, setTimeObj] = useState<{
    days: number;
    hours: number;
    mins: number;
    secs: number;
  } | null>(null);

  const countdown = seconds => {
    if (seconds >= 0) {
      setTimeObj(countTime(seconds));
      setSecs(seconds - 1);
    }
  };

  useEffect(() => {
    countdown(seconds);
  }, [seconds]);

  useInterval(
    () => {
      countdown(secs);
    },
    secs >= 0 ? 1000 : null,
  );

  return (
    <CountdownWrapper>
      {timeObj ? (
        <>
          <span className="number">{timeObj.days}</span>
          <span className="unit">
            {t(translations.blocknumberCalc.day)}
            {isEn && timeObj.days > 1 ? 's' : ''}
          </span>
          <span className="number">{timeObj.hours}</span>
          <span className="unit">
            {t(translations.blocknumberCalc.hour)}
            {isEn && timeObj.hours > 1 ? 's' : ''}
          </span>
          <span className="number">{timeObj.mins}</span>
          <span className="unit">
            {t(translations.blocknumberCalc.min)}
            {isEn && timeObj.mins > 1 ? 's' : ''}
          </span>
          <span className="number">{timeObj.secs}</span>
          <span className="unit">
            {t(translations.blocknumberCalc.sec)}
            {isEn && timeObj.secs > 1 ? 's' : ''}
          </span>
        </>
      ) : null}
    </CountdownWrapper>
  );
}

const CountdownWrapper = styled.div`
  span {
    display: inline-block;
  }

  .number {
    font-size: 42px;
    font-weight: bold;
    color: #1e3de4;
  }

  .unit {
    font-size: 16px;
    font-weight: normal;
    color: #0f1327;
    margin: 0 24px 0 8px;
  }
`;
