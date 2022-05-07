/**
 *
 * Header
 *
 */

import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Search } from './Search';
import { ConnectWallet } from 'app/components/ConnectWallet';
import { media, useBreakpoint } from 'styles/media';
import { Nav } from 'app/components/Nav';
import { genParseLinkFn, HeaderLinks } from './HeaderLink';
import { Check } from '@zeit-ui/react-icons';
import { translations } from 'locales/i18n';
import { useLocation } from 'react-router';
import { ScanEvent } from 'utils/gaConstants';
import { trackEvent } from 'utils/ga';
import { useToggle } from 'react-use';
import { useGlobalData, GlobalDataType } from 'utils/hooks/useGlobal';
import { getNetwork, gotoNetwork } from 'utils';
import { NETWORK_TYPE, NETWORK_TYPES } from 'utils/constants';
import { Notices } from 'app/containers/Notices/Loadable';

import logo from 'images/logo.svg';
import logoTest from 'images/logo-test.svg';

export const Header = memo(() => {
  const [globalData, setGlobalData] = useGlobalData();
  const { networkId, networks } = globalData as GlobalDataType;

  const { t, i18n } = useTranslation();
  const zh = '中文';
  const en = 'EN';
  const iszh = i18n.language.includes('zh');

  const location = useLocation();
  // const contractMatched =
  //   location.pathname.startsWith('/sponsor') ||
  //   location.pathname.startsWith('/contract');
  const statisticsMatched =
    location.pathname.startsWith('/chart') ||
    location.pathname.startsWith('/statistics');
  const moreMatched =
    location.pathname.startsWith('/address-converter') ||
    location.pathname.startsWith('/push-tx') ||
    location.pathname.startsWith('/block-countdown') ||
    location.pathname.startsWith('/nft-checker');
  const blockchainMatched =
    location?.pathname?.startsWith('/blockchain') ||
    location.pathname.startsWith('/contract') ||
    location.pathname.startsWith('/sponsor');
  const ecosystemMatched = false;

  const bp = useBreakpoint();
  const [visible, toggleMenu] = useToggle(false);

  const menuClick = () => {
    if (bp === 's' || bp === 'm') toggleMenu(false);
  };

  const supportAndHelpMenuItems = [
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
      title: [t(translations.header.report), <Check size={18} key="check" />],
      name: ScanEvent.menu.action.report,
      afterClick: menuClick,
      href: '/report',
    },
    {
      title: [
        t(translations.header.supportCenter),
        <Check size={18} key="check" />,
      ],
      name: ScanEvent.menu.action.supportCenter,
      afterClick: menuClick,
      href: iszh
        ? 'https://confluxscansupportcenter.zendesk.com/hc/zh-cn'
        : 'https://confluxscansupportcenter.zendesk.com/hc/en-us',
    },
    {
      title: [
        t(translations.header.suggestionBox),
        <Check size={18} key="check" />,
      ],
      name: ScanEvent.menu.action.suggestionBox,
      afterClick: menuClick,
      href: iszh
        ? 'https://confluxscansupportcenter.zendesk.com/hc/zh-cn/requests/new'
        : 'https://confluxscansupportcenter.zendesk.com/hc/en-us/requests/new',
    },
  ];

  const ecosystemItems: any = [];

  const contractItems = [
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
      // contract verification
      title: [
        t(translations.header.contractVerification),
        <Check size={18} key="check" />,
      ],
      name: ScanEvent.menu.action.contractVerification,
      afterClick: menuClick,
      href: '/contract-verification',
    },
    {
      title: t(translations.header.contracts),
      name: ScanEvent.menu.action.contractsList,
      afterClick: menuClick,
      href: '/contracts',
    },
  ];

  ecosystemItems.push({
    title: [t(translations.header.fcCfx), <Check size={18} key="check" />],
    name: ScanEvent.menu.action.fcCfx,
    afterClick: menuClick,
    href: '/fccfx',
  });

  ecosystemItems.push({
    title: [t(translations.header.crossSpace), <Check size={18} key="check" />],
    name: ScanEvent.menu.action.crossSpace,
    afterClick: menuClick,
    href:
      NETWORK_TYPE === NETWORK_TYPES.testnet
        ? 'https://test.confluxhub.io/'
        : 'https://confluxhub.io/',
  });

  if ([NETWORK_TYPES.mainnet, NETWORK_TYPES.testnet].includes(NETWORK_TYPE)) {
    supportAndHelpMenuItems.unshift({
      title: [
        t(translations.header.developerAPI),
        <Check size={18} key="check" />,
      ],
      name: ScanEvent.menu.action.developerAPI,
      afterClick: menuClick,
      href:
        NETWORK_TYPE === NETWORK_TYPES.testnet
          ? 'https://api-testnet.confluxscan.net/doc'
          : 'https://api.confluxscan.net/doc',
    });

    ecosystemItems.unshift({
      title: [
        t(translations.header.stakingAndGovernance),
        <Check size={18} key="check" />,
      ],
      name: ScanEvent.menu.action.stakingAndGovernance,
      afterClick: menuClick,
      href: iszh
        ? NETWORK_TYPE === NETWORK_TYPES.testnet
          ? 'https://testnet-governance.confluxnetwork.org/zh/'
          : 'https://governance.confluxnetwork.org/zh/'
        : NETWORK_TYPE === NETWORK_TYPES.testnet
        ? 'https://testnet-governance.confluxnetwork.org/en/'
        : 'https://governance.confluxnetwork.org/en/',
    });

    contractItems.splice(2, 0, {
      // sponsor
      title: [
        t(translations.header.contractSponsor),
        <Check size={18} key="check" />,
      ],
      name: ScanEvent.menu.action.sponsor,
      afterClick: menuClick,
      href: '/sponsor',
    });
  }

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
      className: 'plain',
      matched: blockchainMatched,
      children: [
        {
          title: [
            t(translations.header.blockchain),
            <Check size={18} key="check" />,
          ],
          plain: true,
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
              title: [
                t(translations.header.txn),
                <Check size={18} key="check" />,
              ],
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
        {
          title: [
            t(translations.header.contract),
            <Check size={18} key="check" />,
          ],
          plain: true,
          children: contractItems,
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
    // pos
    {
      title: t(translations.header.pos.pos),
      matched: location?.pathname?.startsWith('/pos'),
      children: [
        {
          title: [
            t(translations.header.pos.overview),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.posOverview,
          afterClick: menuClick,
          href: '/pos',
        },
        {
          title: [
            t(translations.header.pos.blocks),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.posBlocks,
          afterClick: menuClick,
          href: '/pos/blocks',
        },
        {
          title: [
            t(translations.header.pos.transactions),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.posTransactions,
          afterClick: menuClick,
          href: '/pos/transactions',
        },
        {
          title: [
            t(translations.header.pos.accounts),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.posAccounts,
          afterClick: menuClick,
          href: '/pos/accounts',
        },
        {
          title: [
            t(translations.header.pos.committee),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.posCommittee,
          afterClick: menuClick,
          href: '/pos/committees',
        },
        {
          title: [
            t(translations.header.pos.incomingRank),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.incomingRank,
          afterClick: menuClick,
          href: '/pos/incoming-rank',
        },
      ],
    },
    // contract
    // {
    //   title: t(translations.header.contract),
    //   matched: contractMatched,
    //   children: [
    //     {
    //       // deploy
    //       title: [
    //         t(translations.header.contractDeployment),
    //         <Check size={18} key="check" />,
    //       ],
    //       name: ScanEvent.menu.action.contractDeployment,
    //       afterClick: menuClick,
    //       href: '/contract-deployment',
    //     },
    //     {
    //       // create contract
    //       title: [
    //         t(translations.header.contractCreation),
    //         <Check size={18} key="check" />,
    //       ],
    //       name: ScanEvent.menu.action.contractReg,
    //       afterClick: menuClick,
    //       href: '/contract',
    //     },
    //     {
    //       // sponsor
    //       title: [
    //         t(translations.header.contractSponsor),
    //         <Check size={18} key="check" />,
    //       ],
    //       name: ScanEvent.menu.action.sponsor,
    //       afterClick: menuClick,
    //       href: '/sponsor',
    //     },
    //     {
    //       title: t(translations.header.contracts),
    //       name: ScanEvent.menu.action.contractsList,
    //       afterClick: menuClick,
    //       href: '/contracts',
    //     },
    //   ],
    // },
    // charts
    {
      title: t(translations.header.chartsAndStatistics),
      matched: statisticsMatched,
      children: [
        {
          title: ['New Chart', <Check size={18} key="check" />],
          afterClick: menuClick,
          href: '/new-chart',
        },
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
    // ecosystem
    {
      title: t(translations.header.ecosystem),
      matched: ecosystemMatched,
      children: ecosystemItems,
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
            {
              title: [
                t(translations.header.nftChecker),
                <Check size={18} key="check" />,
              ],
              name: ScanEvent.menu.action.nftChecker,
              afterClick: menuClick,
              href: '/nft-checker',
            },
            {
              title: [
                t(translations.header.balanceChecker),
                <Check size={18} key="check" />,
              ],
              name: ScanEvent.menu.action.balanceChecker,
              afterClick: menuClick,
              href: '/balance-checker',
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
          children: supportAndHelpMenuItems,
        },
      ],
    },
  ];

  const endLinks: HeaderLinks = [
    {
      // switch network
      name: 'switch-network',
      title: getNetwork(networks, networkId).name,
      children: networks.map(n => {
        const isMatch = n.id === networkId;

        return {
          title: [n.name, isMatch && <Check size={18} key="check" />],
          onClick: () => {
            trackEvent({
              category: ScanEvent.preference.category,
              action: ScanEvent.preference.action.changeNet,
              label: n.name,
            });

            menuClick();

            setGlobalData({
              ...globalData,
              networkId: n.id,
            });

            gotoNetwork(n.id);
          },
          isMatchedFn: () => isMatch,
        };
      }),
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
          src={NETWORK_TYPE === NETWORK_TYPES.testnet ? logoTest : logo}
        />
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

  return (
    <Wrapper>
      <Nav
        visible={visible}
        toggleMenu={toggleMenu}
        brand={brand}
        mainMenu={mainMenu}
        topMenu={topMenu}
        subMenu={<Notices />}
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
    height: 2rem;
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
