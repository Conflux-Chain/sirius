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
import { CurrentTestnetNotice, CurrentTethysNotice } from '../Notices/notices';
import imgNotice from 'images/notice2.png';
import { Link } from '../../components/Link/Loadable';
import { useToggle } from 'react-use';

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
    location.pathname.startsWith('/chart') ||
    location.pathname.startsWith('/statistics');
  const moreMatched =
    location.pathname.startsWith('/address-converter') ||
    location.pathname.startsWith('/push-tx') ||
    location.pathname.startsWith('/block-countdown');
  const bp = useBreakpoint();
  const [visible, toggleMenu] = useToggle(false);

  const menuClick = () => {
    if (bp === 's' || bp === 'm') toggleMenu(false);
  };

  const startLinks: HeaderLinks = [
    {
      // home
      title: t(translations.header.home),
      name: ScanEvent.menu.action.home,
      afterClick: menuClick,
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
          afterClick: menuClick,
          href: '/blockchain/blocks',
        },
        {
          // txn
          title: [t(translations.header.txn), <Check size={18} key="check" />],
          name: ScanEvent.menu.action.transactions,
          afterClick: menuClick,
          href: '/blockchain/transactions',
        },
        {
          // accounts
          title: [
            t(translations.header.accounts),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.accounts,
          afterClick: menuClick,
          href: '/blockchain/accounts',
        },
        {
          // cfx transfers
          title: [
            t(translations.header.cfxTransfers),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.cfxTransfers,
          afterClick: menuClick,
          href: '/blockchain/cfx-transfers',
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
          afterClick: menuClick,
          href: '/tokens/crc20',
        },
        {
          // erc 721
          title: [
            t(translations.header.tokens721),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.tokens721,
          afterClick: menuClick,
          href: '/tokens/crc721',
        },
        {
          // erc 1155
          title: [
            t(translations.header.tokens1155),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.tokens1155,
          afterClick: menuClick,
          href: '/tokens/crc1155',
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
          afterClick: menuClick,
          href: '/contract-deployment',
        },
        {
          // create contract
          title: [
            t(translations.header.contractCreation),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.contractReg,
          afterClick: menuClick,
          href: '/contract',
        },
        {
          // sponsor
          title: [
            t(translations.header.contractSponsor),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.sponsor,
          afterClick: menuClick,
          href: '/sponsor',
        },
        {
          title: t(translations.header.contracts),
          name: ScanEvent.menu.action.contractsList,
          afterClick: menuClick,
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
          afterClick: menuClick,
          href: '/charts',
        },
        {
          title: [
            t(translations.header.statistics),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.statistics,
          afterClick: menuClick,
          href: '/statistics',
          isMatchedFn: () => !!location?.pathname?.startsWith('/statistics'),
        },
      ],
    },
    // more
    {
      title: t(translations.header.more),
      matched: moreMatched,
      className: 'plain',
      children: [
        {
          title: [
            t(translations.header.tools),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.tools,
          plain: true,
          children: [
            {
              title: [
                t(translations.header.addressConverter),
                <Check size={18} key="check" />,
              ],
              name: ScanEvent.menu.action.addressConverter,
              afterClick: menuClick,
              href: '/address-converter',
            },
            {
              title: [
                t(translations.header.broadcastTx),
                <Check size={18} key="check" />,
              ],
              name: ScanEvent.menu.action.broadcastTx,
              afterClick: menuClick,
              href: '/push-tx',
            },
            {
              title: [
                t(translations.header.blocknumberCalc),
                <Check size={18} key="check" />,
              ],
              name: ScanEvent.menu.action.blocknumberCalc,
              afterClick: menuClick,
              href: '/block-countdown',
            },
          ],
        },
        {
          title: [
            t(translations.header.support),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.support,
          plain: true,
          children: [
            // {
            //   title: [
            //     t(translations.header.faq),
            //     <Check size={18} key="check" />,
            //   ],
            //   name: ScanEvent.menu.action.faq,
            //   afterClick: menuClick,
            //   href: '/faq',
            // },
            {
              title: [
                t(translations.header.techIssue),
                <Check size={18} key="check" />,
              ],
              name: ScanEvent.menu.action.techIssue,
              afterClick: menuClick,
              href: 'https://github.com/Conflux-Chain/sirius/issues',
            },
            {
              title: [
                t(translations.header.report),
                <Check size={18} key="check" />,
              ],
              name: ScanEvent.menu.action.report,
              afterClick: menuClick,
              href: '/report',
            },
          ],
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
            menuClick();
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
            menuClick();
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
            menuClick();
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
            menuClick();
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
        <WalletWrapper>
          <ConnectWallet />
        </WalletWrapper>
      </>
    ),
    endLinksJSX,
  ];

  // notice
  const subMenu = (
    <NoticeWrapper className="notice">
      <img src={imgNotice} alt="" />
      <div
        className={`content ${
          (isTestnet ? CurrentTestnetNotice.hot : CurrentTethysNotice.hot)
            ? 'hot'
            : ''
        }`}
      >
        {isTestnet
          ? CurrentTestnetNotice[iszh ? 'zh' : 'en']
          : CurrentTethysNotice[iszh ? 'zh' : 'en']}
      </div>
      <Link href="/notices" className="more">
        {t(translations.header.learnMore)}
      </Link>
    </NoticeWrapper>
  );

  return (
    <Wrapper>
      <Nav
        visible={visible}
        toggleMenu={toggleMenu}
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

const WalletWrapper = styled.div`
  min-width: 180px;

  .connect-wallet-button.notConnected {
    .connect-wallet-button-left {
      //color: #fff;
      width: 100%;
      justify-content: center;
      //background: #424a71;
      &:hover {
        //background: #68719c;
      }
    }
  }
`;

const NoticeWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;

  img {
    width: 16px;
    height: 16px;
    margin-right: 10px;
  }

  .content {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #6c6d75;

    &.hot {
      color: #e64e4e;
    }
  }

  .more {
    white-space: nowrap;
    margin-left: 24px;
    margin-right: 10px;
    border-bottom: 1px solid #1e3de4;

    &:hover,
    &:active {
      border-bottom: 1px solid #0f23bd;
    }
  }
`;
