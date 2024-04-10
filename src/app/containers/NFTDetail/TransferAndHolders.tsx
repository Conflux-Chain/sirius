import React from 'react';

import { Holders } from './Holders';
import { TabsTablePanel } from 'app/components/TabsTablePanel/Loadable';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { TransferList } from './TransferList';

export const TransferAndHolders = props => {
  const { t } = useTranslation();

  const tabs: any = [
    {
      value: 'transfers',
      label: t(translations.token.transfers),
      content: <TransferList {...props} />,
    },
  ];

  if (props.type && props.type?.includes('1155')) {
    tabs.push({
      value: 'holders',
      label: t(translations.token.holders),
      content: <Holders {...props} />,
    });
  }

  return <TabsTablePanel tabs={tabs} />;
};
