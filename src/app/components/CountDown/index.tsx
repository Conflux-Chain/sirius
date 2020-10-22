/**
 *
 * CountDown
 *
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { getDuration } from '../../../utils';

interface CountDownProps {
  from: number;
  to?: number;
}
export const CountDown = ({ from, to }: CountDownProps) => {
  const { t } = useTranslation();
  const duration = getDuration(from, to);
  const str = [
    translations.general.countdown.day,
    translations.general.countdown.hour,
    translations.general.countdown.minute,
    translations.general.countdown.second,
  ];
  const label = duration.reduce((acc, cur, index) => {
    const next = t(str[index], { count: cur });
    acc = acc ? `${acc} ${next}` : `${next}`;
    return acc;
  }, '');

  return (
    <>
      {label} {t(translations.general.countdown.ago)}
    </>
  );
};
