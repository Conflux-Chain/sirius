/**
 *
 * Header
 *
 */

import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { TextLogo } from '../../components/TextLogo';
import { Search } from './Search';
// import { ConnectWallet } from '../../components/ConnectWallet';
import { media, useBreakpoint } from 'styles/media';
import { Nav } from '../../components/Nav';
import { genParseLinkFn, HeaderLinks } from './HeaderLink';
import { Check } from '@zeit-ui/react-icons';
import { useTestnet, toTestnet, toMainnet } from 'utils/hooks/useTestnet';
import { translations } from 'locales/i18n';
import { useLocation } from 'react-use';
import imgConfiPlanet from 'images/confi-planet.png';

export const Header = memo(() => {
  const { t, i18n } = useTranslation();
  const zh = '中文';
  const en = 'EN';
  const iszh = i18n.language.includes('zh');
  const isTestnet = useTestnet();

  const location = useLocation();
  const contractMatched =
    location?.pathname?.startsWith('/sponsor') ||
    location?.pathname?.startsWith('/contract');
  const bp = useBreakpoint();

  const startLinks: HeaderLinks = [
    {
      // home
      title: t(translations.header.home),
      href: '/',
    },
    // blocks and transactions
    { title: t(translations.header.bnt), href: '/blocks-and-transactions' },
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
          href: '/tokens/erc20',
        },
        {
          // erc 721
          title: [
            t(translations.header.tokens721),
            <Check size={18} key="check" />,
          ],
          href: '/tokens/erc721',
        },
        {
          // erc 1155
          title: [
            t(translations.header.tokens1155),
            <Check size={18} key="check" />,
          ],
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
          // create contract
          title: [
            t(translations.header.contractCreation),
            <Check size={18} key="check" />,
          ],
          href: '/contract',
        },
        {
          // sponsor
          title: [
            t(translations.header.contractSponsor),
            <Check size={18} key="check" />,
          ],
          href: '/sponsor',
        },
        { title: t(translations.header.contracts), href: '/contracts' },
      ],
    },
    // charts
    { title: t(translations.header.charts), href: '/charts' },
  ];

  const endLinks: HeaderLinks = [
    {
      // switch network
      title: isTestnet
        ? t(translations.header.testnet)
        : t(translations.header.oceanus),
      children: [
        {
          // oceanus
          title: [
            t(translations.header.oceanus),
            !isTestnet && <Check size={18} key="check" />,
          ],
          onClick: () => isTestnet && toMainnet(),
          isMatchedFn: () => !isTestnet,
        },
        {
          // testnet
          title: [
            t(translations.header.testnet),
            isTestnet && <Check size={18} key="check" />,
          ],
          onClick: () => !isTestnet && toTestnet(),
          isMatchedFn: () => isTestnet,
        },
      ],
    },
    {
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
          onClick: () => iszh && i18n.changeLanguage('en'),
          isMatchedFn: () => !iszh,
        },
        {
          // zh
          title: [zh, iszh && <Check size={18} key="check" />],
          onClick: () => !iszh && i18n.changeLanguage('zh-CN'),
          isMatchedFn: () => iszh,
        },
      ],
    },
  ];

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
        {bp !== 's' && bp !== 'm' && <TextLogo changeColorOnMobile />}
      </RouterLink>
    </LogoWrapper>
  );
  const menuStart = [
    (bp === 'm' || bp === 's') && <TextLogo />,
    ...startLinksJSX,
  ];
  const menuEnd = [
    bp !== 'm' && bp !== 's' && (
      <>
        <Search />
        {/* <ConnectWallet /> */}
      </>
    ),
    endLinksJSX,
  ];

  return (
    <Wrapper>
      <Nav brand={brand} menuStart={menuStart} menuEnd={menuEnd} />
      {(bp === 's' || bp === 'm') && <Search />}
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
            padding: 0.43rem 0.57rem;
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

      .navbar-start {
        .navbar-item:nth-child(1) {
          margin-bottom: 3rem;
        }
      }

      .navbar-end {
        .navbar-item {
          flex-direction: row;
          align-items: baseline;

          .header-link-menu {
            padding-left: 0;
          }
          .navbar-link-menu {
            .navbar-link {
              padding: 0.43rem 1.5rem;
              &.level-0 {
                padding: 0.43rem 1.5rem;
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
`;
