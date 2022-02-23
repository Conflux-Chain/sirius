import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ContentWrapper } from '../utils';
import lodash from 'lodash';
import { fromDripToCfx } from 'utils';
import { Text } from 'app/components/Text/Loadable';

export const totalIncoming = {
  title: (
    <ContentWrapper right>
      <Translation>
        {t => t(translations.pos.incomingRank.totalIncoming)}
      </Translation>
    </ContentWrapper>
  ),
  dataIndex: 'totalReward',
  key: 'totalReward',
  width: 1,
  render: value => {
    return (
      <ContentWrapper right>
        {!lodash.isNil(value) ? (
          <Text span hoverValue={`${fromDripToCfx(value, true)} CFX`}>
            {`${fromDripToCfx(value)} CFX`}
          </Text>
        ) : (
          '--'
        )}
      </ContentWrapper>
    );
  },
};
