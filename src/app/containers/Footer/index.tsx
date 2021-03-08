/**
 *
 * Footer
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { Link } from '../../components/Link/Loadable';
import { media } from 'styles/media';
import { Footer as FooterComp } from '../../components/Footer/Loadable';
import { TextLogo } from '../../components/TextLogo/Loadable';
import { translations } from 'locales/i18n';
import imgIconTwitter from 'images/icon-twitter.svg';
import imgIconGithub from 'images/icon-github.svg';
import imgIconMedium from 'images/icon-medium.svg';
import { Language } from './Language';

export function Footer() {
  const { t } = useTranslation();

  const left = [<TextLogo key="logo" />];

  const websiteLink = (
    <Link className="footer-link" href="https://confluxnetwork.org">
      {t(translations.footer.confluxnetwork)}
    </Link>
  );
  const portalLink = (
    <Link className="footer-link" href="https://portal.conflux-chain.org">
      {t(translations.footer.confluxportal)}
    </Link>
  );
  const bountyLink = (
    <Link className="footer-link" href="https://bounty.conflux-chain.org">
      {t(translations.footer.confluxbounty)}
    </Link>
  );
  const addressConverterLink = (
    <Link className="footer-link" href="/address-converter">
      {t(translations.footer.addressFormatConversion)}
    </Link>
  );
  const broadcastTxLink = (
    <Link className="footer-link" href="/push-tx">
      {t(translations.footer.broadcastTx)}
    </Link>
  );
  const blocknumberCalcLink = (
    <Link className="footer-link" href="/block-countdown">
      {t(translations.footer.blocknumberCalc)}
    </Link>
  );

  const icons = (
    <FooterContentIconWrapper>
      <FooterContentIconLink key="1">
        <Link href="https://twitter.com/Conflux_Network">
          <img alt="twitter icon" src={imgIconTwitter} />
        </Link>
      </FooterContentIconLink>
      <FooterContentIconLink key="2">
        <Link href="https://github.com/conflux-chain">
          <img alt="github icon" src={imgIconGithub} />
        </Link>
      </FooterContentIconLink>
      <FooterContentIconLink key="3">
        <Link href="https://medium.com/conflux-network">
          <img alt="medium icon" src={imgIconMedium} />
        </Link>
      </FooterContentIconLink>
    </FooterContentIconWrapper>
  );

  const rightTop = [
    <FooterWrapper key="right-top">
      <FooterContentWrapper>
        <FooterContentTitle>
          {t(translations.footer.product)}
        </FooterContentTitle>
        <FooterContent>
          <FooterContentRow>
            <FooterContentLink key="1-1">{websiteLink}</FooterContentLink>
            <FooterContentLink key="1-2">{portalLink}</FooterContentLink>
            <FooterContentLink key="1-3">{bountyLink}</FooterContentLink>
          </FooterContentRow>
        </FooterContent>
      </FooterContentWrapper>
      <FooterContentWrapper>
        <FooterContentTitle>{t(translations.footer.tool)}</FooterContentTitle>
        <FooterContent>
          <FooterContentRow>
            <FooterContentLink key="2-1">
              {addressConverterLink}
            </FooterContentLink>
            <FooterContentLink key="2-2">{broadcastTxLink}</FooterContentLink>
            <FooterContentLink key="2-3">
              {blocknumberCalcLink}
            </FooterContentLink>
          </FooterContentRow>
        </FooterContent>
      </FooterContentWrapper>
      <FooterContentWrapper className="preference">
        <FooterContentTitle>
          {t(translations.footer.preference)}
        </FooterContentTitle>
        <FooterContent>
          <FooterContentRow>
            <FooterContentLink key="3-1">
              <Language />
            </FooterContentLink>
          </FooterContentRow>
        </FooterContent>
      </FooterContentWrapper>
    </FooterWrapper>,
    <FooterContentRow key="right-top-icons">{icons}</FooterContentRow>,
  ];
  const rightBottom = [
    <CopyRight key="copyright">{t(translations.footer.copryRight)}</CopyRight>,
  ];

  return (
    <FooterComp left={left} rightTop={rightTop} rightBottom={rightBottom} />
  );
}

// wrapper
const FooterWrapper = styled.div`
  display: flex;
  flex-direction: row;

  ${media.s} {
    flex-flow: wrap;
    /* flex-direction: column; */
  }
`;
const FooterContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  ${media.s} {
    margin-bottom: 1.1429rem;
    width: 50%;
  }
`;

// right top
const FooterContentTitle = styled.span`
  margin-bottom: 1.07rem;
  font-weight: 600;
  color: #000558;

  ${media.s} {
    margin-bottom: 0.86rem;
  }
`;
const FooterContent = styled.div`
  font-size: 0.86rem;
  display: flex;
  flex-direction: row;
`;

const FooterContentRow = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterContentLink = styled.span`
  margin-bottom: 0.5rem;

  .link.footer-link {
    color: black;
    font-size: 0.86rem;
    margin-right: 5.1429rem;

    ${media.s} {
      margin-right: inherit;
    }
  }

  ${media.s} {
    .link.footer-link {
      font-size: 0.71rem;
    }
  }
`;
const FooterContentIconWrapper = styled.div`
  margin-top: 1.14rem;
`;
const FooterContentIconLink = styled.span`
  margin-right: 0.57rem;
  img {
    width: 1rem;
  }

  ${media.s} {
    margin-top: 0.86rem;
  }
`;

const CopyRight = styled.span`
  opacity: 0.38;

  ${media.s} {
    font-size: 0.71rem;
  }
`;
