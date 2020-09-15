/**
 *
 * Header
 *
 */

import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@cfxjs/react-ui';
import styled from 'styled-components/macro';
import { TextLogo } from './TextLogo';
import { media, useBreakpoint } from 'styles/media';
import { Nav } from '../../components/Nav';
import { generateHeaderLinksJSX, HeaderLinks } from './HeaderLink';
import { Check } from '@geist-ui/react-icons';
import { useTestnet, toTestnet, toMainnet } from 'utils/hooks/useTestnet';
import { translations } from 'locales/i18n';

export const Header = memo(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    '/blocktxn',
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
        <TextLogo />
      </Link>
    </LogoWrapper>
  );
  const menuStart = [bp === 's' && <TextLogo />, ...startLinksJSX];
  const menuEnd = endLinksJSX;

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
      ${media.s} {
        display: none;
      }
    }
  }
`;
const Wrapper = styled.header`
  ${media.s} {
    .navbar-menu {
      background-color: #4a5064;
      padding: 1.64rem 5.14rem;
      padding-bottom: 3.86rem;
      .navbar-end {
        flex-direction: row;
      }
      .navbar-start {
        .navbar-item:nth-child(1) {
          margin-bottom: 3rem;
        }
      }
      .navbar-end {
        .header-link-menu {
          padding-left: 0;
        }
      }
    }
  }
`;
