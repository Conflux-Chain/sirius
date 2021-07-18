/**
 *
 * CountDown
 *
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { getDuration } from '../../../utils';
import { Text } from '../Text/Loadable';

interface CountDownProps {
  from: number;
  to?: number;
  retainDurations?: 1 | 2 | 3 | 4;
}
export const CountDown = React.memo(
  ({ from, to, retainDurations = 2 }: CountDownProps) => {
    const { t } = useTranslation();
    const duration = getDuration(from, to);
    const str = [
      translations.general.countdown.day,
      translations.general.countdown.hour,
      translations.general.countdown.minute,
      translations.general.countdown.second,
    ];

    const label = duration.reduce(
      (acc, cur, index) => {
        // default max to retain 2 duration, and min to retain 1 duration
        if (acc[1] < retainDurations && (cur > 0 || index === 3)) {
          const next = t(str[index], { count: cur });
          acc[0] = acc[0] ? `${acc[0]} ${next}` : `${next}`;
          acc[1] = Number(acc[1]) + 1;
        }
        return acc;
      },
      ['', 0],
    );

    const fullLabel = duration.reduce(
      (acc, cur, index) => {
        if (acc[1] < 4 && (cur > 0 || index === 3)) {
          const next = t(str[index], { count: cur });
          acc[0] = acc[0] ? `${acc[0]} ${next}` : `${next}`;
          acc[1] = Number(acc[1]) + 1;
        }
        return acc;
      },
      ['', 0],
    );

    return (
      <Text
        span
        hoverValue={`${fullLabel[0]} ${t(translations.general.countdown.ago)}`}
      >
        {label[0]} {t(translations.general.countdown.ago)}
      </Text>
    );
  },
);
