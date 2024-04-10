import React, { useState } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { Link } from 'app/components/Link/Loadable';
import { media, useBreakpoint } from 'styles/media';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { TabsTablePanel } from 'app/components/TabsTablePanel/Loadable';
import { useTabTableData } from 'app/components/TabsTablePanel';
import { ScanEvent } from 'utils/gaConstants';
import { BlockchainInfo } from './BlockchainInfo';
import { useInterval } from 'react-use';
import { Notices } from 'app/containers/Notices/Loadable';

import { AccountsList } from 'app/containers/pos/Accounts/Loadable';
import { CommitteesList } from 'app/containers/pos/Committees/Loadable';

export function HomePage() {
  const { t } = useTranslation();
  const bp = useBreakpoint();
  const [timestamp, setTimestamp] = useState(+new Date());

  const tabs = [
    {
      value: 'accounts',
      action: 'pos-accounts',
      label: t(translations.pos.accounts.title),
      content: <AccountsList overview />,
    },
    {
      value: 'committees',
      action: 'pos-committees',
      label: t(translations.pos.committees.title),
      content: <CommitteesList overview />,
    },
  ];

  // auto update
  useInterval(() => {
    setTimestamp(+new Date());
  }, 20000);

  const { currentTabValue } = useTabTableData(tabs);

  return (
    <>
      <Helmet>
        <title>{t(translations.metadata.title)}</title>
        <meta
          name="description"
          content={t(translations.metadata.description)}
        />
      </Helmet>
      <Main>
        {bp && bp === 's' ? <Notices /> : null}
        <BlockchainInfo timestamp={timestamp} />
        <Bottom>
          <TabsTablePanel tabs={tabs} />
          <ViewAllLinkWrapper>
            {currentTabValue === 'accounts' ? (
              <Link
                className="viewall-link"
                href={`/pos/accounts`}
                ga={{
                  category: ScanEvent.menu.category,
                  action: ScanEvent.menu.action.posAccounts,
                }}
              >
                {bp === 's'
                  ? t(translations.general.viewAll)
                  : t(translations.general.viewAllPosAccounts)}
              </Link>
            ) : (
              <Link
                className="viewall-link"
                href={`/pos/committees`}
                ga={{
                  category: ScanEvent.menu.category,
                  action: ScanEvent.menu.action.posCommittee,
                }}
              >
                {bp === 's'
                  ? t(translations.general.viewAll)
                  : t(translations.general.viewAllPosCommittees)}
              </Link>
            )}
          </ViewAllLinkWrapper>
        </Bottom>
      </Main>
    </>
  );
}

const Main = styled.div`
  max-width: 1368px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.57rem;
  ${media.s} {
    margin-bottom: 0;
  }
`;
// const Top = styled.section`
//   display: flex;
//   width: 100%;
//   margin-bottom: 0;
//   margin-top: 32px;
//   justify-content: center;
//
//   > * {
//     margin-bottom: 24px;
//   }
//
//   > * + * {
//     margin-left: 24px;
//   }
//
//   ${media.m} {
//     flex-wrap: wrap;
//
//     > *:nth-child(3) {
//       margin-left: 0;
//     }
//   }
//
//   ${media.s} {
//     margin-top: 24px;
//     margin-bottom: 12px;
//     flex-direction: column;
//
//     > * {
//       margin-left: 0;
//       margin-bottom: 10px;
//     }
//   }
// `;
//
// const SmallChartWrap = styled.div`
//   ${media.m} {
//   }
// `;

const Bottom = styled.section`
  position: relative;
  width: 100%;
`;
const ViewAllLinkWrapper = styled.div`
  position: absolute;
  top: 1rem;
  right: 0;
  border-bottom: 2px solid #1e3de4;
  ${media.s} {
    top: 0.6429rem;
  }
  .viewall-link.link {
    color: #1e3de4;
  }
`;
