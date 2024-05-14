/**
 *
 * Header
 *
 */

import React, { memo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'sirius-next/packages/common/dist/components/Link';
import { Search } from './Search';
import { ConnectWallet } from 'app/components/ConnectWallet';
import {
  useBreakpoint,
  media,
} from 'sirius-next/packages/common/dist/utils/media';
import { Nav } from 'app/components/Nav';
import { genParseLinkFn, HeaderLinks } from './HeaderLink';
import { Check } from '@zeit-ui/react-icons';
import { translations } from 'locales/i18n';
import { useLocation } from 'react-router';
import { ScanEvent } from 'utils/gaConstants';
import { trackEvent } from 'utils/ga';
import { useToggle } from 'react-use';
import { useGlobalData } from 'utils/hooks/useGlobal';
import { getNetwork, getNetworkIcon, gotoNetwork } from 'utils';
import { HIDE_IN_DOT_NET } from 'utils/constants';
import { Notices } from 'app/containers/Notices/Loadable';
import { GasPriceDropdown } from 'sirius-next/packages/common/dist/components/GasPriceDropdown';

import ENV_CONFIG, { DOMAIN, NETWORK_TYPES } from 'env';

export const Header = memo(() => {
  const [globalData, setGlobalData] = useGlobalData();
  const { networkId, networks } = globalData;

  const { t, i18n } = useTranslation();
  const zh = '中文';
  const en = 'EN';
  const iszh = i18n.language.includes('zh');

  const location = useLocation();
  // const contractMatched =
  //   location.pathname.startsWith('/sponsor') ||
  //   location.pathname.startsWith('/contract');
  const statisticsMatched =
    location.pathname.startsWith('/pow-charts') ||
    location.pathname.startsWith('/pos-charts') ||
    location.pathname.startsWith('/cross-space-charts') ||
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

  const toolItems = [
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
      title: [t(translations.header.cns), <Check size={18} key="check" />],
      name: ScanEvent.menu.action.cns,
      afterClick: menuClick,
      href: '/cns-search',
    },
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
      // profile
      title: [t(translations.header.profile), <Check size={18} key="check" />],
      name: ScanEvent.menu.action.home,
      afterClick: menuClick,
      href: '/profile',
      className: 'profile',
    },
    {
      title: [t(translations.header.approval), <Check size={18} key="check" />],
      name: ScanEvent.menu.action.approval,
      afterClick: menuClick,
      href: '/approval',
    },
  ];

  const tokenItems = [
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
  ];

  const blockchainItems = [
    {
      // block
      title: [t(translations.header.block), <Check size={18} key="check" />],
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
      title: [t(translations.header.accounts), <Check size={18} key="check" />],
      name: ScanEvent.menu.action.accounts,
      afterClick: menuClick,
      href: '/blockchain/accounts',
    },
  ];

  const posItems = [
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
  ];

  const chartItems = [
    {
      title: [t(translations.header.charts), <Check size={18} key="check" />],
      name: ScanEvent.menu.action.charts,
      afterClick: menuClick,
      href: '/pow-charts',
    },
    {
      title: [
        t(translations.header.posCharts),
        <Check size={18} key="check" />,
      ],
      name: ScanEvent.menu.action.posCharts,
      afterClick: menuClick,
      href: '/pos-charts',
    },
    {
      title: [
        t(translations.header.nftCharts),
        <Check size={18} key="check" />,
      ],
      name: ScanEvent.menu.action.nftCharts,
      afterClick: menuClick,
      href: '/nft-charts',
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
      ENV_CONFIG.ENV_NETWORK_TYPE === NETWORK_TYPES.CORE_TESTNET
        ? 'https://test.confluxhub.io/'
        : 'https://confluxhub.io/',
  });
  if (
    [NETWORK_TYPES.CORE_MAINNET, NETWORK_TYPES.CORE_TESTNET].includes(
      ENV_CONFIG.ENV_NETWORK_TYPE,
    )
  ) {
    supportAndHelpMenuItems.unshift({
      title: [
        t(translations.header.developerAPI),
        <Check size={18} key="check" />,
      ],
      name: ScanEvent.menu.action.developerAPI,
      afterClick: menuClick,
      href:
        ENV_CONFIG.ENV_NETWORK_TYPE === NETWORK_TYPES.CORE_TESTNET
          ? `https://api-testnet.confluxscan${DOMAIN}/doc`
          : `https://api.confluxscan${DOMAIN}/doc`,
    });

    ecosystemItems.unshift({
      title: [
        t(translations.header.stakingAndGovernance),
        <Check size={18} key="check" />,
      ],
      name: ScanEvent.menu.action.stakingAndGovernance,
      afterClick: menuClick,
      href:
        ENV_CONFIG.ENV_NETWORK_TYPE === NETWORK_TYPES.CORE_TESTNET
          ? 'https://test.confluxhub.io/governance/'
          : 'https://confluxhub.io/governance/',
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

  if (ENV_CONFIG.ENV_NETWORK_TYPE === NETWORK_TYPES.CORE_TESTNET) {
    toolItems.push({
      title: [t(translations.header.faucet), <Check size={18} key="check" />],
      name: ScanEvent.menu.action.faucet,
      afterClick: menuClick,
      href: 'https://faucet.confluxnetwork.org/',
    });
  }

  if (!HIDE_IN_DOT_NET) {
    tokenItems.unshift({
      // erc 20
      title: [t(translations.header.tokens20), <Check size={18} key="check" />],
      name: ScanEvent.menu.action.tokens20,
      afterClick: menuClick,
      href: '/tokens/crc20',
    });

    blockchainItems.push({
      // cfx transfers
      title: [
        t(translations.header.cfxTransfers),
        <Check size={18} key="check" />,
      ],
      name: ScanEvent.menu.action.cfxTransfers,
      afterClick: menuClick,
      href: '/blockchain/cfx-transfers',
    });

    posItems.push({
      title: [
        t(translations.header.pos.incomingRank),
        <Check size={18} key="check" />,
      ],
      name: ScanEvent.menu.action.incomingRank,
      afterClick: menuClick,
      href: '/pos/incoming-rank',
    });

    chartItems.splice(3, 0, {
      title: [
        t(translations.header.crossSpaceCharts),
        <Check size={18} key="check" />,
      ],
      name: ScanEvent.menu.action.crossSpaceCharts,
      afterClick: menuClick,
      href: '/cross-space-charts',
    });

    toolItems.splice(4, 0, {
      title: [
        t(translations.header.balanceChecker),
        <Check size={18} key="check" />,
      ],
      name: ScanEvent.menu.action.balanceChecker,
      afterClick: menuClick,
      href: '/balance-checker',
    });

    supportAndHelpMenuItems.splice(-1, 0, {
      title: [
        t(translations.header.supportCenter),
        <Check size={18} key="check" />,
      ],
      name: ScanEvent.menu.action.supportCenter,
      afterClick: menuClick,
      href: iszh
        ? 'https://confluxscansupportcenter.zendesk.com/hc/zh-cn'
        : 'https://confluxscansupportcenter.zendesk.com/hc/en-us',
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
          children: blockchainItems,
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
      children: tokenItems,
    },
    // pos
    {
      title: HIDE_IN_DOT_NET
        ? t(translations.header.pos.posNickname)
        : t(translations.header.pos.pos),
      matched:
        location?.pathname?.startsWith('/pos/') ||
        location?.pathname === '/pos',
      children: posItems,
    },
    // charts
    {
      title: t(translations.header.chartsAndStatistics),
      matched: statisticsMatched,
      children: chartItems,
    },
    // ecosystem
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
          children: toolItems,
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

  if (!HIDE_IN_DOT_NET) {
    startLinks.splice(5, 0, {
      title: t(translations.header.ecosystem),
      matched: ecosystemMatched,
      children: ecosystemItems,
    });
  }

  const endLinks: HeaderLinks = [
    // {
    //   // profile
    //   title: t(translations.header.profile),
    //   name: ScanEvent.menu.action.home,
    //   afterClick: menuClick,
    //   href: '/profile',
    //   className: 'profile',
    // },
    {
      // switch network
      name: 'switch-network',
      title: (
        <NetWorkWrapper>
          <img src={getNetworkIcon(networkId)} alt="Network" />
          {getNetwork(networks, networkId).name}
        </NetWorkWrapper>
      ),
      children: networks
        .filter(n => {
          if (HIDE_IN_DOT_NET) {
            return n.id !== 1030 && n.id !== 71;
          }
          return n;
        })
        .map(n => {
          const isMatch = n.id === networkId;
          return {
            title: [
              <NetWorkWrapper>
                <img src={getNetworkIcon(n.id)} alt="" />
                {n.name}
              </NetWorkWrapper>,
              isMatch && <Check size={18} key="check" />,
            ],
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

              gotoNetwork(n.url);
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
            if (iszh) {
              i18n.changeLanguage('en');
            }
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
            if (!iszh) {
              i18n.changeLanguage('zh-CN');
            }
          },
          isMatchedFn: () => iszh,
        },
      ],
    });
  }

  const startLinksJSX = genParseLinkFn(startLinks);
  const endLinksJSX = genParseLinkFn(endLinks);
  const gasPriceJSX = (
    <div className="nav-gasprice">
      <GasPriceDropdown />
    </div>
  );

  const brand = (
    <LogoWrapper>
      <Link href="/">
        <img
          className="confi-logo"
          alt="conflux scan logo"
          src={ENV_CONFIG.ENV_LOGO}
        />
      </Link>
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
    gasPriceJSX,
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
    .nav-gasprice {
      display: none;
    }
    .navbar-menu {
      background-color: #4a5064;
      padding: 1.64rem 5.14rem;
      padding-bottom: 3.86rem;

      .navbar-end {
        .navbar-item {
          display: flex;
          align-items: flex-start !important;
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

const NetWorkWrapper = styled.div`
  display: flex;
  gap: 4px;
`;
