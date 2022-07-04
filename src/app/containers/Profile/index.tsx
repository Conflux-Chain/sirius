import React from 'react';
import { TabsTablePanel } from 'app/components/TabsTablePanel/Loadable';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components/macro';
import { Helmet } from 'react-helmet-async';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { AddressLabel } from './AddressLabel';
import { TxNote } from './TxNote';

export function Profile() {
  const { t } = useTranslation();
  const tabs = [
    {
      value: 'address-label',
      label: t(translations.profile.address.title),
      content: <AddressLabel />,
    },
    {
      value: 'tx-note',
      label: t(translations.profile.tx.title),
      content: <TxNote />,
    },
  ];
  return (
    <StyledWrapper>
      <Helmet>
        <title>{t(translations.profile.title)}</title>
        <meta name="description" content={t(translations.profile.title)} />
      </Helmet>
      <PageHeader subtitle={t(translations.profile.subtitle)}>
        {t(translations.profile.title)}
      </PageHeader>
      <TabsTablePanel tabs={tabs} />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .button-group-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;
