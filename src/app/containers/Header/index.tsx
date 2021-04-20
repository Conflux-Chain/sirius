/**
 *
 * Header
 *
 */

import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { TextLogo } from 'app/components/TextLogo';
import { Search } from './Search';
import { ConnectWallet } from 'app/components/ConnectWallet';
import { media, useBreakpoint } from 'styles/media';
import { Nav } from 'app/components/Nav';
import { genParseLinkFn, HeaderLinks } from './HeaderLink';
import { Check } from '@zeit-ui/react-icons';
import { useTestnet, toTestnet, toMainnet } from 'utils/hooks/useTestnet';
import { translations } from 'locales/i18n';
import { useLocation } from 'react-router';
import imgConfiPlanet from 'images/confi-planet.png';
import { ScanEvent } from 'utils/gaConstants';
import { trackEvent } from 'utils/ga';

export const Header = memo(() => {
  const { t, i18n } = useTranslation();
  const zh = '中文';
  const en = 'EN';
  const iszh = i18n.language.includes('zh');
  const isTestnet = useTestnet();

  const location = useLocation();
  const contractMatched =
    location.pathname.startsWith('/sponsor') ||
    location.pathname.startsWith('/contract');
  const statisticsMatched =
    location.pathname.startsWith('/charts') ||
    location.pathname.startsWith('/statistics');
  const moreMatched =
    location.pathname.startsWith('/address-converter') ||
    location.pathname.startsWith('/push-tx') ||
    location.pathname.startsWith('/block-countdown');
  const bp = useBreakpoint();

  const startLinks: HeaderLinks = [
    {
      // home
      title: t(translations.header.home),
      name: ScanEvent.menu.action.home,
      href: '/',
      className: 'home',
    },
    // blockchain
    {
      title: t(translations.header.blockchain),
      matched: location?.pathname?.startsWith('/blockchain'),
      children: [
        {
          // block
          title: [
            t(translations.header.block),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.blocks,
          href: '/blockchain/blocks',
        },
        {
          // txn
          title: [t(translations.header.txn), <Check size={18} key="check" />],
          name: ScanEvent.menu.action.transactions,
          href: '/blockchain/transactions',
        },
        {
          // cfx transfers
          title: [
            t(translations.header.cfxTransfers),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.cfxTransfers,
          href: '/blockchain/cfx-transfers',
        },
        {
          // accounts
          title: [
            t(translations.header.accounts),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.accounts,
          href: '/blockchain/accounts',
        },
      ],
    },
    // tokens
    {
      title: t(translations.header.tokens),
      matched: location?.pathname?.startsWith('/tokens'),
      children: [
        {
          // erc 20
          title: [
            t(translations.header.tokens20),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.tokens20,
          href: '/tokens/erc20',
        },
        {
          // erc 721
          title: [
            t(translations.header.tokens721),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.tokens721,
          href: '/tokens/erc721',
        },
        {
          // erc 1155
          title: [
            t(translations.header.tokens1155),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.tokens1155,
          href: '/tokens/erc1155',
        },
      ],
    },
    // contract
    {
      title: t(translations.header.contract),
      matched: contractMatched,
      children: [
        {
          // deploy
          title: [
            t(translations.header.contractDeployment),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.contractDeployment,
          href: '/contract-deployment',
        },
        {
          // create contract
          title: [
            t(translations.header.contractCreation),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.contractReg,
          href: '/contract',
        },
        {
          // sponsor
          title: [
            t(translations.header.contractSponsor),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.sponsor,
          href: '/sponsor',
        },
        {
          title: t(translations.header.contracts),
          name: ScanEvent.menu.action.contractsList,
          href: '/contracts',
        },
      ],
    },
    // charts
    {
      title: t(translations.header.chartsAndStatistics),
      matched: statisticsMatched,
      children: [
        {
          title: [
            t(translations.header.charts),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.charts,
          href: '/charts',
        },
        {
          title: [
            t(translations.header.statistics),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.statistics,
          href: '/statistics',
          isMatchedFn: () => !!location?.pathname?.startsWith('/statistics'),
        },
      ],
    },
    // more
    {
      title: t(translations.header.more),
      matched: moreMatched,
      children: [
        {
          title: [
            t(translations.header.addressConverter),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.addressConverter,
          href: '/address-converter',
        },
        {
          title: [
            t(translations.header.broadcastTx),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.broadcastTx,
          href: '/push-tx',
        },
        {
          title: [
            t(translations.header.blocknumberCalc),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.blocknumberCalc,
          href: '/block-countdown',
        },
      ],
    },
  ];

  const endLinks: HeaderLinks = [
    {
      // switch network
      name: 'switch-network',
      title: isTestnet
        ? t(translations.header.testnet)
        : t(translations.header.oceanus),
      children: [
        {
          // Tethys
          title: [
            t(translations.header.oceanus),
            !isTestnet && <Check size={18} key="check" />,
          ],
          onClick: () => {
            trackEvent({
              category: ScanEvent.preference.category,
              action: ScanEvent.preference.action.changeNet,
              label: 'Tethys',
            });
            return isTestnet && toMainnet();
          },
          isMatchedFn: () => !isTestnet,
        },
        {
          // testnet
          title: [
            t(translations.header.testnet),
            isTestnet && <Check size={18} key="check" />,
          ],
          onClick: () => {
            trackEvent({
              category: ScanEvent.preference.category,
              action: ScanEvent.preference.action.changeNet,
              label: 'Testnet',
            });
            return !isTestnet && toTestnet();
          },
          isMatchedFn: () => isTestnet,
        },
      ],
    },
  ];

  if (bp === 'm' || bp === 's') {
    endLinks.push({
      // switch language
      title: (
        <div className="header-link-lang-title" style={{ minWidth: '2.1rem' }}>
          {iszh ? zh : en}
        </div>
      ), // level 0 title
      children: [
        {
          // en
          title: [en, !iszh && <Check size={18} key="check" />],
          onClick: () => {
            trackEvent({
              category: ScanEvent.preference.category,
              action: ScanEvent.preference.action.changeLang,
              label: 'en',
            });
            return iszh && i18n.changeLanguage('en');
          },
          isMatchedFn: () => !iszh,
        },
        {
          // zh
          title: [zh, iszh && <Check size={18} key="check" />],
          onClick: () => {
            trackEvent({
              category: ScanEvent.preference.category,
              action: ScanEvent.preference.action.changeLang,
              label: 'zh-CN',
            });
            return !iszh && i18n.changeLanguage('zh-CN');
          },
          isMatchedFn: () => iszh,
        },
      ],
    });
  }

  const startLinksJSX = genParseLinkFn(startLinks);
  const endLinksJSX = genParseLinkFn(endLinks);

  const brand = (
    <LogoWrapper>
      <RouterLink to="/">
        <img
          className="confi-logo"
          alt="conflux scan logo"
          src={imgConfiPlanet}
        />
        <TextLogo />
      </RouterLink>
    </LogoWrapper>
  );
  const mainMenu = [...startLinksJSX];
  const topMenu = [
    bp !== 'm' && bp !== 's' && (
      <>
        <SearchWrapper>
          <Search />
        </SearchWrapper>
        <ConnectWallet />
      </>
    ),
    endLinksJSX,
  ];

  // TODO notice
  const subMenu = <div></div>;

  return (
    <Wrapper>
      <Nav
        brand={brand}
        mainMenu={mainMenu}
        topMenu={topMenu}
        subMenu={subMenu}
      />
      {(bp === 's' || bp === 'm') && (
        <SearchWrapper>
          <Search />
        </SearchWrapper>
      )}
    </Wrapper>
  );
});

const LogoWrapper = styled.div`
  .confi-logo {
    margin-right: 0.57rem;
    width: 3.3571rem;
  }
  a.link {
    display: flex;
    align-items: center;

    svg {
      ${media.m} {
        display: none;
      }
    }
  }
`;
const Wrapper = styled.header`
  .navbar-menu {
    .navbar-end {
      .navbar-item {
        .navbar-link-menu {
          .navbar-link.level-0 {
            padding: 0 0.57rem;
            svg {
              display: none;
            }
          }
        }
        &:nth-child(1) {
          flex-grow: 1;
          justify-content: flex-end;
        }
      }
    }
  }

  ${media.m} {
    .navbar-menu {
      background-color: #4a5064;
      padding: 1.64rem 5.14rem;
      padding-bottom: 3.86rem;

      .navbar-end {
        .navbar-item {
          flex-direction: row;
          align-items: baseline;

          .header-link-menu {
            padding-left: 0;
          }
          .navbar-link-menu {
            .navbar-link {
              &.level-0 {
                padding: 0.43rem 1.3rem;
                svg {
                  display: block;
                }
              }
            }
          }

          &:nth-child(1) {
            flex-grow: 0;
          }
        }
      }
    }
  }
  ${media.s} {
    .navbar-menu {
      padding-left: 3rem;
      padding-right: 3rem;
    }
  }
`;

const SearchWrapper = styled.div`
  flex-grow: 1;
  .header-search-container {
    max-width: unset;
  }
  ${media.m} {
    .header-search-container {
      position: fixed;
      flex-grow: 0;
      top: 11px;
      right: 4rem;
      left: 12rem;
      z-index: 2000;
    }
  }
  ${media.s} {
    .header-search-container {
      position: absolute;
      left: 0;
      right: 0;
      top: 5.67rem;
      z-index: 100;
    }
  }
`;
