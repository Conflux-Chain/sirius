/**
 *
 * Header
 *
 */

import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Link } from '@cfxjs/react-ui';
import { TextLogo } from '../../components/TextLogo';
import { Search } from './Search/Loadable';
import { media, useBreakpoint } from 'styles/media';
import { Nav } from '../../components/Nav';
import { generateHeaderLinksJSX, HeaderLinks } from './HeaderLink';
import { Check } from '@geist-ui/react-icons';
import { useTestnet, toTestnet, toMainnet } from 'utils/hooks/useTestnet';
import { translations } from 'locales/i18n';

export const Header = memo(() => {
  const { t, i18n } = useTranslation();
  const zh = '中文';
  const en = 'EN';
  const iszh = i18n.language.includes('zh');
  const isTestnet = useTestnet();

  const bp = useBreakpoint();
  const startLinks: HeaderLinks = [
    t(translations.header.home),
    '/',
    t(translations.header.bnt),
    '/blocks-and-transactions',
    t(translations.header.tokens),
    '/tokens',
    t(translations.header.contract),
    [
      [t(translations.header.contractCreation), <Check key="check" />],
      '/contract-creatation',
      [t(translations.header.contractSponsor), <Check key="check" />],
      '/contract-sponsor',
    ],
    t(translations.header.charts),
    '/charts',
  ];

  const endLinks: HeaderLinks = [
    iszh ? zh : en,
    [iszh ? en : zh, () => i18n.changeLanguage(iszh ? 'en' : 'zh-CN')],
    isTestnet ? t(translations.header.testnet) : t(translations.header.oceanus),
    [
      isTestnet
        ? t(translations.header.oceanus)
        : t(translations.header.testnet),
      isTestnet ? toMainnet : toTestnet,
    ],
  ];

  const startLinksJSX = generateHeaderLinksJSX(startLinks);
  const endLinksJSX = generateHeaderLinksJSX(endLinks);

  const brand = (
    <LogoWrapper>
      <Link>
        <img alt="conflux scan logo" src="confi-planet.png" />
        <TextLogo changeColorOnMobile />
      </Link>
    </LogoWrapper>
  );
  const menuStart = [
    (bp === 'm' || bp === 's') && <TextLogo />,
    ...startLinksJSX,
  ];
  const menuEnd = [<Search />, endLinksJSX];

  return (
    <Wrapper>
      <Nav brand={brand} menuStart={menuStart} menuEnd={menuEnd} />
    </Wrapper>
  );
});

const LogoWrapper = styled.div`
  a.link {
    dislay: flex;
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
